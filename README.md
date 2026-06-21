<div align="center">

  <img src="public/uplink_logo_no_bg.png" alt="UpLink Logo" width="130" />

  # UpLink

  ### 🚀 Find Your Next Opportunity

  A full-stack job board platform built with Next.js — connecting job seekers with employers through an SEO-optimized, server-rendered interface with in-app resume building, smart job alerts, and role-based dashboards.

  [![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![NextAuth](https://img.shields.io/badge/NextAuth.js-v5-8B5CF6?style=for-the-badge&logo=auth0&logoColor=white)](https://authjs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  [Live Demo](https://your-vercel-url.vercel.app) · [Report Bug](https://github.com/yourusername/uplink/issues) · [Request Feature](https://github.com/yourusername/uplink/issues)

</div>

---

## 📑 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [Authentication & Authorization](#-authentication--authorization)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About The Project

**UpLink** is a full-stack MERN job board platform built with **Next.js 16 (App Router)**. It connects job seekers with employers through a clean, modern interface that is fully **server-rendered for SEO** — meaning job listings and company profiles are indexed by Google.

The platform supports three distinct user roles, each with a dedicated dashboard:

| 👤 Job Seeker | 🏢 Employer | 🛡️ Admin |
|---|---|---|
| Browse & apply for jobs | Post & manage job listings | Platform-wide oversight |
| Build a resume in-app | Track applicants per listing | Approve company registrations |
| Set up smart job alerts | Update applicant statuses | Manage users, jobs & categories |
| Bookmark jobs for later | View hiring analytics | Moderate company reviews |

The project leverages **Next.js App Router** capabilities — SSR/SSG for SEO, API route handlers (no separate backend), edge middleware for auth, `generateMetadata` for dynamic meta tags, and `next/image` for optimized image delivery.

---

## ✨ Key Features

<table>
  <tr>
    <td width="50%">

### 🔍 Job Seekers
- Browse all jobs with search, filter (category, type, location, salary, remote), and sort
- View SEO-optimized job detail pages (server-rendered)
- Apply with in-app or uploaded resume + cover letter
- **Resume Builder** — multi-step form with live preview → generates downloadable PDF
- Track all applications with real-time status updates
- Bookmark/save jobs to apply later
- **Smart Job Alerts** — set keywords & categories → get email notifications via Resend when matching jobs are posted
- Leave company reviews with ratings

</td>
    <td width="50%">

### 🏢 Employers
- Register a company with logo, description, industry, and social links
- Post job listings with **Tiptap rich text editor** for descriptions
- Manage listings — edit, pause, close, or delete
- View all applicants per job with downloadable resumes
- Update applicant status pipeline: `pending → reviewed → shortlisted → rejected → hired`
- Employer dashboard with analytics — total jobs, applicants, and application trends (Recharts)

### 🛡️ Admins
- Platform-wide dashboard with aggregate stats and charts
- Manage all users (seekers + employers) — roles & status
- Approve or reject company registrations
- Moderate all job posts and company reviews
- CRUD for job categories

</td>
  </tr>
</table>

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | SSR/SSG, API routes, middleware, image optimization |
| **UI Library** | React 19 | Component-based UI |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Animations** | Framer Motion | Page transitions & micro-interactions |
| **Authentication** | NextAuth.js v5 (Auth.js) | Credentials + Google OAuth, JWT sessions |
| **Database** | MongoDB + Mongoose 9 | Document-based data storage with ODM |
| **Data Fetching** | TanStack Query v5 (client) / `fetch` (server) | Caching, loading states, auto refetch |
| **Forms** | React Hook Form + Zod | Validated forms with shared client/server schemas |
| **Rich Text** | Tiptap 3 | Job description editor (bold, lists, links, headings) |
| **Charts** | Recharts | Dashboard analytics visualizations |
| **State Management** | Zustand | Resume builder & filter state |
| **File Upload** | Cloudinary + Multer | Resume PDFs & company logos |
| **PDF Generation** | @react-pdf/renderer | In-app resume → downloadable PDF |
| **Email** | Resend + React Email | Job alert & welcome email notifications |
| **Date Utilities** | date-fns | Date formatting & manipulation |
| **Notifications** | React Hot Toast | Success/error toasts |
| **Icons** | React Icons | UI iconography |
| **Deployment** | Vercel | Full-stack hosting (frontend + API routes) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or **yarn** / **pnpm**)
- **MongoDB** instance ([MongoDB Atlas](https://www.mongodb.com/atlas) recommended)
- **Google Cloud** project with OAuth credentials
- **Cloudinary** account ([Sign up free](https://cloudinary.com/))
- **Resend** account ([Sign up free](https://resend.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/uplink.git
   cd uplink
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) below).

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm start           # Start the production server
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# ─── MongoDB ──────────────────────────────────────
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uplink?retryWrites=true&w=majority

# ─── NextAuth ─────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# ─── Google OAuth ─────────────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ─── Cloudinary ───────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

# ─── Resend (Email) ──────────────────────────────
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=alerts@yourdomain.com
```

> ⚠️ **Important:** Never commit your `.env` file to version control. It is already included in `.gitignore`.

---

## 📁 Project Structure

```
uplink/
├── app/                                # Next.js App Router
│   ├── layout.jsx                      # Root layout — fonts, providers, toaster
│   ├── globals.css                     # Global styles & Tailwind imports
│   ├── not-found.jsx                   # Custom 404 page
│   ├── loading.jsx                     # Global loading UI
│   │
│   ├── (public)/                       # 🌐 Public pages (SSR/SSG)
│   │   ├── layout.jsx                  #    Navbar + Footer wrapper
│   │   ├── page.jsx                    #    Home / Landing page (SSG)
│   │   ├── about/page.jsx             #    About page (SSG)
│   │   ├── jobs/
│   │   │   ├── page.jsx               #    All jobs listing (SSR)
│   │   │   └── [id]/page.jsx          #    Job detail (SSR + generateMetadata)
│   │   └── companies/
│   │       ├── page.jsx               #    All companies (SSR)
│   │       └── [id]/page.jsx          #    Company profile (SSR + generateMetadata)
│   │
│   ├── (auth)/                         # 🔑 Auth pages (centered layout)
│   │   ├── layout.jsx                  #    Centered card layout
│   │   ├── login/page.jsx             #    Login (credentials + Google)
│   │   └── register/page.jsx          #    Register (with role selection)
│   │
│   ├── dashboard/                      # 👤 Job Seeker area
│   │   ├── layout.jsx                  #    Sidebar + content layout
│   │   ├── page.jsx                    #    Dashboard home — stats & activity
│   │   ├── applications/page.jsx       #    My applications tracker
│   │   ├── saved/page.jsx             #    Bookmarked jobs
│   │   ├── alerts/page.jsx            #    Job alert preferences
│   │   ├── profile/page.jsx           #    Edit profile, skills, experience
│   │   └── resume/page.jsx            #    Resume builder (multi-step)
│   │
│   ├── employer/                       # 🏢 Employer area
│   │   ├── layout.jsx                  #    Sidebar + content layout
│   │   ├── dashboard/page.jsx         #    Employer dashboard — stats & charts
│   │   ├── company/page.jsx           #    Edit company profile
│   │   └── jobs/
│   │       ├── page.jsx               #    Manage posted jobs
│   │       ├── new/page.jsx           #    Post new job
│   │       └── [id]/
│   │           ├── edit/page.jsx      #    Edit existing job
│   │           └── applicants/page.jsx #    View applicants per job
│   │
│   ├── admin/                          # 🛡️ Admin area
│   │   ├── layout.jsx                  #    Sidebar + content layout
│   │   ├── page.jsx                    #    Admin dashboard — platform stats
│   │   ├── users/page.jsx             #    Manage all users
│   │   ├── companies/page.jsx         #    Approve/reject companies
│   │   ├── jobs/page.jsx              #    Moderate job posts
│   │   ├── categories/page.jsx        #    Manage job categories
│   │   └── reviews/page.jsx           #    Manage company reviews
│   │
│   └── api/                            # ⚡ API Route Handlers
│       ├── auth/[...nextauth]/route.js #    NextAuth handler
│       ├── jobs/                       #    Jobs CRUD + apply
│       ├── applications/              #    Application tracking
│       ├── companies/                 #    Companies + reviews
│       ├── profile/route.js           #    User profile
│       ├── resume/route.js            #    Resume data
│       ├── saved/route.js             #    Saved/bookmarked jobs
│       ├── alerts/                    #    Job alert preferences
│       ├── categories/               #    Job categories (admin)
│       ├── users/                    #    User management (admin)
│       ├── upload/route.js            #    Cloudinary file upload
│       └── admin/                    #    Admin stats & company approval
│
├── components/                         # React Components
│   ├── ui/                             #    Reusable primitives (Button, Input, Badge, Modal, etc.)
│   ├── shared/                         #    Navbar, Footer, Sidebars, Providers
│   ├── home/                           #    Landing page sections
│   ├── jobs/                           #    JobCard, Filters, Search, ApplyModal
│   ├── companies/                      #    CompanyCard, Header, Reviews
│   ├── resume/                         #    ResumeBuilder, StepNav, Preview, PDF
│   ├── dashboard/                      #    Seeker dashboard components
│   ├── employer/                       #    Employer dashboard components
│   └── admin/                          #    Admin dashboard components
│
├── lib/                                # Server-side utilities
│   ├── auth.js                         #    NextAuth v5 config (providers, callbacks)
│   ├── db.js                           #    MongoDB singleton connection
│   ├── cloudinary.js                   #    Cloudinary upload helper
│   ├── resend.js                       #    Resend email client
│   ├── templates/                      #    React Email templates
│   └── utils.js                        #    Shared utility functions
│
├── models/                             # Mongoose schemas (9 models)
├── schemas/                            # Zod validation schemas (shared client + server)
├── hooks/                              # Custom React hooks (TanStack Query wrappers)
├── store/                              # Zustand stores (resume builder, filters)
├── public/                             # Static assets & logos
├── middleware.js                        # Next.js edge middleware (auth + role protection)
├── next.config.mjs                     # Next.js configuration
├── postcss.config.mjs                  # PostCSS configuration
├── package.json
└── .gitignore
```

---

## 🗺️ Pages & Routes

### 🌐 Public Pages — Server-Rendered for SEO

| Page | Route | Rendering | Description |
|---|---|---|---|
| Home | `/` | SSG | Hero, featured jobs, top companies, how it works, stats |
| All Jobs | `/jobs` | SSR | Full job listings with search, filter, and pagination |
| Job Detail | `/jobs/[id]` | SSR | Individual job info, requirements, apply button — SEO meta |
| All Companies | `/companies` | SSR | Browse all approved companies |
| Company Profile | `/companies/[id]` | SSR | Company info, open positions, reviews — SEO meta |
| About | `/about` | SSG | Platform story and mission |

### 🔑 Auth Pages

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Credentials + Google OAuth sign-in |
| Register | `/register` | Account creation with role selection (Seeker / Employer) |

### 👤 Job Seeker Dashboard

| Page | Route | Description |
|---|---|---|
| Dashboard | `/dashboard` | Overview stats, recent applications |
| My Applications | `/dashboard/applications` | All applications with status tracking |
| Saved Jobs | `/dashboard/saved` | Bookmarked jobs list |
| Job Alerts | `/dashboard/alerts` | Manage keyword/category alert preferences |
| Profile | `/dashboard/profile` | Edit personal info, skills, experience, education |
| Resume Builder | `/dashboard/resume` | Multi-step form → live preview → downloadable PDF |

### 🏢 Employer Dashboard

| Page | Route | Description |
|---|---|---|
| Dashboard | `/employer/dashboard` | Job stats, applicant chart, recent applications |
| Company Profile | `/employer/company` | Edit company info, logo, social links |
| Manage Jobs | `/employer/jobs` | All posted jobs with edit/pause/delete |
| Post New Job | `/employer/jobs/new` | Create job listing with Tiptap rich text editor |
| Edit Job | `/employer/jobs/[id]/edit` | Modify existing listing |
| View Applicants | `/employer/jobs/[id]/applicants` | Applicants per job with status management |

### 🛡️ Admin Dashboard

| Page | Route | Description |
|---|---|---|
| Dashboard | `/admin` | Platform-wide stats and analytics |
| Manage Users | `/admin/users` | All users with role/status controls |
| Manage Companies | `/admin/companies` | Approve or reject company registrations |
| Manage Jobs | `/admin/jobs` | Moderate all job posts |
| Manage Categories | `/admin/categories` | CRUD for job categories |
| Manage Reviews | `/admin/reviews` | Moderate company reviews |

---

## 📡 API Reference

All API routes live under `app/api/` and are served from the same Next.js deployment — **no separate backend server required**.

**Access Levels:** 🌐 Public · 👤 Seeker · 🏢 Employer · 🛡️ Admin · 🔒 Authenticated

---

### 🔑 Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `*` | `/api/auth/[...nextauth]` | 🌐 Public | NextAuth.js handler (login, callback, session) |

---

### 💼 Jobs — `/api/jobs`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | 🌐 Public | Get all jobs (`?search`, `?category`, `?type`, `?location`, `?salary`, `?remote`, `?page`, `?limit`) |
| `POST` | `/api/jobs` | 🏢 Employer | Create new job post |
| `GET` | `/api/jobs/[id]` | 🌐 Public | Get single job detail |
| `PATCH` | `/api/jobs/[id]` | 🏢 Employer (owner) | Update job post |
| `DELETE` | `/api/jobs/[id]` | 🏢 Owner / 🛡️ Admin | Delete job post |
| `POST` | `/api/jobs/[id]/apply` | 👤 Seeker | Apply for job |

---

### 📋 Applications — `/api/applications`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/applications` | 👤 Seeker | Get my applications |
| `PATCH` | `/api/applications/[id]` | 🏢 Employer | Update application status |

---

### 🏢 Companies — `/api/companies`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/companies` | 🌐 Public | Get all approved companies |
| `POST` | `/api/companies` | 🏢 Employer | Create company profile |
| `GET` | `/api/companies/[id]` | 🌐 Public | Get company detail + open jobs |
| `PATCH` | `/api/companies/[id]` | 🏢 Employer (owner) | Update company |
| `GET` | `/api/companies/[id]/reviews` | 🌐 Public | Get company reviews |
| `POST` | `/api/companies/[id]/reviews` | 👤 Seeker | Submit a review |

---

### 👤 Profile — `/api/profile`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/profile` | 👤 Seeker | Get my profile |
| `PATCH` | `/api/profile` | 👤 Seeker | Update profile (skills, experience, education) |

---

### 📄 Resume — `/api/resume`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/resume` | 👤 Seeker | Get my resume data |
| `POST` | `/api/resume` | 👤 Seeker | Save resume builder data |

---

### 🔖 Saved Jobs — `/api/saved`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/saved` | 👤 Seeker | Get bookmarked jobs |
| `POST` | `/api/saved` | 👤 Seeker | Bookmark a job |
| `DELETE` | `/api/saved` | 👤 Seeker | Remove bookmark |

---

### 🔔 Job Alerts — `/api/alerts`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/alerts` | 👤 Seeker | Get my job alerts |
| `POST` | `/api/alerts` | 👤 Seeker | Create new alert (keywords + categories) |
| `PATCH` | `/api/alerts/[id]` | 👤 Seeker | Update alert |
| `DELETE` | `/api/alerts/[id]` | 👤 Seeker | Delete alert |

---

### 📂 Categories — `/api/categories`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/categories` | 🌐 Public | Get all categories with job counts |
| `POST` | `/api/categories` | 🛡️ Admin | Create category |
| `PATCH` | `/api/categories/[id]` | 🛡️ Admin | Update category |
| `DELETE` | `/api/categories/[id]` | 🛡️ Admin | Delete category |

---

### 👥 Users — `/api/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users` | 🛡️ Admin | Get all users |
| `PATCH` | `/api/users/[id]` | 🛡️ Admin | Update role or status |
| `DELETE` | `/api/users/[id]` | 🛡️ Admin | Delete user |

---

### 📊 Admin — `/api/admin`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | 🛡️ Admin | Platform-wide stats for dashboard |
| `PATCH` | `/api/admin/companies/[id]/approve` | 🛡️ Admin | Approve or reject company registration |

---

### ☁️ Upload — `/api/upload`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/upload` | 🔒 Auth | Upload file to Cloudinary — returns URL |

---

## 🗄️ Database Models

The application uses **9 Mongoose models** with a normalized MongoDB schema:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User      │────▶│   Profile    │     │   Category   │
│              │     │  (seeker)    │     │              │
│  role:       │     └──────────────┘     └──────┬───────┘
│  jobseeker   │                                 │
│  employer    │     ┌──────────────┐     ┌──────▼───────┐
│  admin       │────▶│   Company    │────▶│     Job      │
│              │     │  (employer)  │     │              │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │             ┌──────▼───────┐     ┌──────▼───────┐
       │             │   Review     │     │ Application  │
       │             └──────────────┘     └──────────────┘
       │
       ├────▶ SavedJob (user + job ref)
       └────▶ JobAlert (keywords + categories)
```

| Model | Key Fields | Description |
|---|---|---|
| **User** | name, email, password, role, photoURL, isActive | User accounts — `jobseeker`, `employer`, `admin` |
| **Profile** | skills, experience[], education[], links | Job seeker extended profile |
| **Company** | name, logo, description, industry, size, isApproved | Employer company profile with admin approval |
| **Job** | title, description (HTML), category, type, salary, location, deadline | Job listings posted by employers |
| **Application** | job, applicant, resumeURL, coverLetter, status | Job applications with status pipeline |
| **SavedJob** | user, job | Bookmarked jobs (user ↔ job reference pair) |
| **JobAlert** | user, keywords[], categories[] | Email alert subscriptions |
| **Category** | name, slug, icon, jobCount | Job categories with associated counts |
| **Review** | company, user, rating, comment, isApproved | Company reviews with admin moderation |

---

## 🔐 Authentication & Authorization

### Auth Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser    │────▶│  NextAuth   │────▶│   MongoDB    │────▶│  JWT Token  │
│              │     │  Providers  │     │  User Lookup │     │  (session)  │
│  Login Form  │     │             │     │  or Create   │     │             │
│  Google SSO  │     │ credentials │     │              │     │ role stored │
│              │     │ google      │     │              │     │ in token    │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                    ┌───────────────────────────────────────────────▼──────┐
                    │                 Next.js Middleware                   │
                    │                                                      │
                    │  /dashboard/*  → requires jobseeker role             │
                    │  /employer/*   → requires employer role              │
                    │  /admin/*      → requires admin role                 │
                    │  /login        → redirects if already logged in      │
                    └──────────────────────────────────────────────────────┘
```

### Providers
- **Credentials** — Email + password (bcrypt hashed)
- **Google OAuth** — One-click Google sign-in

### Session Strategy
- **JWT-based sessions** — role (`jobseeker | employer | admin`) embedded in the token
- Server components: access session via `auth()` from `lib/auth.js`
- Client components: access session via `useSession()` from `next-auth/react`

### Route Protection
- **Edge Middleware** (`middleware.js`) — intercepts requests before page loads, checks auth + role, redirects unauthorized users
- **API Routes** — additionally verify session via `auth()` for protected endpoints

---

## 🧩 Key Technical Highlights

<table>
  <tr>
    <td width="50%">

### ⚡ Next.js App Router
- SSR on job & company pages for Google indexing
- SSG on static pages (Home, About) for instant loads
- `generateMetadata` for dynamic SEO meta tags
- API route handlers — no separate Express server
- Edge middleware for auth at the CDN level
- `next/image` for optimized image delivery

</td>
    <td width="50%">

### 📝 Resume Builder
- Multi-step form (Personal → Experience → Education → Skills → Links)
- Live preview panel that updates in real-time
- `@react-pdf/renderer` generates downloadable PDF
- PDF uploaded to Cloudinary, URL stored in profile
- State managed with Zustand store

</td>
  </tr>
  <tr>
    <td width="50%">

### 🔔 Smart Job Alerts
- Seekers define keywords + categories
- New job posts trigger alert matching
- Email notifications sent via Resend API
- React Email templates for rich HTML emails

</td>
    <td width="50%">

### ✅ Shared Validation
- Zod schemas in `schemas/` folder
- Shared between client (React Hook Form resolver) and server (API route validation)
- Single source of truth for all validation rules
- Type-safe error messages

</td>
  </tr>
</table>

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please make sure to follow the existing code style, use the Zod schemas for any new validation, and test your changes thoroughly.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

  <img src="public/uplink_logo_no_bg.png" alt="UpLink" width="80" />

  <p>
    Built with ❤️ using Next.js, React, MongoDB, and Tailwind CSS
  </p>

  <a href="#uplink">⬆️ Back to Top</a>

</div>
