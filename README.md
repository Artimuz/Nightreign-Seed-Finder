# Nightreign Seed Finder

A secure, modern interactive seed finder for Nightreign with advanced URL state management, server-side API architecture, and enterprise-grade security

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Security](https://img.shields.io/badge/Security-Hardened-green.svg)
![Architecture](https://img.shields.io/badge/Architecture-Enterprise-purple.svg)

## Features

### Core Functionality
- **Complete URL State Management**: Every app state is encoded in the URL for sharing and bookmarking
- **TCG-Style Card Interface**: Beautiful map selection cards with hover effects and animations
- **Progressive Layered UI**: Smooth transitions between interface states
- **Undo/Redo System**: Full history navigation with visual feedback
- **Real-time Seed Search**: Instant filtering of 320+ seeds based on your configuration

### Security & Performance
- **Type-Safe Architecture**: Comprehensive TypeScript implementation with zero `any` types
- **Input Validation**: Multi-layer validation with sanitization and schema enforcement
- **Secure Session Management**: Cryptographically secure session IDs using Web Crypto API
- **Server-Side API Routes**: CORS-free database operations through Next.js API endpoints
- **Request Security**: Size limits, rate limiting preparation, and secure error handling
- **Performance Optimized**: Debouncing, throttling, and memoization utilities

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Powered by Framer Motion for fluid interactions
- **Interactive Map**: Click on slots to place buildings with visual feedback
- **Nightlord Selection**: Choose your nightlord to complete seed configurations
- **Instant Results**: See matching seeds count in real-time

### Advanced Features
- **Shareable Configurations**: Every state has a unique URL for easy sharing
- **Playback Capability**: URLs act as "save states" for step-by-step replay
- **Browser History Integration**: Native back/forward button support
- **Copy & Share**: One-click copying of seed IDs and configuration URLs

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000` (or next available port).

## Architecture

### Security-First Design
The application implements enterprise-grade security practices:

- **Cryptographic Security**: Secure session ID generation using `crypto.getRandomValues()`
- **Input Sanitization**: All user inputs are validated and sanitized before processing
- **Type Safety**: Comprehensive TypeScript coverage with strict type checking
- **Server-Side Database Operations**: All database queries handled through secure API routes
- **CORS Protection**: Eliminates cross-origin request issues through server-side architecture
- **API Security**: Request validation, size limits, and secure error responses

### URL State Pattern
```
/ (root - map selection)
/map_normal (map selected)
/map_normal&25=ruins (slot 25 filled)
/map_normal&25=ruins&03=church (slot 03 filled)
/map_normal&25=ruins&03=church&nightlord=1_Gladius (nightlord selected)
/map_normal&25=ruins&03=church&nightlord=1_Gladius&SEED=009 (match found)
```

### Project Structure
```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   ├── globals.css         # Global styles
│   ├── [...state]/         # Dynamic URL state handling
│   └── api/                # Server-side API routes
│       ├── user-count/     # User analytics endpoint
│       ├── cleanup-old-sessions/ # Session cleanup endpoint
│       └── ...             # Other secure API endpoints
├── components/
│   ├── common/             # Reusable components
│   ├── ui/                 # Base UI components
│   ├── cards/              # Map selection cards
│   ├── game/               # Game board components
│   └── navigation/         # Navigation controls
├── features/               # Feature-based modules
│   ├── game/
│   │   └── hooks/          # Game-specific hooks
│   └── session/
│       └── hooks/          # Session management hooks
├── lib/
│   ├── config/             # Security and app configuration
│   ├── services/           # Business logic services
│   ├── validation/         # Input validation schemas
│   ├── types/              # TypeScript type definitions
│   ├── state/              # State management
│   ├── data/               # Data handling utilities
│   ├── constants/          # Icons and constants
│   └── utils/              # Utility functions
data/                       # JSON data files
└── public/                 # Static assets
```

## How to Use

### 1. Select a Map
Choose from 5 available map types using the cards menu:
- Normal
- Crater  
- Mountaintop
- Noklateo, the Shrouded City
- Rotted Woods

### 2. Place Buildings
- Click on any slot (numbered 01-27) on the map
- Select a building from the popup panel
- Watch as the seed count updates in real-time

### 3. Choose Nightlord
- Once you have buildings placed, select a nightlord
- 8 different nightlords available
- Exact matches will be highlighted

### 4. Get Your Seed
- When you find a perfect match, the result will be displayed
- Copy the seed ID or share the entire configuration
- Use the URL to return to this exact state anytime

## Technical Details

### Technologies Used
- **Next.js 15.5.3**: React framework with App Router and API routes
- **TypeScript**: Type-safe development with strict configuration
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **Zustand**: Lightweight state management
- **Supabase**: Database with server-side query architecture
- **Web Crypto API**: Secure session management
- **Next.js API Routes**: Server-side database operations and CORS protection

### Security Features
- **Input Validation**: Comprehensive schema validation for all inputs
- **Session Security**: Cryptographically secure session IDs
- **Type Safety**: Zero `any` types, comprehensive interface coverage
- **Server-Side Database Access**: All database operations through secure API routes
- **CORS Elimination**: No cross-origin requests to external databases
- **Request Protection**: Size limits and validation on all API endpoints
- **Error Handling**: Secure error responses without information leakage

### Data Sources
- **320 Seeds**: Complete seed database with all configurations
- **28 Coordinates**: Precise X,Y positions for all slots + nightlord
- **24 Building Types**: All available buildings with icons
- **8 Nightlords**: All available nightlord characters
- **10 Events**: Special event types

### Performance Features
- **SSR Ready**: Server-side rendering support
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic component-level code splitting
- **Lazy Loading**: Images and components load on demand
- **Performance Utilities**: Debouncing, throttling, and memoization

## Development

### Key Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npx tsc --noEmit     # TypeScript check
```

### State Management
The app uses Zustand for state management with these key features:
- URL synchronization
- History tracking for undo/redo
- Real-time seed filtering
- Phase management (selection → building → complete)

### Security Best Practices
1. **Input Validation**: All inputs validated against schemas
2. **Type Safety**: Comprehensive TypeScript coverage
3. **Session Security**: Secure session ID generation and management
4. **API Protection**: Request validation and size limits
5. **Error Handling**: Secure error responses

### Adding New Features

#### New Components
Follow the feature-based architecture:
```
src/features/[feature-name]/
├── components/     # Feature-specific components
├── hooks/         # Feature-specific hooks
└── types/         # Feature-specific types
```

#### New API Endpoints
Use the validation pattern:
```typescript
import { validateRequest } from '@/lib/validation/schemas';
import { sanitizeInput } from '@/lib/config/security';
```

#### State Changes
Update the type-safe Zustand store in `src/lib/state/store.ts`

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Compliance

This application implements enterprise-grade security practices:

- **OWASP Guidelines**: Follows OWASP secure coding practices
- **Input Validation**: Multi-layer validation and sanitization
- **Session Security**: Cryptographically secure session management
- **Type Safety**: Comprehensive TypeScript implementation
- **API Security**: Protected endpoints with proper validation

## Contributing

This project follows modern software development practices with a focus on security, maintainability, and performance. The feature-based architecture supports easy extension and modification while maintaining security standards.

### Development Guidelines
1. All new code must be fully typed (no `any` types)
2. All inputs must be validated using the schema system
3. Follow the feature-based architecture pattern
4. Include proper error handling and security measures
5. Add performance optimizations where applicable

## License

This project is for educational and community use. All Nightreign assets and data belong to their respective owners.

---

## What's New in Version 2.0

### Security Improvements
- **Type Safety**: Eliminated all `any` types, comprehensive TypeScript coverage
- **Input Validation**: Multi-layer validation with schema enforcement
- **Session Security**: Cryptographically secure session IDs using Web Crypto API
- **API Protection**: Request size limits, validation, and secure error handling

### Architecture Improvements
- **Feature-Based Structure**: Modular architecture with clear separation of concerns
- **Server-Side API Layer**: Secure database operations through Next.js API routes
- **Service Layer**: Dedicated business logic services
- **Validation Layer**: Comprehensive input validation and sanitization
- **Performance Layer**: Debouncing, throttling, and memoization utilities
- **CORS-Free Architecture**: Eliminates cross-origin request issues

### Code Quality
- **Zero Console Logs**: Production-ready codebase with no debug artifacts
- **Clean Architecture**: Well-organized, maintainable code structure
- **Performance Optimized**: Advanced optimization techniques implemented
- **Security Hardened**: Enterprise-grade security practices

### Development Experience
- **Modern Tooling**: Latest Next.js with App Router
- **Type Safety**: Comprehensive TypeScript implementation
- **Developer Tools**: Advanced debugging and development utilities
- **Documentation**: Comprehensive documentation and examples

## Recent Updates

See [patchNotes.md](./patchNotes.md) for detailed version history and technical changes.

**Ready to find your perfect Nightreign seed with enterprise-grade security and performance.**