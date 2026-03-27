# ShoeFit - Product Feature Documentation

## Overview

ShoeFit is a cross-platform mobile application built with React Native and Expo that helps users find perfectly fitting shoes through AI-powered foot scanning, personalized recommendations, and an intelligent shoe expert assistant. The app combines foot measurement technology with a comprehensive shoe catalog, wishlist management, and smart sizing alerts to eliminate the guesswork from online shoe shopping.

---

## Core Features

### 1. Foot Scanning & Measurement

**Screen:** Full-screen modal (`/scan`)

The foot scanning feature guides users through a multi-step process to capture and analyze foot measurements.

- **Guided Scanning Flow:** A step-by-step wizard (Intro > Left Foot > Right Foot > Processing > Results) walks users through the scanning process with clear instructions and visual cues.
- **Camera Alignment UI:** Displays a foot outline overlay with corner alignment markers and a credit card reference placeholder to ensure accurate scale calibration.
- **Animated Processing:** A progress bar animation with pulsing icon provides visual feedback while the AI analyzes foot dimensions.
- **Measurement Results:** Displays comprehensive results including:
  - Recommended US shoe size
  - Left and right foot dimensions (length x width in cm)
  - Arch type classification (Flat, Neutral, High)
  - Foot width classification (Narrow, Normal, Wide)
- **Save & Rescan:** Users can save measurements to their profile or rescan if results seem inaccurate.
- **Haptic Feedback:** Medium impact haptics on capture, success notification haptics on save.

---

### 2. Home Dashboard

**Screen:** Home tab (`/`)

The home screen serves as the central hub, providing personalized content and quick access to key features.

- **Personalized Greeting:** Displays user's name if profile is set up, otherwise shows a welcome message.
- **Scan CTA Button:** A prominent, animated call-to-action button encouraging users to scan their feet (or rescan if already done). Features spring press animation for tactile feedback.
- **Measurement Summary:** If measurements exist, displays a compact view showing recommended size, foot width, and arch type.
- **Sizing Tips Banner:** Rotates through brand-specific sizing tips (e.g., "Yeezy models typically run 0.5 size small").
- **Recommended For You:** A 2-column grid of up to 6 running shoes filtered from the catalog.
- **Popular Picks:** A horizontal scrollable row of top-rated shoes (rating >= 4.7) displayed in compact card format.
- **Navigation Links:** "See All" links to the full browse/discover screen.

---

### 3. Shoe Discovery & Browse

**Screen:** Discover tab (`/browse`)

A full-featured shoe catalog with powerful search, filtering, and category browsing.

- **Real-time Search:** Text search with 500ms debounce across shoe name, brand, category, and description fields.
- **Category Chips:** Horizontally scrollable category filters with icons:
  - Athletic, Casual, Formal, Running, Work, Medical
- **Advanced Filters Modal:** A bottom-sheet modal with:
  - **Brand Selection:** Multi-select chip grid for all available brands (Nike, Adidas, New Balance, Jordan, Converse, Vans, Puma, Reebok, ASICS, On Running, Skechers, Brooks, Under Armour, Yeezy)
  - **Color Selection:** Multi-select chips dynamically extracted from the shoe catalog
  - **Price Range:** Min/max numeric text inputs with real-time validation
  - **Active Filter Count Badge:** Displays count of active filter categories on the filter button
  - **Clear All / Apply:** Footer actions to reset or apply filters
- **Results Display:** 2-column grid layout with shoe count indicator
- **Pull-to-Refresh:** RefreshControl for refreshing the shoe catalog
- **Empty States:** Contextual empty state messages with "Clear Filters" action when no results match

---

### 4. Shoe Detail View

**Screen:** Stack route (`/shoe/[id]`)

A rich product detail page with comprehensive shoe information and purchasing options.

- **Hero Image:** Full-width shoe image with transparent header overlay containing back and wishlist buttons.
- **Product Info:** Brand name, shoe name, star rating badge, and review count.
- **Sizing Alerts:** Context-aware warnings based on user's foot measurements:
  - Wide feet + narrow shoe warning
  - Narrow feet + wide shoe warning
  - Runs small/large notifications with sizing recommendations
- **Brand Sizing Tips:** Displays brand-specific sizing advice (e.g., "Converse runs large - size down 0.5 to 1 full size").
- **Personalized Size Card:** Shows user's recommended size prominently if measurements are saved.
- **Available Sizes:** Horizontal scrollable size chips with the user's recommended size highlighted and labeled "Your size."
- **Color Options:** Available colorway chips.
- **Description:** Product description text.
- **Details Grid:** Structured display of materials, width fit, arch support, and category.
- **Reviews Modal:** Tap rating to open a modal displaying user reviews with star ratings, comments, dates, and verified purchase badges. Includes ability to add new reviews with star selection and comment input.
- **Where to Buy Modal:** Links to external retailers:
  - StockX (search by SKU)
  - GOAT (search by name)
  - Flight Club (search by name)
- **Bottom Action Bar:** Fixed bar with "Ask Assistant" shortcut and "Where to Buy" primary action.
- **Wishlist Toggle:** Heart icon to add/remove from wishlist with haptic feedback.

---

### 5. AI Shoe Expert Assistant

**Screen:** AI Expert tab (`/assistant`)

An AI-powered conversational assistant specialized in shoe recommendations and sizing advice.

- **Contextual AI:** The assistant is initialized with:
  - Full shoe catalog knowledge (brand, price, category, fit, arch support, sizing tips)
  - User's foot measurements (if available)
  - User's wishlist contents
  - Brand-specific sizing guidance
- **Chat Interface:** Full conversational UI with:
  - User and assistant message bubbles with role icons (Bot/User)
  - Typing indicator with animated dots while awaiting response
  - Auto-scroll to latest message on new content
- **Quick Prompts:** Horizontally scrollable preset prompts for common questions:
  - "Find running shoes under $150"
  - "Best shoes for wide feet"
  - "Nike vs Adidas sizing?"
  - "Recommend casual shoes"
- **Keyboard Handling:** KeyboardAvoidingView with platform-specific behavior (padding on iOS, height on Android).
- **Error Handling:** Displays error messages inline in the chat if the AI service fails.
- **Input Controls:** Multi-line text input (max 500 chars) with send button that disables during loading.
- **Powered by Rork AI Toolkit:** Uses `@rork-ai/toolkit-sdk` for agent-based conversation management.

---

### 6. Wishlist Management

**Screen:** Saved tab (`/wishlist`)

A comprehensive wishlist system with status tracking, sorting, and filtering.

- **Status Tracking:** Each wishlist item can be marked as:
  - **Saved** (default)
  - **Purchased** (green check)
  - **Didn't Fit** (red X)
- **Filter Tabs:** Horizontally scrollable filter chips: All, Saved, Purchased, Didn't Fit.
- **Sort Options:** Dropdown sort menu with options:
  - Date Added (newest first)
  - Price (low to high)
  - Brand (alphabetical)
- **Horizontal Shoe Cards:** Each wishlist item displays as a horizontal card with image, brand, name, rating, and wishlist heart toggle.
- **Status Action Buttons:** Quick-action buttons below each card to mark as Purchased or Didn't Fit.
- **Ask Assistant Shortcut:** Header button to navigate to the AI assistant for wishlist-related questions.
- **Empty States:** Contextual messages based on current filter with "Browse Shoes" CTA.

---

### 7. User Profile & Settings

**Screen:** Profile tab (`/profile`)

User profile management, measurement history, and app preferences.

- **Profile Display:** Avatar (or placeholder), name, and email with "Edit Profile" button.
- **Edit Profile Modal:** Form fields for name and email with save/cancel actions.
- **My Measurements Section:** Full measurement display card showing recommended size, foot length, width, arch type, and foot type. "Rescan Feet" button for updating measurements.
- **Scan History:** Chronological list of past scans (up to 3 most recent) showing date, recommended size, foot type, and arch type.
- **Appearance Toggle:** Light/Dark theme switcher with current mode label.
- **Preferences Modal:** Comprehensive settings including:
  - **Size System:** US / UK / EU toggle
  - **Preferred Brands:** Multi-select brand tags
  - **Style Preferences:** Multi-select category tags (Athletic, Casual, Formal, Running, Work, Medical)
  - **Budget Range:** Min/Max price inputs

---

### 8. Theme System

The app supports a full dark/light theme system.

- **Dark Theme (Default):** Deep black background (#0A0A0A) with blue primary (#3B82F6) and emerald accent (#10B981).
- **Light Theme:** Slate white background (#F8FAFC) with blue primary (#2563EB) and emerald accent (#059669).
- **Persistent Preference:** Theme choice is saved to AsyncStorage and restored on app launch.
- **iOS Blur Tab Bar:** On iOS, the tab bar uses BlurView for a translucent glass effect that adapts to the current theme.
- **Status Bar:** Automatically adjusts between light/dark styles based on theme.

---

## Cross-Cutting Features

### Haptic Feedback
Every interactive element provides appropriate haptic feedback:
- **Light impact:** Category/filter selection, navigation, quick prompts
- **Medium impact:** Scan capture, wishlist toggle, buy button
- **Success notification:** Scan results saved

### Micro-Animations
- Spring-based press animations on shoe cards and CTA buttons (scale to 0.95-0.97)
- Pulsing icon animation on scan intro and processing screens
- Progress bar animation during scan processing
- Smooth slide transitions between scan steps

### Smart Sizing Intelligence
- Personalized size recommendations based on scanned measurements
- Width fit compatibility alerts (wide feet vs narrow shoes and vice versa)
- Runs small/large warnings with specific sizing adjustment advice
- Brand-specific sizing tips displayed contextually

### Data Persistence
All user data is persisted to AsyncStorage via React Query:
- User profile (name, email)
- Foot measurements and scan history
- Wishlist items and their statuses
- Style/brand/budget preferences
- Size system preference (US/UK/EU)
- Theme preference (dark/light)

### External API Integration
- **Kicks API:** Integration with kicks.dev API for real-time sneaker data, product search, and pricing information
- **Smart Filtering:** Clothing/non-shoe products are automatically filtered out using keyword matching
- **Fallback Data:** Comprehensive fallback shoe catalog ensures the app functions when the API is unavailable
- **Retry Logic:** API availability is tracked with 60-second retry intervals after failures

### Cross-Platform Compatibility
- Runs on iOS, Android, and Web via React Native Web
- Platform-specific tab bar styling (blur on iOS, solid on Android)
- Keyboard behavior adapts per platform
- Safe area insets handled throughout all screens
