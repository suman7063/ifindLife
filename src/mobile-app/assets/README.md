# Mobile App Assets

This folder contains all icons, graphics, and images used in the mobile app screens.

## Folder Structure

```
assets/
├── icons/          # Custom SVG icons (if needed beyond lucide-react)
├── images/         # Static images (hero, backgrounds, illustrations)
├── logos/          # Brand logos and app icons
└── README.md       # This file
```

## Icon Library

The mobile app primarily uses **lucide-react** for icons. Import them like:

```tsx
import { Wallet, CreditCard, Lock, User } from 'lucide-react';
```

### Commonly Used Icons

| Icon | Import | Usage |
|------|--------|-------|
| `Wallet` | `lucide-react` | Wallet/Payment screens |
| `CreditCard` | `lucide-react` | Payment methods |
| `User` | `lucide-react` | Profile sections |
| `Calendar` | `lucide-react` | Booking/Scheduling |
| `Clock` | `lucide-react` | Time/Duration |
| `Phone` | `lucide-react` | Call features |
| `Video` | `lucide-react` | Video call |
| `MessageCircle` | `lucide-react` | Chat |
| `Heart` | `lucide-react` | Favorites |
| `Star` | `lucide-react` | Ratings |
| `Shield` | `lucide-react` | Security |
| `Lock` | `lucide-react` | Secure actions |
| `Bell` | `lucide-react` | Notifications |
| `Settings` | `lucide-react` | Settings |
| `ChevronRight` | `lucide-react` | Navigation arrows |
| `ArrowLeft` | `lucide-react` | Back button |

## Image Sources

- **Expert Avatars**: Unsplash (temporary placeholders)
- **Brand Assets**: `/public/ifindlife-logo.png`, `/public/ifindlife-logo-transparent.png`
- **App Graphics**: `src/assets/` folder

## Adding New Assets

1. Place SVG icons in `icons/` folder
2. Place images in `images/` folder
3. Place logos in `logos/` folder
4. Import using: `import myIcon from '@/mobile-app/assets/icons/my-icon.svg'`

## Brand Colors (Reference)

- Primary Aqua: `#00bcd4` (ifind-aqua)
- Primary Teal: `#009688` (ifind-teal)
- Charcoal: `#2d3748` (ifind-charcoal)
