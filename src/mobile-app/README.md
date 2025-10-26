# iFindLife Mobile App

This directory contains the complete mobile application interface for iFindLife, including both **User** and **Expert** flows.

## 🏗️ Architecture Overview

```
mobile-app/
├── index.tsx                 # Main routing & lazy loading setup
├── components/
│   ├── layout/              # Layout components (headers, navigation)
│   └── skeletons/           # Loading state components
├── screens/                 # All screen components
│   ├── user/               # User flow screens
│   ├── expert/             # Expert flow screens
│   ├── auth/               # Authentication screens
│   ├── onboarding/         # Onboarding flow
│   └── booking/            # Booking flow
├── utils/                   # Utility functions
│   └── navigation.ts       # Navigation helpers
└── data/
    └── mockData.ts         # Mock data (TO BE REPLACED)
```

## 📱 User Flow Routes

**Base Path:** `/mobile-app/`

### User App (`/app/*`)
- `/app/` - Home screen (dashboard, featured experts, quick sessions)
- `/app/services` - Browse all services
- `/app/services/:serviceId` - Service detail page
- `/app/experts` - Find experts by specialty
- `/app/experts/:expertId` - Expert profile page
- `/app/booking/*` - Booking flow (select time, payment, confirm)
- `/app/call/:sessionId` - Live video call interface
- `/app/chat/:sessionId` - Live chat interface
- `/app/profile` - User profile & settings
- `/app/notifications` - Notifications center
- `/app/payment` - Payment methods management
- `/app/settings` - App settings
- `/app/activity/breathing` - Breathing exercise
- `/app/activity/meditation` - Meditation exercise

### User Authentication (`/auth/*`)
- `/auth/login` - Login screen
- `/auth/signup` - Sign up screen
- `/auth/otp` - OTP verification
- `/auth/forgot-password` - Password recovery

### Onboarding (`/onboarding/*`)
- `/onboarding/welcome` - Welcome screen
- `/onboarding/features` - Feature highlights
- `/onboarding/preferences` - User preferences setup

## 👨‍⚕️ Expert Flow Routes

**Base Path:** `/mobile-app/expert-app/*`

### Expert Dashboard
- `/expert-app/` - Dashboard (stats, appointments, quick actions)
- `/expert-app/appointments` - All appointments (upcoming, past)
- `/expert-app/availability` - Set available time slots
- `/expert-app/earnings` - Earnings reports & payouts
- `/expert-app/profile` - Profile management
- `/expert-app/notifications` - Notifications center
- `/expert-app/ratings-reviews` - View ratings & client reviews

### Expert Authentication (`/expert-auth/*`)
- `/expert-auth/login` - Expert login
- `/expert-auth/signup` - Expert registration
- `/expert-auth/select-services` - Service selection during onboarding

## 🎨 Layout Components

### User App Layout
- **MobileHeader** - Logo, back button, search, notifications
- **BottomNavigation** - 4-tab navigation (Home, Experts, Services, Profile)
- **MobileAppLayout** - Wrapper combining header + content + bottom nav

### Expert App Layout
- **ExpertMobileHeader** - Logo, back button, notifications
- **ExpertBottomNavigation** - 4-tab navigation (Home, Appointments, Earnings, Profile)
- Layout wrapper in `index.tsx` (header + content + bottom nav)

### Navigation Behavior
- Bottom navigation hidden on call and chat screens
- Back button shows on detail pages
- Active tab highlighted with brand color (ifind-teal)
- Smooth transitions between routes

## 🎭 Loading States

**Skeleton Components** (`/components/skeletons/`)

Use these while data is loading:

```tsx
import { ExpertCardSkeleton } from '@/mobile-app/components/skeletons/ExpertCardSkeleton';
import { ServiceCardSkeleton } from '@/mobile-app/components/skeletons/ServiceCardSkeleton';
import { AppointmentCardSkeleton } from '@/mobile-app/components/skeletons/AppointmentCardSkeleton';
import { StatCardSkeleton } from '@/mobile-app/components/skeletons/StatCardSkeleton';

// Example usage
{isLoading ? <ExpertCardSkeleton /> : <ExpertCard data={expert} />}
```

## 📊 Mock Data

**Location:** `src/mobile-app/data/mockData.ts`

All screens currently use mock data. This file contains:

- `mockExperts` - Expert profiles
- `mockAppointments` - Appointment data
- `mockServices` - Service offerings
- `mockDashboardStats` - Expert dashboard statistics
- `mockExpertAccount` - Expert account information
- `mockNotifications` - Notification data

### 🔌 Integration Checklist

When connecting to backend:

1. **Replace mock data imports:**
   ```tsx
   // Before
   import { mockExperts } from '@/mobile-app/data/mockData';
   
   // After
   import { useQuery } from '@tanstack/react-query';
   import { supabase } from '@/integrations/supabase/client';
   ```

2. **Add data fetching hooks**
3. **Implement error handling**
4. **Add loading states** (use skeleton components)
5. **Connect authentication** (Supabase Auth)
6. **Real-time updates** (Supabase subscriptions)
7. **Payment integration** (Stripe or payment gateway)
8. **File uploads** (Supabase Storage for avatars)
9. **Push notifications** (for appointment reminders)

## 🔐 Authentication Status

- **User Auth**: UI complete, needs Supabase integration
- **Expert Auth**: UI complete, needs Supabase integration
- **Protected Routes**: Not yet implemented (add auth guards)
- **Session Management**: Not yet implemented

## 🎥 Video Call Integration

**Status:** NOT IMPLEMENTED IN MOBILE APP

The Agora SDK integration is intentionally **excluded** from the mobile app routes to keep it lightweight during development.

When ready to integrate:
1. Import Agora components from `/components/call/`
2. Add SDK loading to call screens
3. Implement call state management
4. Add network quality indicators
5. Handle permissions (camera/microphone)

**Note:** Desktop web already has working Agora integration that can be adapted.

## 🎨 Design System

All components use the iFindLife brand design tokens:

**Colors:**
- `ifind-teal` - Primary brand color
- `ifind-aqua` - Secondary brand color
- `ifind-purple` - Accent color
- `ifind-charcoal` - Text color
- `ifind-soft-gray` - Subtle backgrounds

**Typography:**
- Font family: Poppins (via `font-poppins` class)
- Use semantic sizing: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`

**Spacing:**
- Bottom navigation height: `h-16` (64px)
- Content bottom padding: `pb-20` (80px) to prevent overlap
- Standard padding: `p-4` or `p-6`

## 🧪 Testing Routes

To test the mobile app:

1. **User Flow:**
   - Navigate to `/mobile-app/` (splash screen)
   - Then `/mobile-app/onboarding/welcome`
   - Then `/mobile-app/auth/login`
   - Then `/mobile-app/app/` (main app)

2. **Expert Flow:**
   - Navigate to `/mobile-app/expert-auth/login`
   - Complete sign up flow
   - Then `/mobile-app/expert-app/` (dashboard)

3. **Direct Testing:**
   - User app: `/mobile-app/app/`
   - Expert app: `/mobile-app/expert-app/`

## 📱 Responsive Design

The mobile app is designed for:
- **Width:** 320px - 428px (mobile devices)
- **Container:** `max-w-sm` (384px max width, centered)
- **Border:** Left/right borders for desktop preview
- **Shadow:** Drop shadow on desktop for app-like appearance

**Viewing in Browser:**
- Open browser DevTools
- Toggle device toolbar (mobile view)
- Select iPhone or Android device preset

## 🚀 Performance

**Optimizations Implemented:**

✅ **Route-level code splitting** - All routes lazy loaded
✅ **Component lazy loading** - Screens load on-demand
✅ **Suspense boundaries** - Loading states while chunks load
✅ **Agora SDK deferred** - Heavy SDK not loaded in mobile app
✅ **Skeleton components** - Smooth loading experience

**Load Time Targets:**
- Initial load: < 2 seconds
- Route transitions: < 500ms
- Data fetching: < 1 second

## 🐛 Known Issues / TODO

### High Priority
- [ ] Connect authentication to Supabase
- [ ] Replace all mock data with real API calls
- [ ] Add protected route guards
- [ ] Implement booking flow backend
- [ ] Add payment gateway integration

### Medium Priority
- [ ] Add page transition animations
- [ ] Implement search functionality
- [ ] Add offline support / caching
- [ ] Push notification setup
- [ ] Add analytics tracking

### Low Priority / Nice to Have
- [ ] Add haptic feedback (mobile devices)
- [ ] Implement pull-to-refresh
- [ ] Add dark mode support
- [ ] Improve empty states with illustrations
- [ ] Add onboarding tutorial tooltips

## 📝 Code Style Guidelines

1. **Component Structure:**
   ```tsx
   import React from 'react';
   import { useNavigate } from 'react-router-dom';
   // ... other imports
   
   export const ComponentName: React.FC = () => {
     // Hooks first
     const navigate = useNavigate();
     
     // Event handlers
     const handleClick = () => { ... };
     
     // Render
     return (
       <div>...</div>
     );
   };
   ```

2. **Naming Conventions:**
   - Components: PascalCase (`ExpertCard.tsx`)
   - Files: PascalCase for components, camelCase for utils
   - Routes: kebab-case (`/expert-app/ratings-reviews`)
   - CSS classes: Use Tailwind utilities

3. **Accessibility:**
   - Add `aria-label` to all icon buttons
   - Use semantic HTML (`<nav>`, `<header>`, `<main>`)
   - Ensure focus states are visible
   - Minimum touch target: 44x44px

## 🤝 Contributing

When adding new screens:

1. Create screen component in appropriate directory
2. Add route in `index.tsx`
3. Add skeleton component if needed
4. Update mock data if needed
5. Add navigation link if needed
6. Test on mobile viewport
7. Update this README

## 📚 Additional Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [React Router Docs](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Questions?** Check the main project README or contact the development team.
