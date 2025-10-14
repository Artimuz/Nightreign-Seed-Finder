# Deployment Security Checklist
## Nightreign Seed Finder - Production Deployment

### 🔧 **Pre-Deployment Setup**

#### Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Set to production Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Set to production Supabase anon key
- [ ] `UPSTASH_REDIS_REST_URL` - Set to production Redis URL (for rate limiting)
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Set to production Redis token
- [ ] `NODE_ENV=production`
- [ ] `SECURITY_ENABLE_RATE_LIMITING=true`

#### Dependencies Installation
```bash
npm install
```

#### Build and Test
```bash
# Run security linting
npm run lint:security

# Analyze bundle size
npm run analyze

# Build for production
npm run build

# Test production build
npm start
```

### 🔒 **Security Verification**

#### 1. Security Headers Test
- [ ] Test at https://securityheaders.com
- [ ] Verify CSP policy in browser dev tools
- [ ] Check X-Frame-Options: DENY
- [ ] Verify HSTS header present

#### 2. Rate Limiting Test
```bash
# Test API rate limiting
for i in {1..110}; do curl -X POST https://yourapp.com/api/log; done
```
- [ ] Should return 429 after 100 requests

#### 3. Input Validation Test
- [ ] Test API endpoints with malicious payloads
- [ ] Verify XSS protection in forms
- [ ] Test SQL injection attempts (should fail)

#### 4. HTTPS and Certificate
- [ ] SSL/TLS certificate properly configured
- [ ] HTTPS redirect working
- [ ] No mixed content warnings

### ⚡ **Performance Verification**

#### Core Web Vitals
- [ ] LCP < 2.5s (test with Lighthouse)
- [ ] FID < 100ms
- [ ] CLS < 0.1

#### Bundle Analysis
- [ ] Total bundle size reasonable (< 1MB)
- [ ] No unused dependencies
- [ ] Proper code splitting

#### Image Optimization
- [ ] Images loading with proper lazy loading
- [ ] WebP format being served
- [ ] Responsive images working on mobile

### 🗃️ **Database & Redis Setup**

#### Supabase Configuration
- [ ] Row Level Security (RLS) enabled
- [ ] Proper database indices created:
  ```sql
  CREATE INDEX idx_user_sessions_heartbeat ON user_sessions(last_heartbeat);
  CREATE INDEX idx_user_sessions_nightlord ON user_sessions(nightlord);
  CREATE INDEX idx_seedfinder_logs_created ON seedfinder_logs(created_at);
  ```

#### Redis Setup (Upstash)
- [ ] Redis instance created and configured
- [ ] Rate limiting working in production
- [ ] Connection pooling configured

### 🔍 **Monitoring Setup**

#### Error Tracking
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure error alerting
- [ ] Test error reporting

#### Performance Monitoring
- [ ] Web Vitals monitoring active
- [ ] API performance tracking working
- [ ] Database query performance monitored

#### Uptime Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure alerts for downtime
- [ ] Test alert notifications

### 🚀 **Deployment Steps**

#### 1. Build Verification
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Security audit
npm audit --audit-level high

# Build and test
npm run build
npm run lint:security
```

#### 2. Environment Setup
- [ ] Production environment variables configured
- [ ] Database migrations applied
- [ ] Redis connection tested

#### 3. Deploy Application
- [ ] Deploy to production platform
- [ ] Verify deployment successful
- [ ] Test critical user flows

#### 4. Post-Deployment Verification
- [ ] All security headers present
- [ ] Rate limiting functional
- [ ] Database queries optimized
- [ ] Image optimization working
- [ ] Error tracking active

### 📊 **Performance Benchmarks**

#### Expected Metrics
- **Page Load Time**: < 3 seconds
- **API Response Time**: < 500ms average
- **Database Query Time**: < 100ms average
- **Bundle Size**: < 1MB total
- **Image Load Time**: < 2 seconds

#### Monitoring Commands
```bash
# Check security headers
curl -I https://yourapp.com

# Test API performance
curl -w "@curl-format.txt" -s -o /dev/null https://yourapp.com/api/log

# Monitor bundle size
npm run analyze
```

### 🆘 **Troubleshooting**

#### Common Issues
1. **CSP Errors**: Check browser console for blocked resources
2. **Rate Limiting Not Working**: Verify Redis connection and environment variables
3. **Slow Performance**: Check bundle size and image optimization
4. **Database Errors**: Verify connection strings and permissions

#### Performance Issues
1. **High LCP**: Check image optimization and critical resource loading
2. **High FID**: Review JavaScript bundle size and execution
3. **High CLS**: Check for layout shifts in components

### ✅ **Sign-off Checklist**

- [ ] Security headers verified
- [ ] Rate limiting tested and working
- [ ] Input validation confirmed
- [ ] Performance metrics within acceptable ranges
- [ ] Database optimizations applied
- [ ] Monitoring and alerting configured
- [ ] Error tracking functional
- [ ] All environment variables set correctly
- [ ] SSL certificate valid
- [ ] Backup and recovery plan in place

---

**Deployment Date**: ___________
**Deployed By**: ___________
**Verified By**: ___________

*This checklist ensures all security enhancements and optimizations are properly configured in production.*