# 👟 ShoeFitX

An AI-powered mobile application built using **Expo (React Native)**, **TypeScript**, and **Supabase**. ShoeFitX allows users to scan their feet via device camera, calculate precise dimensions, and receive personalized shoe size recommendations across popular brands.

---

## 🌟 Key Features

- 📸 **Camera-Based Foot Scanning**: Capture clean, high-resolution images of your feet to analyze shape and dimensions.
- 📐 **Precise Sizing Calculations**: Computes foot length and width for highly accurate measurements.
- 🤖 **Personalized Size Recommendations**: Dynamic sizing predictions across major brands based on your measurements.
- 🔒 **Secure User Authentication**: Full user onboarding, email/password signup, login, and secure session state using Supabase Auth.
- 💡 **Brand Sizing Insights**: Brand-specific tips and sizing rules to help users choose when between sizes.
- 🎨 **Premium Modern Design**: Built with a sleek UI theme, fluid haptics, responsive grids, and clean layout patterns.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native) with Expo Router (File-based navigation)
- **Language**: TypeScript
- **Database & Auth**: [Supabase](https://supabase.com/)
- **State Management**: React Context (`AuthContext`)
- **Native APIs**: Expo Camera, Expo Image Picker, Expo Secure Store, Expo Haptics
- **Icons**: Lucide React Native
- **Package Manager**: Bun

---

## 📂 Project Structure

```text
├── expo/
│   ├── app/                    # Screens and Layouts (Expo Router)
│   │   ├── (tabs)/            # Main app tabs
│   │   │   ├── _layout.tsx    # Tab navigation design
│   │   │   ├── index.tsx      # Main Dashboard & Sizing Recommender
│   │   │   ├── assistant.tsx  # Sizing Assistant
│   │   │   └── profile.tsx    # User Profile
│   │   ├── _layout.tsx        # Root Navigation Router
│   │   ├── login.tsx          # Login Page
│   │   ├── signup.tsx         # User Registration
│   │   └── scan.tsx           # Camera Scanning Screen
│   ├── contexts/              # Authentication contexts
│   │   └── AuthContext.tsx    # Global session & state manager
│   ├── services/              # API and database integrations
│   │   └── supabase.ts        # Supabase client config
│   ├── utilities/             # Helper functions
│   │   └── password.ts        # Password strength & validation
│   ├── package.json           # Dependencies and scripts
│   └── bun.lock               # Package lockfile (Bun)
└── rork.json                  # Rork framework config
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS)
- [Bun](https://bun.sh/) (Recommended package manager)
- **Expo Go** application installed on your physical iOS/Android device for testing

### ⚙️ Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:YOUR_GITHUB_USERNAME/YOUR_REPOSITORY.git
   cd rork-shoefitx/expo
   ```

2. **Install Dependencies**:
   ```bash
   bun install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside the `expo` directory with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the Development Server**:
   ```bash
   bun run start
   ```

6. **Test on Device**:
   Scan the terminal's QR code with your phone's camera (iOS) or via Expo Go (Android).

---

## 📦 Builds & Deployment

Rork ShoeFitX is configured for Expo Application Services (EAS).

### Build for iOS/Android

1. Install EAS CLI:
   ```bash
   bun i -g @expo/eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Configure your builds:
   ```bash
   eas build:configure
   ```
4. Build the application for distribution:
   ```bash
   eas build --platform all
   ```

---

## 🔒 License

This project is private and proprietary. All rights reserved.
