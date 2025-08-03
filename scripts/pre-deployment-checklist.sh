#!/bin/bash

# Pre-Deployment Checklist for Dark Mode Feature
# Run this script before creating PR or deploying to production

set -e

echo "🚀 Dark Mode Pre-Deployment Checklist"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Checklist items tracking
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

# Function to print colored output
print_result() {
    local status=$1
    local message=$2
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    case $status in
        "pass")
            echo -e "${GREEN}✅ $message${NC}"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
            ;;
        "fail")
            echo -e "${RED}❌ $message${NC}"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $message${NC}"
            WARNINGS=$((WARNINGS + 1))
            ;;
        "info")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
        *)
            echo "$message"
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
    print_result "fail" "This script must be run from the project root directory"
    exit 1
fi

echo "1️⃣  Code Quality Checks"
echo "------------------------"

# Check if all tests pass
echo -n "Running tests... "
if pnpm test --silent > /dev/null 2>&1; then
    print_result "pass" "All tests passing"
else
    print_result "fail" "Tests are failing"
fi

# Check TypeScript compilation
echo -n "Checking TypeScript... "
if pnpm tsc --noEmit > /dev/null 2>&1; then
    print_result "pass" "TypeScript compilation successful"
else
    print_result "fail" "TypeScript errors found"
fi

# Check ESLint
echo -n "Running ESLint... "
if pnpm lint > /dev/null 2>&1; then
    print_result "pass" "No linting errors"
else
    print_result "warning" "Linting warnings found"
fi

# Check for console.log statements
echo -n "Checking for console.log... "
CONSOLE_LOGS=$(grep -r "console\.log" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=coverage . | grep -v "// eslint-disable" | wc -l)
if [ "$CONSOLE_LOGS" -eq 0 ]; then
    print_result "pass" "No console.log statements found"
else
    print_result "warning" "Found $CONSOLE_LOGS console.log statements"
fi

echo ""
echo "2️⃣  Dark Mode Specific Checks"
echo "-----------------------------"

# Check theme provider integration
echo -n "Checking theme provider... "
if grep -q "ThemeProvider" app/layout.tsx; then
    print_result "pass" "Theme provider integrated in layout"
else
    print_result "fail" "Theme provider not found in layout"
fi

# Check for FOUC prevention
echo -n "Checking FOUC prevention... "
if grep -q "suppressHydrationWarning" app/layout.tsx; then
    print_result "pass" "FOUC prevention implemented"
else
    print_result "fail" "FOUC prevention not found"
fi

# Check CSS variables
echo -n "Checking CSS variables... "
if grep -q ":root" app/globals.css && grep -q "\.dark" app/globals.css; then
    print_result "pass" "CSS variables defined for both themes"
else
    print_result "fail" "CSS variables missing"
fi

# Check theme toggle component
echo -n "Checking theme toggle... "
if [ -f "components/theme-toggle.tsx" ]; then
    print_result "pass" "Theme toggle component exists"
else
    print_result "fail" "Theme toggle component not found"
fi

echo ""
echo "3️⃣  Performance Checks"
echo "---------------------"

# Check bundle size
echo -n "Building production bundle... "
if pnpm build > /dev/null 2>&1; then
    print_result "pass" "Build successful"
    
    # Check .next directory size
    if [ -d ".next" ]; then
        BUNDLE_SIZE=$(du -sh .next | cut -f1)
        print_result "info" "Bundle size: $BUNDLE_SIZE"
    fi
else
    print_result "fail" "Build failed"
fi

# Check for lazy loading
echo -n "Checking lazy loading... "
if grep -q "dynamic" app/theme-demo/page.tsx 2>/dev/null || [ ! -f "app/theme-demo/page.tsx" ]; then
    print_result "pass" "Theme demo page uses lazy loading or doesn't exist"
else
    print_result "warning" "Consider lazy loading for theme demo"
fi

echo ""
echo "4️⃣  Security & Dependencies"
echo "---------------------------"

# Check for security vulnerabilities
echo -n "Running security audit... "
AUDIT_RESULT=$(pnpm audit --audit-level=high 2>&1 || true)
HIGH_VULNS=$(echo "$AUDIT_RESULT" | grep -oE "[0-9]+ high" | grep -oE "[0-9]+" || echo "0")
if [ "$HIGH_VULNS" = "0" ]; then
    print_result "pass" "No high severity vulnerabilities"
else
    print_result "fail" "Found $HIGH_VULNS high severity vulnerabilities"
fi

# Check next-themes version
echo -n "Checking next-themes version... "
if grep -q '"next-themes":' package.json; then
    NEXT_THEMES_VERSION=$(grep '"next-themes":' package.json | grep -oE "[0-9]+\.[0-9]+\.[0-9]+")
    print_result "pass" "next-themes installed (v$NEXT_THEMES_VERSION)"
else
    print_result "fail" "next-themes not found in dependencies"
fi

echo ""
echo "5️⃣  Documentation Checks"
echo "-----------------------"

# Check for implementation docs
echo -n "Checking documentation... "
if [ -f "DARK_MODE_IMPLEMENTATION.md" ]; then
    print_result "pass" "Implementation documentation exists"
else
    print_result "warning" "Implementation documentation not found"
fi

# Check for deployment docs
if [ -f "DEPLOYMENT_DARK_MODE.md" ]; then
    print_result "pass" "Deployment documentation exists"
else
    print_result "warning" "Deployment documentation not found"
fi

echo ""
echo "6️⃣  Git & Version Control"
echo "-------------------------"

# Check git status
echo -n "Checking git status... "
if [ -z "$(git status --porcelain)" ]; then
    print_result "pass" "Working directory clean"
else
    print_result "warning" "Uncommitted changes found"
fi

# Check branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "feature/dark-mode" ]; then
    print_result "pass" "On correct feature branch"
else
    print_result "warning" "Not on feature/dark-mode branch (current: $CURRENT_BRANCH)"
fi

echo ""
echo "7️⃣  Environment & Configuration"
echo "-------------------------------"

# Check for env example
echo -n "Checking environment setup... "
if grep -q "NEXT_PUBLIC_FEATURE_DARK_MODE" .env.example 2>/dev/null; then
    print_result "pass" "Feature flag documented in .env.example"
else
    print_result "info" "Feature flag not in .env.example (optional)"
fi

# Check GitHub Actions
echo -n "Checking CI/CD pipeline... "
if [ -f ".github/workflows/dark-mode-deployment.yml" ]; then
    print_result "pass" "Dark mode CI/CD workflow exists"
else
    print_result "warning" "Dark mode specific CI/CD not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Deployment Readiness Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
echo -e "${RED}Failed: $FAILED_CHECKS${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

# Calculate readiness score
SCORE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}✅ READY FOR DEPLOYMENT (Score: ${SCORE}%)${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Create pull request: gh pr create"
    echo "  2. Wait for CI/CD checks"
    echo "  3. Get code review"
    echo "  4. Merge when approved"
    EXIT_CODE=0
elif [ $FAILED_CHECKS -le 2 ]; then
    echo -e "${YELLOW}⚠️  ALMOST READY (Score: ${SCORE}%)${NC}"
    echo ""
    echo "Please fix the failed checks before deployment."
    EXIT_CODE=1
else
    echo -e "${RED}❌ NOT READY FOR DEPLOYMENT (Score: ${SCORE}%)${NC}"
    echo ""
    echo "Multiple critical issues found. Please address all failed checks."
    EXIT_CODE=1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Generate detailed report
cat > DEPLOYMENT_READINESS.md << EOF
# Dark Mode Deployment Readiness Report

Generated: $(date)
Branch: $CURRENT_BRANCH
Score: ${SCORE}%

## Summary
- Total Checks: $TOTAL_CHECKS
- Passed: $PASSED_CHECKS
- Failed: $FAILED_CHECKS  
- Warnings: $WARNINGS

## Failed Checks
$(git status --porcelain | head -10)

## Recommendations
1. Fix all failed checks before creating PR
2. Address warnings if possible
3. Run tests in multiple browsers
4. Test with slow network conditions
5. Verify theme persistence works

---
Generated by pre-deployment-checklist.sh
EOF

echo ""
echo "📄 Detailed report saved to: DEPLOYMENT_READINESS.md"

exit $EXIT_CODE