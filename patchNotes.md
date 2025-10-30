# Patch Notes

## Version 1.0.10 - User Counter Removal (Major CPU Reduction)

### Performance Emergency Fix
**Problem**: Despite previous optimizations, CPU usage remained too high due to user counter system:
- `/api/user-count`: 433 calls consuming 11s CPU in 12 hours
- `/api/cleanup-session`: 171 calls consuming 3.85s CPU
- `/api/cleanup-sessions`: 1 call consuming 50ms CPU
- Session tracking overhead affecting overall performance

### Solution: Complete User Counter System Removal
**Decision**: Remove entire user analytics feature to eliminate CPU-intensive operations:
- **User Counter UI**: Removed visual user count display from bottom-right corner
- **Session Tracking**: Eliminated user session database operations
- **Cleanup APIs**: Removed all session cleanup endpoints
- **Polling Logic**: Eliminated user count polling and heartbeat systems

### Expected Performance Impact
- **API Call Elimination**: ~604 fewer API calls per 12 hours (433 + 171)
- **CPU Reduction**: ~14.85s less CPU usage per 12 hours (11s + 3.85s)
- **Database Load**: Significant reduction in user_sessions table operations
- **Memory Usage**: Lower memory footprint without session tracking

### Files Removed
- `src/components/ui/UserCounter.tsx`: User counter display component
- `src/hooks/useUserCounter.ts`: User counter polling logic
- `src/app/api/user-count/route.ts`: User count API endpoint
- `src/app/api/cleanup-session/route.ts`: Individual session cleanup
- `src/app/api/cleanup-sessions/route.ts`: Bulk session cleanup

### Additional Security Enhancement: 30-Second Rate Limiting
**Added Enhanced Rate Limiting** for high-traffic routes:
- **State Pages (`/[...state]`)**: 1 request per 30 seconds per IP
- **Log API (`/api/log`)**: 1 request per 30 seconds per IP
- **Dual Protection**: Log API has both 30s specific limit + general API rate limit
- **Frontend & Backend**: Rate limiting applied at middleware level for comprehensive protection

### Files Modified
- `src/app/layout.tsx`: Removed UserCounter component import and usage
- `src/components/navigation/Controls.tsx`: Removed UserCounter import
- `src/lib/services/sessionService.ts`: Removed cleanup API calls
- `src/hooks/useUserSession.ts`: Removed cleanup beacon calls
- `src/lib/database/queries.ts`: Disabled user count API calls
- `src/lib/middleware/ratelimit.ts`: Added 30-second rate limiters for state pages and log API
- `src/middleware.ts`: Added state page rate limiting to middleware
- `src/app/api/log/route.ts`: Added 30-second rate limit before general rate limit
- `package.json`: Version bump to 1.0.10

### Trade-offs
- **Lost Feature**: No longer displays active user count to visitors
- **Gained Performance**: Significant CPU and database load reduction
- **Monitoring**: Can still track usage through Vercel analytics if needed

---

## Version 1.0.9 - Critical CPU Optimization (83.8% Middleware Reduction)

### Emergency Performance Fix
**Problem**: Vercel CPU usage showed middleware consuming 4m 4s (83.8%) in 12 hours, with API routes consuming only 47s (16.2%). Investigation revealed middleware was processing ALL requests including high-frequency API calls.

### Root Cause Analysis
- **Middleware overload**: Security middleware ran on every request (1,500+ per 12h)
- **Excessive heartbeats**: Session heartbeats every 30 seconds per active user
- **Version check frequency**: 15-minute polling still too aggressive
- **No idle optimization**: Sessions maintained full frequency regardless of user activity

### Critical Optimizations Implemented

#### 1. Middleware CPU Reduction (Targets 83.8% of CPU)
- **API route bypass**: Lightweight processing for `/api/*` routes
- **Selective security**: Full security headers only for page routes
- **Expected impact**: 70-80% reduction in middleware CPU usage

#### 2. Intelligent Session Heartbeats (Targets 488 user-count calls)
- **Adaptive frequency**: Start at 1 minute, increase to 10 minutes when idle
- **Idle detection**: Automatic delay increase (1min increments) based on user activity
- **Activity tracking**: Reset to 1-minute intervals on user interaction
- **Expected impact**: 60-90% reduction in session API calls

#### 3. Extended Version Check (Targets 629 version calls)
- **Polling interval**: Extended from 15 minutes to 1 hour
- **Cache optimization**: Maintains existing HTTP caching benefits
- **Expected impact**: 75% reduction in version API calls

### Technical Implementation

#### Middleware Optimization (`src/middleware.ts`)
```typescript
// Before: Full security processing for ALL requests
// After: Lightweight API processing, full security only for pages
const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
if (isApiRoute) {
  // Minimal headers only
  return response;
}
// Full security for pages
```

#### Adaptive Heartbeat System (`src/lib/services/sessionService.ts`)
```typescript
// Progressive delay: 1min → 2min → 3min → ... → 10min (max)
// Reset to 1min on user activity
private currentHeartbeatDelay: number = 60000; // Start at 1 minute
private lastActivityTime: number = Date.now();
```

### Expected Performance Impact
- **Total CPU reduction**: 70-85% (from 4m 51s to ~45s-1m 25s per 12h)
- **Middleware CPU**: 70-80% reduction (4m 4s → ~48s-1m 13s)
- **API call reduction**: 
  - Session heartbeats: 60-90% reduction
  - Version checks: 75% reduction
  - Overall API load: 50-70% reduction

#### 4. CSP Policy Update for Google Ads
- **Added Google Ads domains**: `pagead2.googlesyndication.com`, `googleads.g.doubleclick.net`, `tpc.googlesyndication.com`
- **Extended connect-src**: Added `*.google.com`, `*.googlesyndication.com`, `*.doubleclick.net`
- **Fixed**: CSP script blocking errors for Google AdSense

### Files Modified
- `src/middleware.ts`: API route bypass optimization
- `src/lib/services/sessionService.ts`: Adaptive heartbeat system
- `src/hooks/useVersionCheck.ts`: Extended to 1-hour polling
- `next.config.js`: Enhanced CSP for Google Ads compatibility
- `package.json`: Version bump to 1.0.9
- `patchNotes.md`: Critical optimization documentation

### Monitoring Points
- Middleware CPU usage (should drop from 83.8% to ~20-30%)
- `/api/user-count` call frequency (should reduce significantly)
- `/api/version` call frequency (should drop by 75%)
- Overall Vercel CPU metrics

---

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