# Kinetic — AI-Powered Fitness & Nutrition Tracker

> **A full-stack fitness tracking application** built with React, TypeScript, Tailwind CSS, and Strapi. Track nutrition, log workouts, monitor body metrics, and visualize progress — all in a beautiful, modern interface.

---

## 📸 Project Screenshots

| Login Page | Dashboard | Food Log |
|---|---|---|
| ![Login](asset/Login.png) | ![Dashboard](screenshots/dashboard.png) | ![Food](screenshots/food.png) |

| Activity Log | Profile | Onboarding |
|---|---|---|
| ![Activity](screenshots/activity.png) | ![Profile](screenshots/profile.png) | ![Onboarding](screenshots/onboarding.png) |

---

## 🎯 Project Overview

**Kinetic** is a comprehensive fitness tracking platform designed to help users monitor their daily nutrition, track physical activities, and achieve their fitness goals. Unlike generic fitness apps, Kinetic features a **custom-designed UI** with a unique rose-orange-indigo color theme, interactive data visualizations, and a seamless user experience.

### Key Differentiators
- **Custom Themed Design**: Not a template — hand-crafted UI with gradient accents, glassmorphism cards, and smooth animations
- **Interactive Profile Setup**: Multi-step modal popup after login (inspired by Strava/Nike)
- **Visual Meal Tracking**: Each meal category (breakfast, lunch, dinner, snack) displays with real food photography
- **Smart Activity Detection**: Workout cards automatically show relevant imagery based on activity type
- **Profile Picture Upload**: Users can upload custom avatars stored locally with instant preview
- **Achievement System**: Gamified badges for streaks and milestones

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library with functional components & hooks |
| **TypeScript** | Type-safe development with interfaces |
| **Vite** | Ultra-fast build tool & dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router DOM** | Client-side routing |
| **Lucide React** | Modern, lightweight icon library |
| **Recharts** | Interactive data visualizations |
| **Framer Motion** *(ready)* | Animation library (integrated in design system) |

### Backend
| Technology | Purpose |
|---|---|
| **Strapi CMS** | Headless CMS for content & user management |
| **Node.js** | Server runtime |
| **SQLite/PostgreSQL** | Database (configurable via Strapi) |
| **JWT Auth** | Secure token-based authentication |
| **REST API** | CRUD operations for users, food logs, activity logs |

### DevOps & Tools
| Technology | Purpose |
|---|---|
| **Git & GitHub** | Version control |
| **Vercel** *(deployment ready)* | Frontend hosting |
| **Render/Railway** *(deployment ready)* | Backend hosting |
| **ESLint** | Code quality & linting |

---

## ✨ Features

### 🔐 Authentication & Onboarding
- **Secure Login/Signup** with email & password (JWT-based)
- **Social Login UI** — Google & Apple sign-in buttons (UI ready for OAuth integration)
- **Post-Login Profile Setup Modal** — 3-step wizard (Name/Age → Body Metrics → Fitness Goal) inspired by premium apps like Strava
- **Smart Calorie Calculation** — Auto-computes daily calorie targets based on age, weight, and goal (lose/maintain/gain)

### 📊 Dashboard (Overview)
- **Hero Section** with motivational messages and date display
- **Energy In / Energy Out Cards** — Track calories consumed vs. burned with animated progress bars
- **Macro Split Visualization** — Protein, Carbs, and Fats with colored progress bars
- **Quick Stats** — Active minutes, workout sessions, daily streak counter
- **Goal Card** with full-bleed workout imagery
- **Body Composition Panel** — Weight, Height, BMI with visual scale
- **Weekly Progress Chart** — Recharts bar chart for calorie trends

### 🍽 Food Log (Nutrition)
- **Quick Add** — One-click buttons for common meals (breakfast, lunch, dinner, snack)
- **AI Food Snap** — Photo upload button ready for AI image analysis integration
- **Meal Category Cards** — Each meal type displays with real Unsplash food photography
- **Grouped Entries** — Foods organized by meal type (breakfast, lunch, dinner, snack)
- **Timestamp Display** — Each entry shows when it was logged
- **Hover-to-Delete** — Clean UI with delete button appearing on hover

### 🏋️ Activity Log (Training)
- **Quick Start Grid** — Emoji-based workout cards (Running, Cycling, Swimming, Yoga, Weights)
- **Smart Image Detection** — Automatically assigns relevant workout imagery based on activity name
- **Custom Workout Form** — Log any exercise with duration and calories
- **Session Cards** — Horizontal layout with workout image, icon, duration, and timestamp
- **Daily Summary Stats** — Total minutes, calories burned, session count

### 👤 Profile & Settings
- **Cover Image Header** with gradient overlay
- **Circular Avatar** with gradient ring border
- **Profile Picture Upload** — Click the pencil icon to upload a custom photo (base64 stored in localStorage)
- **Your Details Grid** — Age, Height, Goal, BMI with colored icon cards
- **Daily Targets** — Calorie intake & burn goals with gradient cards
- **Achievements Panel** — Gamified badges (7-Day Streak, Early Bird, Goal Crusher)
- **Dark/Light Mode Toggle** — System-wide theme switching with persistent storage
- **Edit Profile** — Inline form to update all body metrics

### 🎨 UI/UX Highlights
- **Custom Color Palette** — Rose, Orange, Indigo, Cyan gradients (not default Tailwind colors)
- **Glassmorphism Cards** — Backdrop blur with subtle borders
- **Icon-Only Sidebar** — Compact 80px rail with hover tooltips (desktop)
- **Floating Dock Navigation** — Rounded pill bottom nav (mobile)
- **Gradient Buttons** — Every CTA uses custom gradient backgrounds
- **Animated Scrollbar** — Custom styled with hover effects
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop

---

## 📁 Project Structure

```
Fitness_tracker/
├── client/                          # React Frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── profile.jpg              # Default profile photo
│   ├── src/
│   │   ├── assets/
│   │   │   ├── assets.ts            # Static data (meal types, goals, motivational messages)
│   │   │   └── mockApi.ts           # API service layer (Strapi integration)
│   │   ├── components/
│   │   │   ├── ui/                  # Reusable UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── Sidebar.tsx      # Icon rail navigation
│   │   │   │   └── BottomNav.tsx    # Floating dock (mobile)
│   │   │   ├── CaloriesChart.tsx    # Weekly chart component
│   │   │   └── ProfileSetupModal.tsx # Post-login setup wizard
│   │   ├── configs/
│   │   │   └── api.ts               # API URL configuration
│   │   ├── context/
│   │   │   ├── AppContext.tsx       # Global state (user, logs, food, activities)
│   │   │   └── ThemeContext.tsx     # Dark/light mode provider
│   │   ├── pages/
│   │   │   ├── Login.tsx            # Split-screen auth with fitness imagery
│   │   │   ├── Onboarding.tsx       # Original onboarding flow
│   │   │   ├── Layout.tsx           # App shell (sidebar + content + bottom nav)
│   │   │   ├── Dashboard.tsx        # Bento-grid dashboard
│   │   │   ├── FoodLog.tsx          # Nutrition tracking with meal images
│   │   │   ├── ActivityLog.tsx      # Workout logging with activity images
│   │   │   └── Profile.tsx          # User profile with avatar upload
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   ├── App.tsx                  # Root component with routing
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles, Tailwind config, animations
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                          # Strapi Backend
│   ├── config/
│   ├── database/
│   ├── src/
│   │   ├── api/                     # Content types (Users, Food Logs, Activity Logs)
│   │   ├── extensions/
│   │   └── index.ts
│   ├── .env                         # Database & JWT secrets
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/kinetic-fitness.git
cd kinetic-fitness
```

### 2. Start the Backend (Strapi)
```bash
cd server
npm install
npm run develop
```
- Strapi Admin: http://localhost:1337/admin
- API Base: http://localhost:1337/api

### 3. Start the Frontend
```bash
cd client
npm install
npm run dev
```
- App: http://localhost:5173

### 4. Environment Variables

**`client/.env`:**
```env
VITE_API_URL=http://localhost:1337/api
```

**`server/.env`:**
```env
DATABASE_CLIENT=sqlite
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-salt
TRANSFER_TOKEN_SALT=your-transfer-salt
```

---

## 🎤 Interview Talking Points

### 1. Architecture Decisions
> *"I chose Strapi as the backend because it's a production-ready headless CMS that handles authentication, content management, and REST API generation out of the box. This let me focus entirely on the frontend experience."*

### 2. State Management
> *"I used React Context API with custom hooks (useAppContext, useTheme) for global state instead of Redux because the app's state is manageable without adding complexity. This keeps the bundle size smaller."*

### 3. Design System
> *"I built a complete custom design system from scratch using Tailwind CSS — not a single UI library like Material UI. Every card, button, and gradient was hand-crafted to create a unique brand identity. The rose-orange-indigo palette was chosen to evoke energy and warmth."*

### 4. Responsive Strategy
> *"The app uses a hybrid navigation pattern: an 80px icon rail on desktop for maximum screen real estate, and a floating dock on mobile for thumb-friendly access. This is the same pattern used by premium apps like Instagram and Spotify."*

### 5. Performance Optimizations
> *"Images are loaded lazily from Unsplash CDN with optimized sizes. The app uses Vite for instant HMR and optimized production builds. LocalStorage is used for profile pictures to avoid backend storage costs during prototyping."*

### 6. User Experience
> *"I added a post-login profile setup modal inspired by Strava — this ensures users complete their profile before using the app, which increases retention. The 3-step wizard auto-calculates calorie targets, removing friction."*

### 7. Type Safety
> *"The entire frontend is written in TypeScript with strict interfaces for all data models (User, FoodEntry, ActivityEntry). This catches bugs at compile time and makes the codebase maintainable."*

### 8. Future Roadmap
> *"Next, I plan to integrate the OpenAI API for the 'AI Food Snap' feature — users will be able to photograph their meal and get automatic calorie estimation. I also plan to add workout streaks with push notifications."*

---

## 🔮 Future Enhancements

- [ ] **AI Food Recognition** — Integrate OpenAI Vision API for photo-based calorie estimation
- [ ] **Push Notifications** — Reminders for logging meals and workouts
- [ ] **Social Features** — Follow friends, share achievements, leaderboards
- [ ] **Export Data** — PDF/CSV reports of weekly/monthly progress
- [ ] **PWA Support** — Offline mode and "Add to Home Screen" functionality
- [ ] **Wearable Integration** — Sync with Apple Health / Google Fit
- [ ] **Water Tracker** — Daily hydration logging
- [ ] **Sleep Tracker** — Monitor rest and recovery

---

## 👨‍💻 Author

**Rupsha Das** *(or your name)*

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

> **Built with ❤️, sweat, and lots of ☕**
