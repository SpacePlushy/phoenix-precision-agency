#!/bin/bash

# Dark Mode Feature Rollback Script
# Use this script to quickly rollback the dark mode feature if issues are detected

set -e

echo "🔄 Dark Mode Feature Rollback Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "error")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "success")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        *)
            echo "$message"
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
    print_status "error" "This script must be run from the project root directory"
    exit 1
fi

# Parse command line arguments
ROLLBACK_TYPE="soft" # soft or hard
SKIP_CONFIRMATION=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --hard)
            ROLLBACK_TYPE="hard"
            shift
            ;;
        --yes)
            SKIP_CONFIRMATION=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --hard    Perform hard rollback (git revert)"
            echo "  --yes     Skip confirmation prompts"
            echo "  --help    Show this help message"
            exit 0
            ;;
        *)
            print_status "error" "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Show rollback plan
echo ""
echo "Rollback Type: ${ROLLBACK_TYPE^^}"
echo ""

if [ "$ROLLBACK_TYPE" == "soft" ]; then
    echo "Soft Rollback will:"
    echo "  1. Disable dark mode feature flag"
    echo "  2. Clear Redis cache for theme preferences"
    echo "  3. Update environment variables"
    echo "  4. No code changes required"
    echo ""
else
    echo "Hard Rollback will:"
    echo "  1. Revert the merge commit"
    echo "  2. Push changes to main branch"
    echo "  3. Trigger new deployment"
    echo "  4. Clear all theme data"
    echo ""
fi

# Confirmation
if [ "$SKIP_CONFIRMATION" != true ]; then
    read -p "Continue with rollback? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "warning" "Rollback cancelled"
        exit 0
    fi
fi

# Function to update feature flag
update_feature_flag() {
    print_status "warning" "Updating feature flag..."
    
    # Create temporary env file
    cat > .env.rollback << EOF
NEXT_PUBLIC_FEATURE_DARK_MODE=false
EOF
    
    # If .env.local exists, append to it
    if [ -f ".env.local" ]; then
        grep -v "NEXT_PUBLIC_FEATURE_DARK_MODE" .env.local > .env.local.tmp || true
        cat .env.local.tmp .env.rollback > .env.local
        rm .env.local.tmp
    else
        mv .env.rollback .env.local
    fi
    
    rm -f .env.rollback
    
    print_status "success" "Feature flag disabled"
}

# Function to clear Redis cache
clear_redis_cache() {
    print_status "warning" "Clearing Redis theme cache..."
    
    # Create Node.js script to clear cache
    cat > clear-theme-cache.js << 'EOF'
const { Redis } = require('@upstash/redis');

async function clearThemeCache() {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    
    // Get all theme-related keys
    const keys = await redis.keys('user:*:preferences:theme');
    
    if (keys.length > 0) {
      // Delete all theme preferences
      await Promise.all(keys.map(key => redis.del(key)));
      console.log(`Cleared ${keys.length} theme preferences`);
    } else {
      console.log('No theme preferences found in cache');
    }
    
    // Clear feature flags
    const flagKeys = await redis.keys('feature-flag:dark-mode:*');
    if (flagKeys.length > 0) {
      await Promise.all(flagKeys.map(key => redis.del(key)));
      console.log(`Cleared ${flagKeys.length} feature flag entries`);
    }
    
  } catch (error) {
    console.error('Failed to clear Redis cache:', error.message);
  }
}

clearThemeCache();
EOF
    
    # Run the script
    if command -v node &> /dev/null; then
        node clear-theme-cache.js
    else
        print_status "warning" "Node.js not found, skipping Redis cache clear"
    fi
    
    rm -f clear-theme-cache.js
}

# Perform rollback based on type
if [ "$ROLLBACK_TYPE" == "soft" ]; then
    echo ""
    print_status "warning" "Starting soft rollback..."
    
    # Update feature flag
    update_feature_flag
    
    # Clear Redis cache
    clear_redis_cache
    
    # Create rollback marker
    echo "$(date): Soft rollback performed" >> .rollback.log
    
    print_status "success" "Soft rollback completed"
    echo ""
    echo "Next steps:"
    echo "  1. Commit the .env.local changes"
    echo "  2. Push to trigger deployment"
    echo "  3. Monitor the application"
    
else
    echo ""
    print_status "warning" "Starting hard rollback..."
    
    # Get the merge commit hash
    MERGE_COMMIT=$(git log --grep="Dark Mode Implementation" --merges -n 1 --format="%H")
    
    if [ -z "$MERGE_COMMIT" ]; then
        print_status "error" "Could not find dark mode merge commit"
        exit 1
    fi
    
    print_status "warning" "Found merge commit: $MERGE_COMMIT"
    
    # Create revert commit
    git revert -m 1 $MERGE_COMMIT --no-edit
    
    # Update feature flag
    update_feature_flag
    
    # Clear Redis cache
    clear_redis_cache
    
    # Add env changes to revert commit
    git add .env.local
    git commit --amend --no-edit
    
    # Create rollback marker
    echo "$(date): Hard rollback performed (commit: $MERGE_COMMIT)" >> .rollback.log
    git add .rollback.log
    git commit --amend --no-edit
    
    print_status "success" "Hard rollback completed"
    echo ""
    echo "Next steps:"
    echo "  1. Review the revert commit"
    echo "  2. Push to main branch: git push origin main"
    echo "  3. Monitor the deployment"
fi

# Generate rollback report
cat > ROLLBACK_REPORT.md << EOF
# Dark Mode Rollback Report

**Date**: $(date)
**Type**: ${ROLLBACK_TYPE^^}
**Operator**: $(git config user.name)

## Actions Taken
EOF

if [ "$ROLLBACK_TYPE" == "soft" ]; then
    cat >> ROLLBACK_REPORT.md << EOF
- Feature flag disabled (NEXT_PUBLIC_FEATURE_DARK_MODE=false)
- Redis theme cache cleared
- No code changes made

## Verification Steps
1. Check that dark mode toggle is hidden
2. Verify no theme-related console errors
3. Confirm performance metrics are normal
EOF
else
    cat >> ROLLBACK_REPORT.md << EOF
- Reverted merge commit: $MERGE_COMMIT
- Feature flag disabled
- Redis theme cache cleared
- Code changes reverted

## Verification Steps
1. Check that all dark mode code is removed
2. Verify build succeeds
3. Confirm no theme-related imports remain
4. Test application functionality
EOF
fi

cat >> ROLLBACK_REPORT.md << EOF

## Post-Rollback Checklist
- [ ] Deployment successful
- [ ] No console errors
- [ ] Performance metrics normal
- [ ] User reports addressed
- [ ] Team notified

## Lessons Learned
(To be filled after investigation)

---
Generated by rollback-dark-mode.sh
EOF

print_status "success" "Rollback report generated: ROLLBACK_REPORT.md"

echo ""
echo "🎉 Rollback process completed!"
echo ""
echo "Don't forget to:"
echo "  - Notify the team about the rollback"
echo "  - Monitor error rates and performance"
echo "  - Investigate the root cause"
echo "  - Update the rollback report with findings"