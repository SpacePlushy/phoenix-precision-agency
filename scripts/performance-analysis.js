#!/usr/bin/env node

/**
 * Comprehensive Performance Analysis for Phoenix Precision Agency
 * Analyzes bundle sizes, code splitting, database patterns, and optimization opportunities
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PerformanceAnalyzer {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      bundleAnalysis: {},
      codeMetrics: {},
      databasePatterns: {},
      animationPerformance: {},
      cacheStrategy: {},
      recommendations: []
    };
  }

  // 1. Bundle Size Analysis
  analyzeBundleSizes() {
    console.log('📦 Analyzing bundle sizes...');
    
    try {
      const buildOutput = execSync('pnpm build 2>&1', { encoding: 'utf-8' });
      
      // Parse route sizes from build output
      const routePattern = /([├└─])\s+([○ƒ])\s+(\/[\w\-\/]*)\s+([\d.]+\s*[kB]+)\s+([\d.]+\s*[kB]+)/g;
      const routes = [];
      let match;
      
      while ((match = routePattern.exec(buildOutput)) !== null) {
        routes.push({
          type: match[2] === '○' ? 'static' : 'dynamic',
          path: match[3],
          size: match[4],
          firstLoadJS: match[5]
        });
      }
      
      // Extract shared JS size
      const sharedMatch = buildOutput.match(/First Load JS shared by all\s+([\d.]+\s*[kB]+)/);
      const sharedSize = sharedMatch ? sharedMatch[1] : 'unknown';
      
      this.results.bundleAnalysis = {
        routes,
        sharedJSSize: sharedSize,
        totalRoutes: routes.length,
        staticRoutes: routes.filter(r => r.type === 'static').length,
        dynamicRoutes: routes.filter(r => r.type === 'dynamic').length,
        largestRoute: routes.reduce((max, r) => {
          const size = parseFloat(r.firstLoadJS);
          return size > parseFloat(max.firstLoadJS) ? r : max;
        }, routes[0])
      };
      
      // Check for code splitting effectiveness
      const avgFirstLoad = routes.reduce((sum, r) => sum + parseFloat(r.firstLoadJS), 0) / routes.length;
      
      if (avgFirstLoad > 150) {
        this.results.recommendations.push({
          priority: 'HIGH',
          category: 'Bundle Size',
          issue: `Average first load JS is ${avgFirstLoad.toFixed(1)}kB (should be < 150kB)`,
          solution: 'Implement dynamic imports for heavy components and lazy load non-critical features'
        });
      }
      
    } catch (error) {
      console.error('Build analysis failed:', error.message);
    }
  }

  // 2. Code Metrics Analysis
  analyzeCodeMetrics() {
    console.log('📊 Analyzing code metrics...');
    
    const componentsDir = path.join(process.cwd(), 'components');
    const libDir = path.join(process.cwd(), 'lib');
    const appDir = path.join(process.cwd(), 'app');
    
    const metrics = {
      components: this.analyzeDirectory(componentsDir),
      lib: this.analyzeDirectory(libDir),
      app: this.analyzeDirectory(appDir),
      totalFiles: 0,
      totalLines: 0,
      avgFileSize: 0
    };
    
    metrics.totalFiles = metrics.components.files + metrics.lib.files + metrics.app.files;
    metrics.totalLines = metrics.components.lines + metrics.lib.lines + metrics.app.lines;
    metrics.avgFileSize = metrics.totalLines / metrics.totalFiles;
    
    this.results.codeMetrics = metrics;
    
    // Check for large files
    const largeFiles = this.findLargeFiles(process.cwd(), 500);
    if (largeFiles.length > 0) {
      this.results.recommendations.push({
        priority: 'MEDIUM',
        category: 'Code Organization',
        issue: `Found ${largeFiles.length} files with > 500 lines`,
        solution: 'Consider splitting large components into smaller, reusable pieces',
        files: largeFiles.map(f => f.path)
      });
    }
  }

  analyzeDirectory(dir) {
    if (!fs.existsSync(dir)) return { files: 0, lines: 0 };
    
    let files = 0;
    let lines = 0;
    
    const walk = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          walk(fullPath);
        } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(item) && !item.includes('.test.')) {
          files++;
          const content = fs.readFileSync(fullPath, 'utf-8');
          lines += content.split('\n').length;
        }
      });
    };
    
    walk(dir);
    return { files, lines };
  }

  findLargeFiles(dir, threshold) {
    const largeFiles = [];
    
    const walk = (currentDir) => {
      if (!fs.existsSync(currentDir)) return;
      
      const items = fs.readdirSync(currentDir);
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && 
            item !== 'node_modules' && item !== '.next') {
          walk(fullPath);
        } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(item) && 
                   !item.includes('.test.')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const lineCount = content.split('\n').length;
          
          if (lineCount > threshold) {
            largeFiles.push({
              path: fullPath.replace(process.cwd(), ''),
              lines: lineCount
            });
          }
        }
      });
    };
    
    walk(dir);
    return largeFiles.sort((a, b) => b.lines - a.lines);
  }

  // 3. Database Pattern Analysis
  analyzeDatabasePatterns() {
    console.log('🗄️ Analyzing database patterns...');
    
    const upstashFile = path.join(process.cwd(), 'lib/upstash.ts');
    
    if (fs.existsSync(upstashFile)) {
      const content = fs.readFileSync(upstashFile, 'utf-8');
      
      // Check for N+1 query patterns
      const pipelineUsage = (content.match(/pipeline\(\)/g) || []).length;
      const individualFetches = (content.match(/await redis\.(get|set|zadd|zrange)/g) || []).length;
      
      // Check for proper caching
      const ttlUsage = (content.match(/setex|expire/g) || []).length;
      const infiniteTTL = (content.match(/set\([^)]*\)(?!.*expire)/g) || []).length;
      
      this.results.databasePatterns = {
        pipelineUsage,
        individualFetches,
        batchingRatio: pipelineUsage / (individualFetches || 1),
        ttlUsage,
        infiniteTTL,
        cacheStrategy: ttlUsage > 0 ? 'TTL-based' : 'No expiration'
      };
      
      // Recommendations
      if (individualFetches > pipelineUsage * 2) {
        this.results.recommendations.push({
          priority: 'HIGH',
          category: 'Database',
          issue: 'Potential N+1 query pattern detected',
          solution: 'Use Redis pipeline for batch operations to reduce round trips',
          details: `Found ${individualFetches} individual operations vs ${pipelineUsage} pipeline uses`
        });
      }
      
      if (infiniteTTL > 3) {
        this.results.recommendations.push({
          priority: 'MEDIUM',
          category: 'Caching',
          issue: 'Keys without TTL found',
          solution: 'Set appropriate TTL for all cached data to prevent memory bloat'
        });
      }
    }
  }

  // 4. Animation Performance Analysis
  analyzeAnimationPerformance() {
    console.log('🎨 Analyzing animation performance...');
    
    const demoContainer = path.join(process.cwd(), 'components/demo/DemoContainer.tsx');
    
    if (fs.existsSync(demoContainer)) {
      const content = fs.readFileSync(demoContainer, 'utf-8');
      
      // Check for performance optimizations
      const willChangeUsage = (content.match(/willChange/g) || []).length;
      const translateZUsage = (content.match(/translateZ|translate3d/g) || []).length;
      const animatePresence = (content.match(/AnimatePresence/g) || []).length;
      const useTransform = (content.match(/useTransform/g) || []).length;
      const requestAnimFrame = (content.match(/requestAnimationFrame/g) || []).length;
      
      // Check for expensive properties
      const boxShadowAnimations = (content.match(/animate.*box-shadow/gi) || []).length;
      const filterAnimations = (content.match(/animate.*filter/gi) || []).length;
      
      this.results.animationPerformance = {
        optimizations: {
          willChange: willChangeUsage > 0,
          gpuAcceleration: translateZUsage > 0,
          animatePresence: animatePresence > 0,
          transforms: useTransform > 0,
          rafUsage: requestAnimFrame > 0
        },
        expensiveAnimations: {
          boxShadow: boxShadowAnimations,
          filters: filterAnimations
        }
      };
      
      // Recommendations
      if (!translateZUsage && !willChangeUsage) {
        this.results.recommendations.push({
          priority: 'HIGH',
          category: 'Animation',
          issue: 'Animations not GPU-accelerated',
          solution: 'Add translateZ(0) or will-change: transform to animated elements'
        });
      }
      
      if (boxShadowAnimations > 0 || filterAnimations > 0) {
        this.results.recommendations.push({
          priority: 'MEDIUM',
          category: 'Animation',
          issue: 'Expensive animation properties detected',
          solution: 'Avoid animating box-shadow and filter. Use opacity and transform instead'
        });
      }
    }
  }

  // 5. Cache Strategy Analysis
  analyzeCacheStrategy() {
    console.log('💾 Analyzing cache strategies...');
    
    const strategies = {
      browser: this.analyzeBrowserCache(),
      cdn: this.analyzeCDNCache(),
      redis: this.analyzeRedisCache(),
      api: this.analyzeAPICache()
    };
    
    this.results.cacheStrategy = strategies;
    
    // Check for cache headers in API routes
    const apiDir = path.join(process.cwd(), 'app/api');
    if (fs.existsSync(apiDir)) {
      const hasNoCache = this.checkForPattern(apiDir, /Cache-Control.*no-cache/);
      const hasMaxAge = this.checkForPattern(apiDir, /Cache-Control.*max-age/);
      
      if (!hasMaxAge && !hasNoCache) {
        this.results.recommendations.push({
          priority: 'MEDIUM',
          category: 'Caching',
          issue: 'No cache headers found in API routes',
          solution: 'Add appropriate Cache-Control headers to API responses'
        });
      }
    }
  }

  analyzeBrowserCache() {
    const nextConfig = path.join(process.cwd(), 'next.config.ts');
    if (!fs.existsSync(nextConfig)) return { configured: false };
    
    const content = fs.readFileSync(nextConfig, 'utf-8');
    return {
      configured: content.includes('headers'),
      imageOptimization: content.includes('images:'),
      staticAssets: content.includes('Cache-Control')
    };
  }

  analyzeCDNCache() {
    // Check for CDN configuration (Vercel)
    const vercelJson = path.join(process.cwd(), 'vercel.json');
    if (!fs.existsSync(vercelJson)) {
      return { configured: false, provider: 'Vercel (auto)' };
    }
    
    const content = fs.readFileSync(vercelJson, 'utf-8');
    return {
      configured: true,
      hasHeaders: content.includes('headers'),
      hasRewrites: content.includes('rewrites')
    };
  }

  analyzeRedisCache() {
    const upstashFile = path.join(process.cwd(), 'lib/upstash.ts');
    if (!fs.existsSync(upstashFile)) return { configured: false };
    
    const content = fs.readFileSync(upstashFile, 'utf-8');
    
    // Analyze TTL patterns
    const ttlPatterns = {
      leads: content.match(/lead.*expire.*(\d+)/),
      analytics: content.match(/analytics.*expire.*(\d+)/),
      default: content.match(/setex.*(\d+)/)
    };
    
    return {
      configured: true,
      ttlPatterns: {
        leads: ttlPatterns.leads ? parseInt(ttlPatterns.leads[1]) : null,
        analytics: ttlPatterns.analytics ? parseInt(ttlPatterns.analytics[1]) : null,
        default: ttlPatterns.default ? parseInt(ttlPatterns.default[1]) : null
      }
    };
  }

  analyzeAPICache() {
    const apiRoutes = [];
    const apiDir = path.join(process.cwd(), 'app/api');
    
    if (fs.existsSync(apiDir)) {
      const walk = (dir) => {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            walk(fullPath);
          } else if (item === 'route.ts' || item === 'route.js') {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const hasCache = content.includes('Cache-Control');
            const hasRevalidate = content.includes('revalidate');
            
            apiRoutes.push({
              path: fullPath.replace(process.cwd(), ''),
              cached: hasCache || hasRevalidate
            });
          }
        });
      };
      
      walk(apiDir);
    }
    
    return {
      routes: apiRoutes,
      cachedRoutes: apiRoutes.filter(r => r.cached).length,
      totalRoutes: apiRoutes.length
    };
  }

  checkForPattern(dir, pattern) {
    let found = false;
    
    const walk = (currentDir) => {
      if (!fs.existsSync(currentDir)) return;
      
      const items = fs.readdirSync(currentDir);
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(item)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          if (pattern.test(content)) {
            found = true;
          }
        }
      });
    };
    
    walk(dir);
    return found;
  }

  // 6. Resource Loading Analysis
  analyzeResourceLoading() {
    console.log('📥 Analyzing resource loading...');
    
    const results = {
      lazyLoading: this.checkLazyLoading(),
      prefetching: this.checkPrefetching(),
      criticalCSS: this.checkCriticalCSS(),
      fontLoading: this.checkFontLoading()
    };
    
    this.results.resourceLoading = results;
    
    // Recommendations
    if (!results.lazyLoading.components) {
      this.results.recommendations.push({
        priority: 'HIGH',
        category: 'Loading',
        issue: 'No lazy loading detected for components',
        solution: 'Use dynamic imports with next/dynamic for heavy components'
      });
    }
    
    if (!results.fontLoading.optimized) {
      this.results.recommendations.push({
        priority: 'MEDIUM',
        category: 'Loading',
        issue: 'Font loading not optimized',
        solution: 'Use next/font for automatic font optimization'
      });
    }
  }

  checkLazyLoading() {
    const hasLazyComponent = this.checkForPattern(
      path.join(process.cwd(), 'components'),
      /dynamic\(|lazy\(/
    );
    
    const hasLazyImages = this.checkForPattern(
      process.cwd(),
      /loading=["']lazy["']|Image.*priority={false}/
    );
    
    return {
      components: hasLazyComponent,
      images: hasLazyImages
    };
  }

  checkPrefetching() {
    return {
      links: this.checkForPattern(process.cwd(), /prefetch={true}|prefetch/),
      dns: this.checkForPattern(process.cwd(), /dns-prefetch|preconnect/)
    };
  }

  checkCriticalCSS() {
    const tailwindConfig = path.join(process.cwd(), 'tailwind.config.ts');
    if (!fs.existsSync(tailwindConfig)) return { configured: false };
    
    const content = fs.readFileSync(tailwindConfig, 'utf-8');
    return {
      configured: true,
      purgeEnabled: content.includes('content:')
    };
  }

  checkFontLoading() {
    const layoutFile = path.join(process.cwd(), 'app/layout.tsx');
    if (!fs.existsSync(layoutFile)) return { optimized: false };
    
    const content = fs.readFileSync(layoutFile, 'utf-8');
    return {
      optimized: content.includes('next/font'),
      hasDisplay: content.includes('display:')
    };
  }

  // Generate final report
  generateReport() {
    console.log('\n📈 Generating performance report...\n');
    
    // Sort recommendations by priority
    this.results.recommendations.sort((a, b) => {
      const priority = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priority[b.priority] - priority[a.priority];
    });
    
    // Calculate overall score
    const score = this.calculatePerformanceScore();
    this.results.performanceScore = score;
    
    return this.results;
  }

  calculatePerformanceScore() {
    let score = 100;
    
    // Deduct points for issues
    this.results.recommendations.forEach(rec => {
      switch(rec.priority) {
        case 'HIGH': score -= 10; break;
        case 'MEDIUM': score -= 5; break;
        case 'LOW': score -= 2; break;
      }
    });
    
    // Bonus points for optimizations
    if (this.results.animationPerformance?.optimizations?.gpuAcceleration) score += 5;
    if (this.results.cacheStrategy?.redis?.configured) score += 5;
    if (this.results.resourceLoading?.lazyLoading?.components) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  printReport() {
    const report = this.generateReport();
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  PERFORMANCE ANALYSIS REPORT - Phoenix Precision Agency');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  Generated: ${report.timestamp}`);
    console.log(`  Performance Score: ${report.performanceScore}/100`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // Bundle Analysis
    console.log('📦 BUNDLE ANALYSIS');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`  Shared JS Size: ${report.bundleAnalysis.sharedJSSize || 'N/A'}`);
    console.log(`  Total Routes: ${report.bundleAnalysis.totalRoutes || 0}`);
    console.log(`  Static Routes: ${report.bundleAnalysis.staticRoutes || 0}`);
    console.log(`  Dynamic Routes: ${report.bundleAnalysis.dynamicRoutes || 0}`);
    if (report.bundleAnalysis.largestRoute) {
      console.log(`  Largest Route: ${report.bundleAnalysis.largestRoute.path} (${report.bundleAnalysis.largestRoute.firstLoadJS})`);
    }
    console.log();
    
    // Code Metrics
    console.log('📊 CODE METRICS');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`  Total Files: ${report.codeMetrics.totalFiles}`);
    console.log(`  Total Lines: ${report.codeMetrics.totalLines}`);
    console.log(`  Avg File Size: ${report.codeMetrics.avgFileSize.toFixed(0)} lines`);
    console.log();
    
    // Database Patterns
    console.log('🗄️  DATABASE PATTERNS');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`  Pipeline Usage: ${report.databasePatterns.pipelineUsage || 0}`);
    console.log(`  Individual Fetches: ${report.databasePatterns.individualFetches || 0}`);
    console.log(`  Batching Ratio: ${(report.databasePatterns.batchingRatio || 0).toFixed(2)}`);
    console.log(`  Cache Strategy: ${report.databasePatterns.cacheStrategy || 'None'}`);
    console.log();
    
    // Animation Performance
    console.log('🎨 ANIMATION PERFORMANCE');
    console.log('─────────────────────────────────────────────────────────────');
    if (report.animationPerformance.optimizations) {
      const opts = report.animationPerformance.optimizations;
      console.log(`  GPU Acceleration: ${opts.gpuAcceleration ? '✅' : '❌'}`);
      console.log(`  Will-Change: ${opts.willChange ? '✅' : '❌'}`);
      console.log(`  RAF Usage: ${opts.rafUsage ? '✅' : '❌'}`);
      console.log(`  Expensive Animations: ${
        report.animationPerformance.expensiveAnimations.boxShadow + 
        report.animationPerformance.expensiveAnimations.filters
      }`);
    }
    console.log();
    
    // Cache Strategy
    console.log('💾 CACHE STRATEGY');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`  Browser Cache: ${report.cacheStrategy.browser?.configured ? '✅' : '❌'}`);
    console.log(`  CDN Cache: ${report.cacheStrategy.cdn?.configured ? '✅' : '❌'}`);
    console.log(`  Redis Cache: ${report.cacheStrategy.redis?.configured ? '✅' : '❌'}`);
    console.log(`  API Caching: ${report.cacheStrategy.api?.cachedRoutes || 0}/${report.cacheStrategy.api?.totalRoutes || 0} routes`);
    console.log();
    
    // Recommendations
    if (report.recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS');
      console.log('═══════════════════════════════════════════════════════════════');
      
      report.recommendations.forEach((rec, index) => {
        const icon = rec.priority === 'HIGH' ? '🔴' : rec.priority === 'MEDIUM' ? '🟡' : '🟢';
        console.log(`\n${icon} [${rec.priority}] ${rec.category}`);
        console.log(`   Issue: ${rec.issue}`);
        console.log(`   Solution: ${rec.solution}`);
        if (rec.details) {
          console.log(`   Details: ${rec.details}`);
        }
        if (rec.files) {
          console.log(`   Files: ${rec.files.join(', ')}`);
        }
      });
    } else {
      console.log('✅ No major performance issues detected!');
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════\n');
    
    // Save report to file
    const reportPath = path.join(process.cwd(), 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Full report saved to: ${reportPath}\n`);
  }

  run() {
    console.log('\n🚀 Starting Performance Analysis...\n');
    
    this.analyzeBundleSizes();
    this.analyzeCodeMetrics();
    this.analyzeDatabasePatterns();
    this.analyzeAnimationPerformance();
    this.analyzeCacheStrategy();
    this.analyzeResourceLoading();
    
    this.printReport();
  }
}

// Run the analyzer
const analyzer = new PerformanceAnalyzer();
analyzer.run();