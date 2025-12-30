# FitnessGym - Premium Gym Website & Management System

A modern, full-stack gym website and management system built with Next.js 14, MongoDB, and Cloudinary. Features a premium dark theme, user profile management, and comprehensive admin dashboard.

## 🚀 Features

### Public Website
- **Premium Design**: Dark theme with red accents, smooth animations, and modern UI
- **Responsive**: Mobile-first design that works on all devices
- **SEO Optimized**: Metadata, Open Graph tags, and semantic HTML
- **Pages**:
  - Home (Hero, Features, Testimonials, CTAs)
  - About Us (Mission, Vision, Philosophy, Infrastructure)
  - Programs (Weight Training, Cardio, Personal Training, etc.)
  - Trainers (Detailed profiles with certifications)
  - Gallery (Image/Video gallery with category filtering)
  - Membership Plans (Pricing comparison)
  - Contact (Form with Google Maps integration)

### User System
- **Authentication**: Secure JWT-based login/signup
- **User Dashboard**: Stats overview and quick actions
- **Profile Management**:
  - Personal info (name, email, phone, age, address)
  - Fitness details (weight, height, fitness goal)
  - Profile image upload via Cloudinary
  - All fields editable by user

### Admin Panel
- **Dashboard**: Overview with statistics
- **User Management**: View and manage all gym members
- **Leads Management**: Track contact form submissions with status updates
- **Role-Based Access**: Secure admin-only routes
- **Sidebar Navigation**: Easy access to all admin features

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with httpOnly cookies
- **Media**: Cloudinary for image/video uploads
- **UI**: shadcn/ui, Tailwind CSS
- **Icons**: lucide-react
- **Forms**: React Hook Form, Zod validation

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Cloudinary account

## ⚙️ Installation

### 1. Clone and Install Dependencies

\`\`\`bash
cd e:/bolpur-gym
npm install
\`\`\`

### 2. Environment Setup

Create a \`.env.local\` file in the root directory:

\`\`\`env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/fitnessgym
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/fitnessgym

# JWT Secret (Generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → Settings
3. Copy your Cloud Name, API Key, and API Secret
4. Create an upload preset:
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set signing mode to "Unsigned" for frontend uploads
   - Copy the preset name

### 4. MongoDB Setup

**Option A: Local MongoDB**
\`\`\`bash
# Install MongoDB locally and start the service
# Use: mongodb://localhost:27017/fitnessgym
\`\`\`

**Option B: MongoDB Atlas (Recommended)**
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get your connection string and add to \`.env.local\`

### 5. Create Admin Account

Since the first admin needs to be created manually, you have two options:

**Option A: Direct Database Insert**
\`\`\`javascript
// Connect to MongoDB and run this in MongoDB Compass or shell
db.users.insertOne({
  name: "Admin User",
  email: "admin@fitnessgym.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
\`\`\`

**Option B: Signup then Update Role**
1. Sign up normally at `/signup`
2. Update the user's role in MongoDB:
\`\`\`javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
\`\`\`

## 🚀 Running the Application

### Development Mode
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

### Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

## 📁 Project Structure

\`\`\`
e:/bolpur-gym/
├── app/
│   ├── (public)/          # Public website pages
│   ├── admin/             # Admin panel pages
│   ├── user/              # User dashboard & profile
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── user/          # User endpoints
│   │   ├── admin/         # Admin endpoints
│   │   ├── leads/         # Contact form endpoint
│   │   └── upload/        # Cloudinary upload
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── public/            # Public website components
│   ├── user/              # User components
│   └── admin/             # Admin components
├── lib/
│   ├── db/                # MongoDB models & connection
│   ├── auth/              # JWT & password utilities
│   ├── cloudinary/        # Cloudinary config
│   └── utils.ts           # Utility functions
├── middleware.ts          # Route protection
└── .env.local            # Environment variables
\`\`\`

## 🔐 Authentication Flow

1. User signs up at `/signup`
2. Password is hashed with bcryptjs
3. User logs in at `/login`
4. JWT token is generated and stored in httpOnly cookie
5. Middleware protects `/user/*` and `/admin/*` routes
6. Admin routes check for `role === 'admin'`

## 👤 User Features

- View dashboard with fitness stats
- Update profile information
- Upload profile picture to Cloudinary
- Set fitness goals (fat loss, muscle gain, etc.)
- Track weight and height
- Access all public pages

## 🔧 Admin Features

- View dashboard with system statistics
- Manage all users (view, search)
- Track contact leads with status updates
- Role-based access control
- Secure API endpoints

## 🎨 Design System

- **Colors**: Deep black background, charcoal cards, red primary accent
- **Typography**: Inter font family
- **Components**: shadcn/ui (Radix-based)
- **Icons**: lucide-react
- **Animations**: Smooth transitions and hover effects

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/leads` - Get all leads
- `PATCH /api/admin/leads/[id]` - Update lead status

### Other
- `POST /api/leads` - Create contact lead
- `POST /api/upload` - Get Cloudinary upload signature

## 🔒 Security Features

- JWT tokens stored in httpOnly cookies
- Password hashing with bcryptjs
- Role-based access control
- Protected API routes
- Input validation
- MongoDB injection prevention

## 🚧 Future Enhancements

- Programs management (admin)
- Trainers management (admin)
- Gallery management (admin)
- Membership plans management (admin)
- User workout tracking
- Attendance system
- Payment integration
- Email notifications
- Advanced analytics

## 📄 License

This project is created for FitnessGym.

## 🤝 Support

For support, email info@fitnessgym.com or contact through the website.
\`\`\`

---

**Built with ❤️ using Next.js, MongoDB, and Cloudinary**
