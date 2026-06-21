# 💪 As FitnessZone — Premium Gym Website & Management System

A full-stack gym management system for **As FitnessZone**, a unisex gym in Bolpur, West Bengal. Built with Next.js 16 (App Router), MongoDB, Cloudinary, and shadcn/ui. Features a premium dark theme with red-orange gradients, role-based dashboards (admin, trainer, gym member), an activity audit log covering every API request, and a complete CRM for leads, memberships, and trainer assignments.

> **Live demo:** [https://asfitnesszone.vercel.app](https://asfitnesszone.vercel.app)
>
> **Stack:** Next.js 16 · React 19 · TypeScript · MongoDB (Mongoose) · Tailwind CSS v4 · shadcn/ui · framer-motion · Cloudinary · JWT (jose)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Architecture](#-architecture)
5. [Prerequisites](#-prerequisites)
6. [Installation](#-installation)
7. [Environment Variables](#-environment-variables)
8. [Database Setup & Seeding](#-database-setup--seeding)
9. [Running the Application](#-running-the-application)
10. [Project Structure](#-project-structure)
11. [User Roles & Permissions](#-user-roles--permissions)
12. [Authentication Flow](#-authentication-flow)
13. [API Endpoints](#-api-endpoints)
14. [Database Models](#-database-models)
15. [Design System](#-design-system)
16. [Component Library](#-component-library)
17. [Deployment](#-deployment)
18. [Troubleshooting](#-troubleshooting)
19. [Contributing](#-contributing)

---

## 🏋️ Project Overview

As FitnessZone is a gym management platform that serves **three distinct user types**:

| Role | Dashboard | Capabilities |
|------|-----------|-------------|
| **Admin** | `/admin/dashboard` | Full system control — manage users, trainers, programs, memberships, gallery, coupons, leads, attendance, activity logs, and trainer assignments |
| **Trainer** | `/trainer/dashboard` | View assigned customers, track active/expiring memberships, see revenue, manage training schedules |
| **Gym Member** | `/user/dashboard` | Manage profile, log workouts, track measurements, log water intake, check in to the gym, view assigned trainer |

Every API request across all roles is automatically logged via the **Activity Log** system — capturing who did what, when, from which device, response time, and success/failure status.

---

## ✨ Features

### 🌐 Public Website

| Page | Route | Highlights |
|------|-------|-----------|
| **Home** | `/` | Full-screen hero with background carousel, feature cards, animated stats counter, testimonial marquee, CTA with floating orbs |
| **About** | `/about` | Mission/Vision cards with Reveal animations, training philosophy, infrastructure showcase |
| **Programs** | `/programs` | Dynamic program cards from DB, difficulty badges, feature lists, CTA |
| **Trainers** | `/trainers` | Trainer profiles with certifications, specializations, pricing tables |
| **Membership** | `/membership` | Pricing comparison (Monthly/Quarterly/Yearly), coupon validation, FAQ accordion |
| **Gallery** | `/gallery` | Filterable image/video grid (All/Equipment/Training/Facility) |
| **Contact** | `/contact` | Contact form (→ leads), info cards, Google Maps embed |
| **Login** | `/login` | JWT-based authentication, role-based redirects, animated form |
| **Signup** | `/signup` | Account creation with validation, gradient-themed UI |

**Design touches applied to every page:**
- Floating gradient orbs (`DecorativeOrbs` component)
- Subtle grid pattern overlays (`GridPattern` component)
- Scroll-triggered reveal animations (`Reveal` component using framer-motion)
- Gradient (red → orange) accent on headings and interactive elements
- Spring hover effects, glass-morphism cards, and micro-interactions

### 🔐 Authentication & Authorization

- JWT-based auth with **access tokens** (30 min) and **refresh tokens** (7 days)
- httpOnly cookies prevent XSS
- Middleware protects routes by `userType`
- Token refresh on request if access token is expired
- Password hashing with **bcryptjs** (salt rounds: 10)
- Three roles: `admin`, `trainer`, `gymMember` — stored as a master `Role` collection with ObjectId references

### 👤 User Dashboard (`/user/dashboard`)

- Welcome greeting with member name
- Stats cards: **Workouts Logged**, **Measurements Taken**, **Current Streak**, **Days Active**
- Quick action buttons: Log Workout, Take Measurements, Log Water, My Trainer
- Recent activity feed showing latest workouts, measurements, and check-ins

### 👨‍🏫 Trainer Dashboard (`/trainer/dashboard`)

- Welcome header with trainer name, bio, and specializations
- Stats cards: **Active Customers**, **Expiring Soon** (≤7 days), **Total Customers**, **Active Revenue** (₹)
- Customers table: name, contact, fee plan, amount, start/end date, status badges
- Expiring membership highlighted with orange badge
- Trainer pricing info card
- Quick links: Edit Profile, Programs, Contact Support

### 🛠️ Admin Panel (`/admin/*`)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/admin/dashboard` | Stats overview (users, leads, programs, trainers) |
| Users | `/admin/users` | Manage all users — view, search, see user types |
| Leads | `/admin/leads` | Track contact form submissions, update status (new/contacted/converted/closed) |
| Programs | `/admin/programs` | CRUD for fitness programs |
| Trainers | `/admin/trainers` | Manage trainer profiles and pricing |
| Trainer Assignments | `/admin/trainer-assignments` | Assign trainers to gym members with fee tracking |
| Gallery | `/admin/gallery` | Upload/manage images and videos via Cloudinary |
| Attendance | `/admin/attendance` | View member check-in history |
| Coupons | `/admin/coupons` | Create/manage discount coupon codes |
| Activity Logs | `/admin/activity-logs` | **Full audit trail** — filterable by action, method, status, user type, date range |

Each admin page has a sidebar navigation with active-state highlighting and consistent layout.

### 📊 Activity Log System

Every API request across the entire application is automatically logged:

| Field | Description |
|-------|-------------|
| `userId` / `userType` | Who made the request (admin/trainer/gymMember/anonymous) |
| `action` | Semantic action name (e.g., `view_users`, `create_program`, `login_failed`) |
| `method` | HTTP method (GET/POST/PUT/DELETE/PATCH) |
| `endpoint` | API path |
| `statusCode` / `success` | Whether the request succeeded |
| `responseTime` | Duration in milliseconds |
| `ip` | Client IP (from `x-forwarded-for`) |
| `userAgent` | Device/browser info |
| `details` | Error messages on failure |

All 35+ API routes use the `withActivityLog(action, handler)` wrapper.

### 💪 Fitness Tracking

- **Workout Logging** — Log exercises with sets, reps, weight, duration, and notes
- **Body Measurements** — Track weight, chest, waist, arms, thighs, hips, body fat
- **Water Intake** — Log daily water consumption (glasses)
- **Gym Check-ins** — Daily attendance tracking with streak calculation

### 🏷️ Coupon System

- Percentage or fixed discount coupons
- Configurable: min purchase, max usage, expiry date
- Real-time validation on the membership page
- Active/inactive toggle

### 🖼️ Media Management (Cloudinary)

- Upload images and videos via Cloudinary's signed upload
- Automatic folder organization
- Delete from Cloudinary when removed from the gallery
- Gallery categories: equipment, training, facility

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + `tw-animate-css` |
| **Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| **Animations** | [framer-motion](https://www.framer.com/motion/) 12 |
| **Icons** | [lucide-react](https://lucide.dev/) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/) |
| **Auth** | JWT with [jose](https://github.com/panva/jose) (ES256K/HS256) |
| **Password Hashing** | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **Media** | [Cloudinary](https://cloudinary.com/) (signed uploads + delivery) |
| **Forms** | [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Toasts** | [sonner](https://sonner.emilkowal.ski/) |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) |
| **Email** | [Resend](https://resend.com/) (configured) |
| **Validation** | [Zod 4](https://zod.dev/) |
| **Schema Markup** | JSON-LD (Gym + LocalBusiness schema) |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                     │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Public Pages  │  │ Auth Pages   │  │ Dashboard Pages│  │
│  │  (public)/    │  │ login/       │  │ admin/         │  │
│  │               │  │ signup/      │  │ user/          │  │
│  │               │  │              │  │ trainer/       │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                 │                  │            │
│  ┌──────┴─────────────────┴──────────────────┴────────┐   │
│  │              API Routes (app/api/)                  │   │
│  │  auth/  admin/  user/  trainer/  leads/  upload/   │   │
│  └─────────────────────┬──────────────────────────────┘   │
│                        │                                  │
│  ┌─────────────────────┴──────────────────────────────┐   │
│  │              withActivityLog wrapper                │   │
│  │         (auto-logs every request)                   │   │
│  └─────────────────────┬──────────────────────────────┘   │
└────────────────────────┼──────────────────────────────────┘
                         │
┌────────────────────────┼──────────────────────────────────┐
│              ┌─────────┴─────────┐                        │
│              │    middleware.ts   │                        │
│              │  Route protection │                        │
│              │  by userType      │                        │
│              └───────────────────┘                        │
└───────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     Services Layer                       │
│  ┌────────────┐  ┌──────────┐  ┌────────────────────┐   │
│  │  MongoDB   │  │ JWT Auth │  │    Cloudinary      │   │
│  │  (Mongoose)│  │  (jose)  │  │  (media storage)   │   │
│  └────────────┘  └──────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **pnpm** or **yarn**
- **MongoDB** — local install or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier
- **Cloudinary account** — [sign up free](https://cloudinary.com/)
- **Git** (optional, for version control)

---

## ⚙️ Installation

### 1. Clone & Install

```bash
git clone <repository-url>
cd AsFitnessZone
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the project root:

```env
# ─── MongoDB ─────────────────────────────────────────────
MONGODB_URI=mongodb://localhost:27017/fitnessgym
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/fitnessgym?retryWrites=true&w=majority

# ─── JWT Secrets ─────────────────────────────────────────
JWT_SECRET=<generate-a-secure-random-string-at-least-32-chars>
JWT_REFRESH_SECRET=<another-secure-random-string-or-same-as-above>

# ─── Cloudinary ──────────────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=fitnessgym_unsigned

# ─── App ─────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=admin@asfitnesszone.com
ADMIN_PASSWORD=Admin@123
ADMIN_NAME=Admin
```

> ⚠️ **Generate JWT secrets:** Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` in your terminal.

### 3. Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. From Dashboard, copy **Cloud Name**, **API Key**, **API Secret**
3. Create an **upload preset**:
   - Go to **Settings → Upload**
   - Scroll to **Upload presets**
   - Click **Add upload preset**
   - Set **Signing mode** to `Unsigned`
   - Set **Folder** to `fitnessgym`
   - Save and copy the preset name

### 4. MongoDB Setup

**Option A — Local MongoDB:**
```bash
# Install MongoDB Community Edition for your OS
# Start the service
mongod
# Connection string: mongodb://localhost:27017/fitnessgym
```

**Option B — MongoDB Atlas (recommended for production):**
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write permissions
3. Whitelist your IP (or `0.0.0.0/0` for development)
4. Click **Connect → Connect your application** and copy the connection string

---

## 🗄️ Database Setup & Seeding

### Run the Seed Script

The seed script creates:
- **3 default roles**: `admin`, `trainer`, `gymmember`
- **1 admin user**: email + password from `.env.local` (defaults: `admin@asfitnesszone.com` / `Admin@123`)
- **1 customer profile** linked to the admin user

```bash
npm run seed
```

Expected output:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB
📋 Role "admin" created
📋 Role "trainer" created
📋 Role "gymmember" created
✅ Admin created successfully!
   Email:    admin@asfitnesszone.com
   Password: Admin@123
   UserType: admin
   Name:     Admin
✨ Seed complete.
```

> The script is idempotent — running it again will detect existing roles and admin, and skip creation.

### Manual Data Entry

After seeding, use the admin panel at `/admin/*` to add:
- **Programs** — fitness programs with descriptions, difficulties, features
- **Trainers** — trainer profiles with certifications, specializations, pricing
- **Memberships** — membership plans (already seeded as static data in the Price component)
- **Gallery** — upload images and videos via Cloudinary
- **Coupons** — discount codes with validation rules
- **Trainer Assignments** — assign trainers to gym members

---

## 🚀 Running the Application

```bash
# Development (with hot-reload)
npm run dev
# → http://localhost:3000

# Production build
npm run build
npm start

# TypeScript type-check
npx tsc --noEmit
```

---

## 📁 Project Structure

```
AsFitnessZone/
├── app/                              # Next.js App Router
│   ├── (public)/                     # Public-facing website
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── login/page.tsx
│   │   ├── membership/page.tsx
│   │   ├── programs/page.tsx
│   │   ├── trainers/page.tsx
│   │   ├── page.tsx                  # Homepage
│   │   └── layout.tsx                # Public layout (navbar + footer)
│   ├── admin/                        # Admin panel pages
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   ├── leads/page.tsx
│   │   ├── programs/page.tsx
│   │   ├── trainers/page.tsx
│   │   ├── trainer-assignments/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── attendance/page.tsx
│   │   ├── coupons/page.tsx
│   │   └── activity-logs/page.tsx
│   ├── user/                         # User dashboard pages
│   │   ├── dashboard/page.tsx
│   │   └── profile/page.tsx
│   ├── trainer/                      # Trainer dashboard
│   │   └── dashboard/page.tsx
│   ├── signup/page.tsx
│   ├── api/                          # API route handlers
│   │   ├── auth/                     # Authentication
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── signup/route.ts
│   │   │   ├── me/route.ts
│   │   │   ├── refresh/route.ts
│   │   │   ├── forgot-password/route.ts
│   │   │   └── reset-password/route.ts
│   │   ├── admin/                    # Admin CRUD
│   │   │   ├── stats/route.ts
│   │   │   ├── users/route.ts
│   │   │   ├── leads/route.ts & [id]/route.ts
│   │   │   ├── programs/route.ts & [id]/route.ts
│   │   │   ├── trainers/route.ts & [id]/route.ts
│   │   │   ├── trainer-assignments/route.ts & [id]/route.ts
│   │   │   ├── gallery/route.ts & [id]/route.ts
│   │   │   ├── coupons/route.ts & [id]/route.ts
│   │   │   ├── checkins/route.ts
│   │   │   ├── attendance/route.ts
│   │   │   └── activity-logs/route.ts
│   │   ├── user/                     # User endpoints
│   │   │   ├── profile/route.ts
│   │   │   ├── workout/route.ts
│   │   │   ├── measurements/route.ts
│   │   │   ├── water/route.ts
│   │   │   ├── checkin/route.ts
│   │   │   └── trainer-assignments/route.ts
│   │   ├── trainer/assignments/route.ts
│   │   ├── leads/route.ts
│   │   ├── programs/route.ts
│   │   ├── trainers/route.ts
│   │   ├── coupons/validate/route.ts
│   │   └── upload/route.ts
│   ├── layout.tsx                    # Root layout (metadata, theme, toasts)
│   ├── globals.css                   # Global styles + theme variables
│   ├── robots.ts                     # SEO robots.txt
│   └── sitemap.ts                    # SEO sitemap.xml
│
├── components/                       # React components
│   ├── ui/                           # shadcn/ui primitives
│   │   ├── button.tsx, card.tsx, input.tsx, ...
│   │   ├── Reveal.tsx                # Scroll-triggered animation wrapper
│   │   ├── DecorativeOrbs.tsx        # Floating gradient orbs
│   │   ├── GridPattern.tsx           # SVG grid texture overlay
│   │   ├── BackToTop.tsx             # Floating scroll-to-top button
│   │   └── SectionDivider.tsx        # Decorative section separator
│   ├── public/                       # Shared public components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/                         # Homepage sections
│   │   ├── Hero.tsx, Why.tsx, Stats.tsx
│   │   ├── Testimonials.tsx, CTA.tsx
│   ├── contact/                      # Contact page components
│   │   ├── hero.tsx, contactForm.tsx
│   │   ├── info.tsx, Map.tsx
│   ├── membership/                   # Membership page components
│   │   ├── Price.tsx, FAQ.tsx
│   └── LogoLoop.tsx                  # Infinite scroll marquee
│
├── lib/                              # Server-side logic
│   ├── auth/auth.ts                  # JWT, password, cookies
│   ├── db/
│   │   ├── db.ts                     # MongoDB connection (cached singleton)
│   │   └── models/                   # Mongoose schemas
│   │       ├── user.model.ts
│   │       ├── role.model.ts
│   │       ├── lead.model.ts
│   │       ├── program.model.ts
│   │       ├── trainer.model.ts
│   │       ├── membership.model.ts
│   │       ├── media.model.ts
│   │       ├── activityLog.model.ts
│   │       ├── coupon.model.ts
│   │       ├── checkin.model.ts
│   │       ├── workout.model.ts
│   │       ├── measurement.model.ts
│   │       ├── waterLog.model.ts
│   │       └── trainerAssignment.model.ts
│   ├── cloudinary/cloudinary.ts      # Cloudinary SDK + helpers
│   ├── activityLogger.ts             # withActivityLog HOF + logActivity
│   ├── types.ts                      # Shared TypeScript interfaces
│   └── utils.ts                      # cn() helper (clsx + tailwind-merge)
│
├── scripts/seed.ts                   # Database seeder
├── middleware.ts                      # Route protection by userType
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json                   # shadcn/ui configuration
└── .env.local                        # Environment variables (not tracked)
```

---

## 👥 User Roles & Permissions

### Role Hierarchy

```
                  ┌─────────┐
                  │  Admin  │  ← Full system access
                  └────┬────┘
                       │
              ┌────────┴────────┐
              │                 │
          ┌───┴───┐       ┌────┴────┐
          │Trainer│       │GymMember│
          └───────┘       └─────────┘
```

### Route Protection (middleware.ts)

| Path Pattern | Required `userType` |
|-------------|-------------------|
| `/admin/*` | `admin` |
| `/trainer/*` | `trainer` |
| `/user/*` | `gymMember` |
| `/api/admin/*` | `admin` |
| `/api/trainer/*` | `trainer` |
| `/api/user/*` | `gymMember` |
| `/api/auth/*` | Public (no auth required) |
| `/(public)/*` | Public |

### Permission Matrix

| Capability | Admin | Trainer | Member |
|-----------|-------|---------|--------|
| View public pages | ✅ | ✅ | ✅ |
| Manage own profile | ✅ | ✅ | ✅ |
| View own dashboard | ✅ | ✅ | ✅ |
| Log workouts | ❌ | ❌ | ✅ |
| Track measurements | ❌ | ❌ | ✅ |
| Log water intake | ❌ | ❌ | ✅ |
| Gym check-ins | ❌ | ❌ | ✅ |
| View assigned customers | ❌ | ✅ | ❌ |
| View own trainer | ❌ | ❌ | ✅ |
| Manage users | ✅ | ❌ | ❌ |
| Manage trainers | ✅ | ❌ | ❌ |
| Manage programs | ✅ | ❌ | ❌ |
| Manage memberships | ✅ | ❌ | ❌ |
| Manage gallery/media | ✅ | ❌ | ❌ |
| Manage coupons | ✅ | ❌ | ❌ |
| View activity logs | ✅ | ❌ | ❌ |
| Manage leads/CRM | ✅ | ❌ | ❌ |
| Trainer assignments | ✅ | ❌ | ❌ |
| View attendance | ✅ | ❌ | ❌ |

---

## 🔐 Authentication Flow

```
SIGNUP                               LOGIN
──────                               ─────
1. POST /api/auth/signup             1. POST /api/auth/login
   { name, email, password }            { email, password }
2. Validate with Zod                 2. Find user by email
3. Check for duplicate email         3. Compare password (bcrypt)
4. Hash password (bcrypt, 10 rounds) 4. Generate JWT access + refresh tokens
5. Create User (auth record)         5. Set httpOnly cookies
6. Create Customer (profile record)  6. Return user with userType
7. Return success                    7. Client redirects based on userType:
                                       • admin    → /admin/dashboard
                                       • trainer  → /trainer/dashboard
                                       • gymMember → /user/dashboard

TOKEN REFRESH                        LOGOUT
─────────────                        ──────
1. Middleware or API checks cookie   1. POST /api/auth/logout
2. If accessToken expired:           2. Clear auth cookies
3. Verify refreshToken               3. Return success
4. Generate new access + refresh
5. Set new cookies on response

MIDDLEWARE FLOW
────────────────
Request → Check path pattern
  ├─ Public path? → Allow
  ├─ Protected path?
  │   ├─ Has valid accessToken? → Allow
  │   ├─ Has valid refreshToken? → Refresh tokens → Allow
  │   └─ No valid token? → Redirect to /login
  └─ Check userType matches route requirements
      ├─ Matches? → Allow
      └─ Doesn't match? → Redirect to /login
```

---

## 📡 API Endpoints

### 🔑 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Create new member account | No |
| POST | `/api/auth/login` | Login with email + password | No |
| POST | `/api/auth/logout` | Clear auth cookies | No |
| GET | `/api/auth/me` | Get current user + profile | Yes |
| GET | `/api/auth/refresh` | Refresh access token | Refresh |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |

### 👤 User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get own profile + customer data |
| PUT | `/api/user/profile` | Update profile (name, phone, age, weight, height, etc.) |
| POST | `/api/user/workout` | Log a workout session |
| GET | `/api/user/workout` | Get workout history |
| POST | `/api/user/measurements` | Log body measurements |
| GET | `/api/user/measurements` | Get measurement history |
| POST | `/api/user/water` | Log water intake |
| GET | `/api/user/water` | Get water log history |
| POST | `/api/user/checkin` | Check in to the gym |
| GET | `/api/user/trainer-assignments` | Get assigned trainer(s) |

### 👨‍🏫 Trainer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trainer/assignments` | Get assigned customers with stats |

### 🛠️ Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| GET/POST | `/api/admin/programs` | List / Create programs |
| GET/PUT/DELETE | `/api/admin/programs/[id]` | CRUD single program |
| GET/POST | `/api/admin/trainers` | List / Create trainers |
| GET/PUT/DELETE | `/api/admin/trainers/[id]` | CRUD single trainer |
| GET | `/api/admin/leads` | List all leads |
| PATCH | `/api/admin/leads/[id]` | Update lead status |
| GET/POST | `/api/admin/gallery` | List / Upload media |
| DELETE | `/api/admin/gallery/[id]` | Delete media from Cloudinary + DB |
| GET/POST | `/api/admin/coupons` | List / Create coupons |
| PUT/DELETE | `/api/admin/coupons/[id]` | Update / Delete coupon |
| GET/POST | `/api/admin/checkins` | View check-in records |
| GET | `/api/admin/trainer-assignments` | List all assignments |
| GET/POST | `/api/admin/attendance` | View attendance records |
| GET | `/api/admin/activity-logs` | Paginated, filterable audit logs |

### 🌐 Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/leads` | Submit contact form (creates lead) |
| GET | `/api/programs` | List active programs |
| GET | `/api/trainers` | List active trainers |
| POST | `/api/coupons/validate` | Validate coupon code |
| POST | `/api/upload` | Get Cloudinary upload signature |

---

## 🗃️ Database Models

### User (`user.model.ts`)
| Field | Type | Description |
|-------|------|-------------|
| `email` | String (unique, lowercase) | Login email |
| `password` | String (hashed) | bcrypt hash |
| `userType` | Enum: `gymMember`, `admin`, `trainer` | Role classification |
| `role` | ObjectId → Role | Reference to master role |

### Role (`role.model.ts`)
| Field | Type | Description |
|-------|------|-------------|
| `name` | String (unique, lowercase) | Role identifier |
| `description` | String | Human-readable description |

### Customer (embedded via `user.model.ts` relationship)
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId → User (unique) | Link to auth record |
| `name` | String | Full name |
| `phone`, `age`, `address` | Mixed | Contact info |
| `weight`, `height` | Number | Fitness metrics |
| `fitnessGoal` | String | Goal description |
| `profileImage` | String | Cloudinary URL |

### Trainer (`trainer.model.ts`)
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId → User (optional) | Link to auth record |
| `name` | String | Trainer name |
| `bio`, `experience` | String | Professional info |
| `certifications` | String[] | Certificates |
| `specializations` | String[] | Areas of expertise |
| `pricing` | Embedded: monthly, quarterly, sixMonths, annual | Fee structure |
| `isActive` | Boolean | Visibility toggle |

### Program (`program.model.ts`)
| Field | Type | Description |
|-------|------|-------------|
| `title`, `description` | String | Program info |
| `image` | String | Cloudinary URL |
| `features` | String[] | Feature list |
| `duration` | String | Duration description |
| `difficulty` | Enum: beginner, intermediate, advanced | Level |
| `isActive` | Boolean | Visibility toggle |

### Lead (`lead.model.ts`)
| Field | Type | Description |
|-------|------|-------------|
| `name`, `email`, `phone` | String | Contact info |
| `message` | String | User's message |
| `status` | Enum: new, contacted, converted, closed | Sales pipeline |

### Membership (`membership.model.ts`)
| Field | Type | Description |
|-------|------|-------------|
| `name`, `duration` | String | Plan name + period |
| `price` | Number | Price in ₹ |
| `features` | String[] | Included features |
| `isPopular` | Boolean | Highlight flag |
| `isActive` | Boolean | Visibility toggle |

### TrainerAssignment (`trainerAssignment.model.ts`)
| Field | Type | Description |
|-------|------|-------------|
| `customerId` | ObjectId → Customer | Assigned member |
| `trainerId` | ObjectId → Trainer | Assigned trainer |
| `feeType` | Enum: monthly, quarterly, sixMonths, annual | Billing cycle |
| `amount` | Number | Fee amount |
| `startDate`, `endDate` | Date | Assignment period |
| `status` | Enum: active, expired, cancelled | Current state |

### Media (`media.model.ts`)
| Field | Type | Description |
|-------|------|-------------|
| `type` | Enum: image, video | Media type |
| `url` | String | Cloudinary URL |
| `publicId` | String | Cloudinary public ID |
| `category` | String | Grouping (equipment, training, facility) |
| `uploadedBy` | ObjectId → User | Uploader |

### ActivityLog (`activityLog.model.ts`)
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId → User (indexed) | Who did it |
| `userType` | Enum: admin, trainer, gymMember, anonymous | User category |
| `action` | String (indexed) | Semantic action name |
| `method` | Enum: GET/POST/PUT/DELETE/PATCH | HTTP method |
| `endpoint` | String (indexed) | API path |
| `statusCode` | Number | HTTP status |
| `responseTime` | Number | Duration in ms |
| `success` | Boolean (indexed) | Whether it succeeded |
| `ip` | String | Client IP |
| `userAgent` | String | Browser/device |
| `details` | String | Error details |

### Workout, Measurement, WaterLog, CheckIn, Coupon
Additional models for fitness tracking features — see `lib/db/models/` for full schemas.

---

## 🎨 Design System

### Theme Colors

The site uses a **dark-first** theme with CSS custom properties:

```
--background: #0d0d0d     (deep black)
--card:       #1a1a1a      (charcoal)
--primary:    #e63946      (red accent)
--border:     #333333      (subtle borders)
--foreground: #fafafa      (off-white text)
```

Gradient accents: `from-red-500 to-orange-500` used on headings, buttons, badges, and icons.

### Typography

- **Font:** Inter (via Next.js `next/font`)
- **Headings:** Bold, with gradient text for emphasized words
- **Body:** 14–16px, with `text-muted-foreground` (#a6a6a6) for secondary text

### Animation Patterns

| Pattern | Implementation |
|---------|---------------|
| Scroll reveal | `<Reveal direction="up" delay={0.2}>` — uses framer-motion `whileInView` |
| Hover lift | `whileHover={{ y: -5 }}` with spring transition |
| Hover scale | `whileHover={{ scale: 1.05 }}` |
| Icon rotate | 360° rotation on hover for decorative icons |
| Floating orbs | Infinite `y` oscillation with blur-3xl |
| Staggered entries | `delay={index * 0.1}` on lists/grids |
| Page entry | `initial → animate` with spring easing |

### Spacing

- Section padding: `py-20` (80px) to `py-28` (112px)
- Container max-width: `max-w-6xl` (72rem) or `max-w-4xl` (56rem)
- Card gap: `gap-6` (24px) in grids
- Component spacing: `space-y-4` to `space-y-8`

---

## 📦 Component Library

### shadcn/ui Components

All from the **New York** style with the **neutral** base color:

| Component | Usage |
|-----------|-------|
| `Button` | Variants: default, outline, ghost, destructive, custom |
| `Card` | Content containers with header, body, footer |
| `Input` / `Textarea` / `Label` | Form controls |
| `Badge` | Status, difficulty, certification tags |
| `Tabs` | Gallery category filtering |
| `Accordion` | FAQ section |
| `Avatar` | User profile images |
| `Select` | Dropdown menus (admin forms) |
| `Table` | Data grids (users, leads, activity logs) |
| `Sheet` | Slide-out panels (mobile menus) |
| `Dialog` | Modal dialogs |
| `Alert` | Notification banners |
| `sonner` | Toast notifications |

### Custom UI Components

| Component | File | Description |
|-----------|------|-------------|
| `Reveal` | `components/ui/Reveal.tsx` | Scroll-triggered animation wrapper (up/down/left/right) |
| `DecorativeOrbs` | `components/ui/DecorativeOrbs.tsx` | Floating gradient blur orbs (1–4 count) |
| `GridPattern` | `components/ui/GridPattern.tsx` | SVG dot-grid texture overlay |
| `BackToTop` | `components/ui/BackToTop.tsx` | Animated floating scroll-to-top button |
| `SectionDivider` | `components/ui/SectionDivider.tsx` | Decorative section separator |
| `LogoLoop` | `components/LogoLoop.tsx` | Infinite horizontal scroll marquee |

### Page-Specific Components

| Component | File | Part Of |
|-----------|------|---------|
| `Hero` | `components/home/Hero.tsx` | Homepage |
| `Why` | `components/home/Why.tsx` | Homepage |
| `Stats` | `components/home/Stats.tsx` | Homepage (animated counters) |
| `Testimonials` | `components/home/Testimonials.tsx` | Homepage |
| `CTA` | `components/home/CTA.tsx` | Homepage |
| `Price` | `components/membership/Price.tsx` | Membership page |
| `FAQ` | `components/membership/FAQ.tsx` | Membership page |
| `Navbar` | `components/public/Navbar.tsx` | All public pages |
| `Footer` | `components/public/Footer.tsx` | All public pages |

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Configure environment variables (all from `.env.local`)
4. Set **Framework Preset** to `Next.js`
5. Deploy!
6. Add your custom domain in Vercel Dashboard → Domains

### Deploy to Other Platforms

**Docker** (not included — you can add a `Dockerfile`):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Key considerations:**
- MongoDB must be accessible from your deployment (use Atlas)
- Cloudinary must be configured
- Set `NODE_ENV=production` in production

### SEO

The project includes:
- `app/robots.ts` — Disallows `/admin`, `/admin/*`, `/api/*`
- `app/sitemap.ts` — Auto-generates sitemap.xml
- `app/layout.tsx` — Open Graph + Twitter card metadata
- JSON-LD schema markup (Gym + LocalBusiness + ContactPage)
- Per-page metadata (for server components)

---

## 🔧 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| `MONGODB_URI not defined` | Create `.env.local` with your MongoDB connection string |
| `JWT_SECRET not defined` | Add `JWT_SECRET` to `.env.local` (32+ char random string) |
| `Cloudinary upload fails` | Check cloud name, API key, secret, and upload preset name |
| `Login returns 401` | Make sure you've seeded the admin account (`npm run seed`) |
| `TypeScript errors` | Run `npx tsc --noEmit` to check; ensure all imports are correct |
| `Build fails on Vercel` | Check that all env vars are set in Vercel Dashboard |
| `Seed script can't find .env` | The script looks for `.env.local` in the project root |
| `Middleware not working` | Make sure `middleware.ts` is in the project root (not `app/`) |
| `Images not loading` | Check Cloudinary configuration and upload preset |
| `Refresh token loop` | Ensure both `JWT_SECRET` and `JWT_REFRESH_SECRET` are set |

### Need Help?

Open an issue in the repository or contact the development team.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- **TypeScript**: Strict mode enabled. Use proper types — avoid `any`.
- **Components**: Keep them focused and reusable. Use the `cn()` utility for conditional classes.
- **API Routes**: Use the `withActivityLog` wrapper for automatic request logging.
- **Styling**: Use Tailwind CSS utility classes. Avoid inline styles for layout.
- **Animations**: Use framer-motion for client animations; animate on scroll with the `Reveal` wrapper.
- **Database**: Always use the cached `connectDB()` singleton. Models use the `models.X || model()` pattern to avoid Next.js hot-reload issues.

---

## 📄 License

This project is proprietary — built for **As FitnessZone**, Bolpur, West Bengal.

---

**Built with ❤️ using Next.js, MongoDB, Cloudinary, and shadcn/ui.**
