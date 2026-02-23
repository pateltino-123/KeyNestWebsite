# ShoeFit - Application Architecture Documentation

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Language | TypeScript 5.9 (strict mode) |
| Routing | Expo Router 6 (file-based) |
| State Management | React Query 5, React Context (`@nkzw/create-context-hook`), AsyncStorage |
| UI | React Native StyleSheet, Lucide Icons, Expo Image, Expo Blur |
| AI | `@rork-ai/toolkit-sdk` (conversational agent) |
| External API | Kicks.dev v2 (sneaker data) |
| Haptics | Expo Haptics |
| Animations | React Native Animated API |
| Package Manager | Bun |

---

## Project Structure

```
shoefit/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx               # Root layout (providers, navigation stack)
│   ├── +not-found.tsx            # 404 fallback screen
│   ├── +native-intent.tsx        # Native deep linking configuration
│   ├── modal.tsx                 # Generic modal route
│   ├── scan.tsx                  # Foot scanning full-screen modal
│   ├── shoe/
│   │   └── [id].tsx              # Dynamic shoe detail page
│   └── (tabs)/
│       ├── _layout.tsx           # Tab bar configuration
│       ├── index.tsx             # Home tab
│       ├── browse.tsx            # Discover/Browse tab
│       ├── wishlist.tsx          # Saved/Wishlist tab
│       ├── assistant.tsx         # AI Expert tab
│       └── profile.tsx           # Profile tab
├── components/                   # Shared reusable components
│   ├── ShoeCard.tsx              # Multi-variant shoe display card
│   ├── MeasurementDisplay.tsx    # Foot measurement visualization
│   └── ReviewsModal.tsx          # Product reviews modal
├── constants/
│   └── colors.ts                 # Theme color definitions (dark/light)
├── contexts/                     # Application-wide state providers
│   ├── ThemeContext.tsx           # Theme state (dark/light mode)
│   └── UserContext.tsx            # User data, measurements, wishlist, preferences
├── mocks/
│   ├── shoes.ts                  # Static shoe catalog data + type definitions
│   └── sizingTips.ts             # Brand sizing tips + foot type guidance
├── services/
│   └── kicksApi.ts               # Kicks.dev API client + data mapping
├── assets/images/                # App icons and splash screen
├── app.json                      # Expo configuration
├── tsconfig.json                 # TypeScript configuration (path aliases)
├── babel.config.js               # Babel configuration
├── metro.config.js               # Metro bundler configuration
└── package.json                  # Dependencies and scripts
```

---

## Module Descriptions

### `app/_layout.tsx` — Root Layout

The application entry point that assembles the provider hierarchy and configures the navigation stack.

**Responsibilities:**
- Initializes `QueryClientProvider` (React Query) as the outermost provider
- Wraps the app in `GestureHandlerRootView` for gesture support
- Nests `ThemeProvider` and `UserProvider` inside React Query
- Configures the root `Stack` navigator with three routes:
  - `(tabs)` — Main tab navigation (headerShown: false)
  - `scan` — Full-screen modal presentation
  - `shoe/[id]` — Shoe detail with transparent header
- Manages splash screen lifecycle (auto-hide on mount)
- Applies theme-aware header and content styles
- Controls `StatusBar` style based on dark/light theme

**Provider hierarchy:**
```
QueryClientProvider
  └── GestureHandlerRootView
       └── ThemeProvider
            └── UserProvider
                 └── RootLayoutNav (Stack navigator)
```

---

### `app/(tabs)/_layout.tsx` — Tab Navigation

Configures the bottom tab bar with 5 tabs.

**Responsibilities:**
- Defines 5 tabs: Home, Discover, Saved, AI Expert, Profile
- Uses Lucide icons with dynamic stroke width (bolder when focused)
- Applies focused state background highlight on icon containers
- iOS: Translucent blur tab bar via `expo-blur` `BlurView`
- Android: Solid surface-colored tab bar
- All tab screens have `headerShown: false` (headers managed internally)
- Theme-aware active/inactive tint colors

---

### `app/(tabs)/index.tsx` — Home Screen

The landing dashboard that provides an overview and quick access to features.

**Responsibilities:**
- Displays personalized greeting using user profile name
- Renders animated "Scan Your Feet" CTA with spring press animation
- Shows compact measurement summary if measurements exist
- Displays random brand sizing tip from `sizingTips` mock data
- Renders "Recommended For You" grid (running category shoes, up to 6)
- Renders "Popular Picks" horizontal scroll (shoes rated >= 4.7, up to 6)
- Navigates to `/scan` on CTA press, `/browse` on "See All"

**Dependencies:** `UserContext`, `ThemeContext`, `ShoeCard`, `MeasurementDisplay`, `shoes` mock data, `sizingTips`

---

### `app/(tabs)/browse.tsx` — Discover Screen

Full shoe catalog with search, category filtering, and advanced filter modal.

**Responsibilities:**
- Implements debounced text search (500ms) across name, brand, category, description
- Category chip selection with icon mapping (Dumbbell, Shirt, Briefcase, Footprints, HardHat, Heart)
- Advanced filter modal with:
  - Multi-select brand chips
  - Multi-select color chips (dynamically extracted from shoe data)
  - Min/max price range text inputs with validation
- Computes `filteredShoes` via `useMemo` combining all filter criteria
- Tracks active filter count for badge display
- Pull-to-refresh support
- 2-column grid layout for results
- Empty state with contextual messaging and clear filters action

**Dependencies:** `ThemeContext`, `ShoeCard`, `shoes` mock data (types + constants)

---

### `app/(tabs)/assistant.tsx` — AI Expert Screen

Conversational AI assistant for shoe recommendations and sizing advice.

**Responsibilities:**
- Constructs a dynamic system prompt containing:
  - Full shoe catalog summary (brand, price, category, fit, arch support, sizing tips)
  - User's current measurements (if available)
  - User's wishlist contents
  - Brand-specific sizing knowledge
- Manages chat via `useRorkAgent` hook from `@rork-ai/toolkit-sdk`
- Initializes conversation with context-aware greeting
- Renders chat bubbles with role-based styling (user: primary color, assistant: surface)
- Displays typing indicator (3 animated dots) while awaiting response
- Provides 4 quick prompt buttons for common queries
- Handles keyboard avoidance with platform-specific behavior
- Auto-scrolls to newest message on content change

**Dependencies:** `UserContext`, `ThemeContext`, `@rork-ai/toolkit-sdk`, `shoes` mock data

---

### `app/(tabs)/wishlist.tsx` — Wishlist Screen

Wishlist management with status tracking, filtering, and sorting.

**Responsibilities:**
- Consumes `useWishlistedShoes` hook to resolve wishlist item IDs to full shoe objects
- Implements filter chips: All, Saved, Purchased, Didn't Fit
- Implements sort dropdown: Date Added, Price, Brand
- Renders wishlist items as horizontal shoe cards with status action buttons
- Allows marking items as "Purchased" or "Didn't Fit"
- Provides "Ask Assistant" shortcut in header
- Shows contextual empty states based on active filter

**Dependencies:** `UserContext`, `ThemeContext`, `ShoeCard`, `shoes` mock data

---

### `app/(tabs)/profile.tsx` — Profile Screen

User profile management, measurement display, scan history, and app settings.

**Responsibilities:**
- Displays user avatar, name, email (or setup prompt)
- Edit Profile modal with name/email text inputs
- My Measurements section with full `MeasurementDisplay` component
- Scan History list (most recent 3 scans with date, size, foot type, arch)
- Theme toggle (Dark/Light) with current mode label
- Preferences modal with:
  - Size system selector (US/UK/EU)
  - Preferred brands multi-select
  - Style preferences multi-select
  - Budget range min/max inputs

**Dependencies:** `UserContext`, `ThemeContext`, `MeasurementDisplay`, `brands`/`categories` from mock data

---

### `app/scan.tsx` — Foot Scanning Screen

Multi-step foot scanning wizard presented as a full-screen modal.

**Responsibilities:**
- Manages 5-step state machine: `intro` > `left` > `right` > `processing` > `results`
- Renders step indicator dots in header
- Intro step: Instructions list with numbered steps, pulsing icon animation
- Scan steps: Camera frame placeholder with foot outline, corner alignment markers, credit card reference
- Processing step: Animated progress bar (2.5s duration), pulsing icon
- Results step: Recommended size card, 4-item measurement grid, save/rescan actions
- Generates simulated measurements (randomized within realistic ranges)
- Saves measurements to `UserContext` on confirmation
- Haptic feedback on capture (medium) and save (success notification)

**Dependencies:** `UserContext`, `Colors` constants

---

### `app/shoe/[id].tsx` — Shoe Detail Screen

Comprehensive product detail page with sizing intelligence and purchasing links.

**Responsibilities:**
- Resolves shoe data from: React Query cache > mock data > API fetch (in priority order)
- Renders full-width hero image with overlay navigation buttons
- Displays brand, name, rating badge, review count
- Computes and displays sizing alerts based on user measurements vs shoe fit characteristics
- Shows brand-specific sizing tips from `sizingTips` data
- Highlights user's recommended size in the available sizes scroll
- Renders color options, description, and details grid (materials, width, arch, category)
- Reviews modal with star ratings, comments, verified badges, and add-review form
- "Where to Buy" modal with links to StockX, GOAT, Flight Club (opens via `Linking.openURL`)
- Fixed bottom bar with "Ask Assistant" shortcut and "Where to Buy" CTA
- Wishlist toggle with heart icon and haptic feedback

**Dependencies:** `UserContext`, `ThemeContext`, `ReviewsModal`, `kicksApi` service, `shoes` + `sizingTips` mocks, React Query

---

### `components/ShoeCard.tsx` — Shoe Card Component

A multi-variant reusable card component for displaying shoes across the app.

**Responsibilities:**
- Supports 3 layout variants:
  - `default` — Vertical card with image, wishlist heart overlay, sizing alert badge, brand, name, rating (used in grids)
  - `compact` — Small 140px-wide card with image, brand, name, rating (used in horizontal scrolls)
  - `horizontal` — Row layout with thumbnail, info column, wishlist button (used in wishlist)
- Spring press animation (scale to 0.97) on all variants
- Sizing alert badges when user measurements conflict with shoe fit
- Wishlist toggle with heart icon and haptic feedback
- Navigates to `/shoe/[id]` on press
- Fallback image handling for missing shoe images

**Dependencies:** `UserContext`, `ThemeContext`, `Shoe` type

---

### `components/MeasurementDisplay.tsx` — Measurement Display

Displays foot measurements in two formats.

**Responsibilities:**
- `compact` mode: Single-row display with Size, Width, Arch separated by dividers (used on Home)
- Full mode: Recommended size hero card + 4-item grid with icons for Length, Width, Arch Type, Foot Type (used on Profile)
- Calculates average length/width from left + right foot measurements
- Uses Lucide icons (Ruler, ArrowLeftRight, Mountain) for measurement categories

**Dependencies:** `Colors` constants, `FootMeasurements` type

---

### `components/ReviewsModal.tsx` — Reviews Modal

Modal overlay for viewing and adding product reviews.

**Responsibilities:**
- Displays list of reviews with star ratings, user names, dates, comments, and verified badges
- Star rating selector for new reviews (1-5 stars)
- Comment text input for new review submission
- Empty state when no reviews exist
- Modal presentation with close button

**Dependencies:** `Colors` constants, `Review` type

---

### `contexts/UserContext.tsx` — User State Provider

Central state management for all user-related data with AsyncStorage persistence.

**Responsibilities:**
- Manages user state containing:
  - `profile` — Name, email, avatar
  - `measurements` — Foot dimensions, arch type, foot type, recommended size
  - `preferences` — Preferred brands, budget range, style preferences, size system
  - `wishlist` — Array of items with shoe ID, date added, and status (saved/purchased/didn't_fit)
  - `scanHistory` — Up to 10 most recent scan records
  - `hasCompletedOnboarding` — Boolean flag
- Loads persisted state from AsyncStorage via React Query on mount
- Persists all state changes via `useMutation` to AsyncStorage
- Exposes action functions: `setMeasurements`, `setPreferences`, `setProfile`, `addToWishlist`, `removeFromWishlist`, `updateWishlistStatus`, `isInWishlist`, `completeOnboarding`
- Exports utility hooks:
  - `useWishlistedShoes(shoes)` — Maps wishlist IDs to full shoe objects
  - `useRecommendedShoes(shoes)` — Scores and ranks shoes based on measurements + preferences (width fit, arch support, rating)

**Pattern:** `createContextHook` from `@nkzw/create-context-hook` for type-safe context + hook pair

---

### `contexts/ThemeContext.tsx` — Theme Provider

Manages dark/light theme state with persistence.

**Responsibilities:**
- Stores theme mode (`"dark"` | `"light"`) in state
- Loads persisted theme from AsyncStorage via React Query
- Persists theme changes via `useMutation`
- Computes `colors` object from `darkTheme` or `lightTheme` based on mode
- Exposes: `mode`, `colors`, `isDark`, `toggleTheme`, `setTheme`, `isLoading`

**Pattern:** `createContextHook` from `@nkzw/create-context-hook`

---

### `constants/colors.ts` — Theme Colors

Defines the complete color palette for both themes.

**Exports:**
- `darkTheme` — 24 color tokens for dark mode (primary blue, emerald accent, deep blacks)
- `lightTheme` — 24 color tokens for light mode (blue primary, emerald accent, slate whites)
- `ThemeColors` — TypeScript type derived from theme object shape
- Default export: `darkTheme`

**Color categories:** primary, accent, background, surface, text (3 levels), border, success, error, warning (each with light variant), white, black, overlay, shadow

---

### `mocks/shoes.ts` — Shoe Catalog Data

Static shoe catalog serving as the primary data source.

**Exports:**
- `Shoe` interface — Complete type definition with 20+ properties including sizing metadata (`runsSmall`, `runsLarge`, `widthFit`, `archSupport`), medical types, and reviews
- `Review` interface — User review type (rating, comment, date, verified status)
- `shoes` array — Full catalog of shoes across brands (Nike, Adidas, New Balance, Jordan, Converse, Vans, Puma, Reebok, ASICS, Skechers, Brooks, On Running, Under Armour, Yeezy) with accurate product images
- `categories` array — Category definitions (athletic, casual, formal, running, work, medical)
- `brands` array — All supported brand names

---

### `mocks/sizingTips.ts` — Sizing Intelligence Data

Brand-specific and foot-type sizing guidance.

**Exports:**
- `SizingTip` interface — Brand, tip text, direction (small/large/normal), size adjustment value
- `brandSizingTips` array — 8 brand-specific tips (Adidas, Nike, New Balance, Converse, ASICS, On, Reebok, Skechers)
- `footTypeTips` object — Advice for flat, neutral, and high arch types with shoe model recommendations
- `widthTips` object — Advice for narrow, normal, and wide feet with brand recommendations

---

### `services/kicksApi.ts` — External Sneaker API Client

Integration layer with the Kicks.dev v2 API for real-time sneaker data.

**Responsibilities:**
- Authenticated API client with `fetchWithAuth` (Authorization header, 8s timeout, abort controller)
- API availability tracking with 60-second retry intervals after failures
- Product search with shoe-only filtering (keyword-based clothing exclusion, shoe keyword detection)
- Image extraction from multiple possible API response fields
- "Common shoe" scoring algorithm that prioritizes:
  - Simple/standard colorways over limited editions
  - Popular models (Air Force 1, Dunk Low, Samba, etc.)
  - Affordable pricing (under $150 scores highest)
- Product-to-Shoe data mapping (`mapKicksProductToShoe`):
  - Brand name normalization
  - Category auto-detection from title keywords
  - Activity type inference from category
  - Buy link generation (StockX, GOAT, Nike)
  - Sizing tip lookup by brand
- Specialized query functions: `searchProducts`, `searchByBrand`, `getTrendingProducts`, `getHomeRecommendations`, `getPopularShoes`, `searchProductsUnder200`
- 12-item fallback shoe catalog for offline/API-failure scenarios

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────┐
│                  AsyncStorage                     │
│  (user data, theme preference, scan history)      │
└────────────────────┬────────────────────────────┘
                     │ read/write
                     ▼
┌─────────────────────────────────────────────────┐
│              React Query                          │
│  queryKey: ["userData"], ["theme"]                 │
│  Manages cache, loading states, mutations         │
└────────────────────┬────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│  UserContext      │  │  ThemeContext     │
│  (profile, meas, │  │  (mode, colors,  │
│   wishlist, prefs)│  │   isDark)        │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         └──────────┬──────────┘
                    ▼
         ┌────────────────────┐
         │   Screen Components │
         │  (tabs, modals,    │
         │   detail pages)    │
         └────────┬───────────┘
                  │ on-demand
                  ▼
         ┌────────────────────┐
         │  Kicks.dev API      │
         │  (search, details,  │
         │   trending)         │
         └────────────────────┘
```

---

## Navigation Architecture

```
Stack (Root)
├── (tabs) — Tab Navigator
│   ├── index (Home)           → "/"
│   ├── browse (Discover)      → "/browse"
│   ├── wishlist (Saved)       → "/wishlist"
│   ├── assistant (AI Expert)  → "/assistant"
│   └── profile (Profile)      → "/profile"
├── scan                       → "/scan"          (fullScreenModal)
├── shoe/[id]                  → "/shoe/:id"      (stack push, transparent header)
├── modal                      → "/modal"         (standard modal)
└── +not-found                 → 404 fallback
```

**Navigation patterns:**
- Tab-to-tab: Handled by tab bar
- Home → Scan: `router.push("/scan")` opens full-screen modal overlay
- Any → Shoe Detail: `router.push("/shoe/${id}")` pushes onto stack with back gesture
- Shoe Detail → Assistant: `router.push("/(tabs)/assistant")` switches to AI tab
- Wishlist → Browse: `router.push("/browse")` switches to Discover tab
- External links: `Linking.openURL()` for retailer websites (StockX, GOAT, Flight Club)

---

## State Management Strategy

| Data Type | Storage | Mechanism | Scope |
|-----------|---------|-----------|-------|
| User profile | AsyncStorage | React Query + UserContext | Global |
| Foot measurements | AsyncStorage | React Query + UserContext | Global |
| Scan history | AsyncStorage | React Query + UserContext | Global |
| Wishlist | AsyncStorage | React Query + UserContext | Global |
| User preferences | AsyncStorage | React Query + UserContext | Global |
| Theme preference | AsyncStorage | React Query + ThemeContext | Global |
| Search query | useState | Local state | Browse screen |
| Active filters | useState | Local state | Browse screen |
| Chat messages | useRorkAgent | SDK-managed | Assistant screen |
| Modal visibility | useState | Local state | Per-screen |
| Shoe detail data | React Query cache | queryKey: ["shoe-detail", id] | Cached |
| API shoe catalog | React Query cache | queryKey: ["shoes", ...] | Cached |

---

## Key Design Decisions

1. **Mock-first with API fallback:** The app uses a comprehensive static shoe catalog (`mocks/shoes.ts`) as the primary data source, with the Kicks.dev API providing supplementary real-time data. This ensures the app is always functional regardless of API availability.

2. **Context via `createContextHook`:** Instead of raw `React.createContext`, the app uses `@nkzw/create-context-hook` which eliminates boilerplate and ensures type safety without explicit generic annotations.

3. **React Query for persistence:** AsyncStorage reads/writes are wrapped in React Query's `useQuery`/`useMutation` pattern, providing automatic cache management, loading states, and error handling for persisted data.

4. **Theme as dynamic colors object:** Rather than conditional styling, the theme system provides a `colors` object that components destructure and apply inline, keeping StyleSheet definitions static while allowing dynamic theming.

5. **Single ShoeCard with variants:** Instead of separate card components, `ShoeCard` supports 3 layout variants (`default`, `compact`, `horizontal`) through a single component with variant-based rendering logic.

6. **Scanning simulation:** The foot scanning feature uses simulated measurements (randomized within realistic ranges) rather than actual camera-based measurement, with the UI designed to support future real scanning implementation.
