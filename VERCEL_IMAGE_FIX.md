# Vercel Production Image Loading Fix

## Problem
After moving 3 images to `generalUI` folder and modifying Vercel image optimization settings, these images fail to load in production but work fine locally:
- `BG2_.webp` (background image)
- `Title_n_.webp` (title image) 
- `Top.BG_.webm` (background video)

## Root Causes
1. **Vercel image optimization cache**: Moving images and changing optimization settings can cause cache mismatches
2. **Next.js Image component restrictions**: Reduced device sizes and quality settings may affect image serving
3. **CSP headers**: Content Security Policy might be blocking certain image optimizations
4. **Path resolution**: New folder structure might not be properly recognized by Vercel's image optimizer

## Solutions Implemented

### 1. Enhanced Background Image Settings
```tsx
// Added explicit quality and optimization settings
<Image
  src="/Images/generalUI/BG2_.webp"
  quality={85}
  unoptimized={false}
  // ... other props
/>
```

### 2. Improved Video Loading
```tsx
// Added preload attribute for better video loading
<video preload="auto">
  <source src="/Images/generalUI/Top.BG_.webm" type="video/webm" />
</video>
```

### 3. Bypassed Optimization for Title Image
```tsx
// Changed from Next.js Image to regular img tag
<img
  src="/Images/generalUI/Title_n_.webp"
  loading="eager"
  style={{ width: '280px', height: '80px' }}
/>
```

## Alternative Solutions to Try if Issues Persist

### Option A: Add Images to Next.js Config Exceptions
```javascript
// In next.config.js
images: {
  unoptimized: false,
  // Add specific paths that should bypass optimization
  loader: 'custom',
  loaderFile: './image-loader.js'
}
```

### Option B: Force Cache Invalidation
- Rename files with version suffixes (e.g., `BG2_v2.webp`)
- Clear Vercel deployment cache
- Redeploy with fresh build

### Option C: Move Back to Root Images Folder
- Revert images to `/Images/` root
- Update all references back to original paths
- This ensures compatibility with existing Vercel optimization

### Option D: Use CDN or External Hosting
- Host problematic images on external CDN
- Update references to absolute URLs
- Bypass Vercel image optimization entirely

## Files Modified
1. `src/components/backgrounds/GlobalBackground.tsx` - Enhanced image/video settings
2. `src/components/cards/MapSelectionCards.tsx` - Bypassed title image optimization
3. Image references updated to use underscore suffixes

## Testing
After deployment, verify:
1. Background images load correctly
2. Title image displays properly
3. Background video plays smoothly
4. No console errors related to image loading

## Monitoring
Check Vercel dashboard for:
- Image optimization usage (should be reduced)
- Any 404 errors on image requests
- Performance metrics for image loading