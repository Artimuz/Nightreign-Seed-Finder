# Patch Notes

## Version 1.0.7 - Major CPU Optimization for 10x Scale (Cron Job Fix)

### Performance Improvements
- **User Count API Optimization**: Extended cache from 30s to 10 minutes (20x improvement)
- **Polling Frequency Reduction**: User data polling reduced from 5min to 15min intervals (3x improvement)  
- **Opportunistic Session Cleanup**: Replaced Vercel cron jobs with smart opportunistic cleanup (10% chance per API call)
- **Client-Side Cleanup Removal**: Eliminated all frontend session cleanup triggers

### Expected Impact
- **70-80% CPU reduction**: From 8.2s/hour to ~1.6-2.4s/hour
- **10x Growth Capacity**: Can now support 5-8x current user base on free tier
- **Improved Reliability**: Opportunistic cleanup works within Vercel Hobby plan limitations

### Technical Changes
- `src/hooks/useUserCounter.ts`: Removed cleanup logic, extended polling intervals
- `src/app/api/user-count/route.ts`: Extended cache headers + opportunistic cleanup logic
- `vercel.json`: Removed cron job configuration (incompatible with Hobby plan)

### Vercel Hobby Plan Compatibility Fix
**Problem**: Vercel Hobby plan only allows cron jobs to run once daily, not every 30 minutes as originally planned.
**Solution**: Implemented opportunistic cleanup that triggers randomly (10% chance) during user-count API calls.
**Benefits**: 
- Spreads cleanup load across regular API usage
- No dependency on cron job scheduling
- Maintains session hygiene without additional infrastructure

### Files Modified
- package.json (version bump)
- src/hooks/useUserCounter.ts (optimization)
- src/app/api/user-count/route.ts (caching + opportunistic cleanup)
- vercel.json (removed cron configuration)
- patchNotes.md (documentation)

---

## Version 1.0.6
**Release Date**: [Current Release]

### Performance Optimization: Version Check System Refinement
**Problem Identified**: Version 1.0.5 implemented server-side caching (5-minute cache with CDN optimization) for the `/api/version` endpoint, expecting a 94% CPU reduction. However, client-side code was actively bypassing all caching mechanisms:
- Cache busting via timestamp query parameters (`Date.now()`)
- Explicit cache bypass with `cache: 'no-store'` 
- Aggressive 30-second polling interval from all active users

**Technical Solution Implemented**:
- **Extended polling interval**: Changed from 30 seconds to 15 minutes (900,000ms)
- **Enabled HTTP caching**: Removed cache busting timestamp and changed `cache: 'no-store'` to `cache: 'default'`
- **Cache alignment**: 15-minute client polling now properly leverages the 5-minute server cache window

**Expected Performance Impact**:
- **Request volume reduction**: ~97% decrease in version API calls (from every 30s to every 15min per user)
- **Cache utilization**: Multiple users will now share cached responses within 5-minute windows
- **CPU usage**: Significant reduction in API route invocations and processing overhead

**Files Modified**:
- `src/hooks/useVersionCheck.ts`: Updated polling interval and caching strategy
- `package.json`: Version bump to 1.0.6
- `patchNotes.md`: Created dedicated patch notes documentation

---

## Version 1.0.5
**Release Date**: [Previous Release]

### Performance Optimization: API Request Reduction Initiative

**User Counter Optimization**:
- **Session-based tracking**: Implemented user session management to reduce database load
- **Optimized polling**: Improved user count update frequency and efficiency
- **Database query optimization**: Reduced redundant user count queries

**Version Check System Enhancement**:
- **Server-side caching**: Implemented aggressive 5-minute HTTP cache headers on `/api/version` endpoint
- **CDN optimization**: Added cache-control directives for edge caching
- **Expected impact**: 94% reduction in version check CPU usage

**Session Management Improvements**:
- **Cleanup automation**: Enhanced session cleanup processes
- **Memory optimization**: Reduced memory footprint for session tracking
- **Performance monitoring**: Added session-related performance metrics

**Technical Debt & Infrastructure**:
- **Rate limiting**: Enhanced API rate limiting for better resource management
- **Error handling**: Improved error handling across API routes
- **Security enhancements**: Updated security headers and validation

**Expected Performance Metrics**:
- Version API: 94% CPU reduction (from 2m to ~6s active CPU)
- User counter: Significant reduction in database queries
- Session management: Improved cleanup efficiency
- Overall: Better resource utilization and user experience

**Files Modified**:
- `src/app/api/version/route.ts`: Added cache headers
- `src/features/session/`: Session management improvements
- `src/hooks/useUserCounter.ts`: Optimized polling logic
- `src/lib/services/sessionService.ts`: Enhanced session handling