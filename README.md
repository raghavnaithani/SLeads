# GigFlow (Smart Leads Dashboard)

A production-grade, full-stack Lead Management System built with the **MERN Stack** (Next.js, Express, MongoDB, Node) and fully typed with **TypeScript**. 

This system represents a clean architecture with a separate layer design, advanced query filters, robust request/query validation, a lightweight token-revocation storage, and modern visual design supporting Dark/Light mode layouts.

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Framework](https://img.shields.io/badge/Frontend-Next.js%2016-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Table of Contents
1. [Core Features](#-core-features)
2. [Tech Stack Details](#-tech-stack-details)
3. [Architecture & Project Structure](#-architecture--project-structure)
4. [Database Optimization](#-database-optimization)
5. [Lightweight Session Revocation](#-lightweight-session-revocation)
6. [Security Configurations](#-security-configurations)
7. [Local Installation & Setup](#-local-installation--setup)
8. [Docker Compose Orchestration](#-docker-compose-orchestration)
9. [Automated Test Suite](#-automated-test-suite)
10. [Deployment Guide (Vercel & Atlas)](#-deployment-guide-vercel--atlas)
11. [Submission Details](#-submission-details)
12. [API Documentation Quicklink](#-api-documentation-quicklink)

---

## 🌟 Core Features

### 1. Advanced JWT Authentication & Security
* **Token Handling**: State is persisted via `localStorage` and synchronized via a secure, path-restricted HTTP-cookie (`auth_token`).
* **Route Protection**: Implemented via Next.js Middleware (`client/middleware.ts`) for subsecond redirects of unauthenticated users requesting `/dashboard/*`.
* **Revocation Blacklist**: Token blacklist persists revoked keys to prevent replay attacks post-logout (survives container/process restarts).

### 2. Role-Based Access Control (RBAC) & User Management
* **`admin` Role**: Full access to view, create, edit, and delete any lead. Additionally, admins have access to a dedicated **Users Management** dashboard panel where they can view all registered users, promote sales reps to admins, demote other admins, or delete user accounts.
* **`sales` Role**: Can view all leads and create new leads, but can only edit leads they personally created. Prevented from deleting leads, listing users, or changing user roles.
* **Access Safeguards**: Strict checks prevent admins from self-deleting their own account or self-demoting their role if they are the last remaining administrator in the system.

### 3. Database Auto-Bootstrapping
* **Super-Admin Seeding**: Upon connecting to an empty database (first-time launch), the backend automatically seeds a default system administrator account (`admin@sleads.com` / `Password123`). This allows instant, secure access for testing and evaluation without exposing insecure public signup selectors.

### 4. Advanced Filtering, Search & Sorting
* **Debounced Search**: Search queries against name or email are debounced (350ms) using a custom react hook (`useDebounce`) to avoid overloading database connection limits.
* **Combined Filters**: Multiple filters (Status + Source + Search + Sorting) act concurrently in a single Mongoose query builder on the backend.
* **Server-Side Pagination**: Implemented using optimized Mongo `skip()` and `limit()` methods returning pagination metadata records (`total`, `page`, `limit`, `totalPages`).

### 5. Filter-Synchronized CSV Export
* **Query Alignment**: Exporting triggers an endpoint matching all active search and filter conditions, omitting limit restrictions.
* **Data Sanitization**: Double-quotes inside user fields (e.g. name or company) are escaped (`""`) to ensure RFC-4180 compliance.

### 6. Polished Responsive UI/UX
* **Dark Mode**: Integrated via `next-themes` provider tracking system defaults and user toggles.
* **Rich Interactions**: Clean modern look utilizing gradients, glassmorphism overlays, custom sidebar animations, and hover glow effects.
* **State Handlers**: Explicit empty search states, loading skeletons, spinner indicators, and toast error notifications.

---

## 🛠️ Tech Stack Details

### Frontend Client
* **Core**: Next.js 16 (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS, Lucide React (Icons), `next-themes` (Dark Mode)
* **Forms & Validation**: React Hook Form, Zod
* **UI Elements**: Radix UI primitives (Accordion, Dialogs, Selects, Toasts, etc.)
* **Networking**: Fetch API with standard response envelope parsers

### Backend Server
* **Core**: Node.js, Express, TypeScript
* **Database**: MongoDB & Mongoose
* **Security**: Helmet (HTTP security headers), `express-rate-limit` (Brute force protection), CORS, `bcryptjs` (Password hashing)
* **Validation**: Zod (Validates request bodies and URL queries independently)
* **Optimization**: Compression (Gzip) and `cookie-parser` for authentication parsing

---

## 🏛️ Architecture & Project Structure

The project implements a **Clean Layered Architecture** separation:
```
Routes (Routing/HTTP) ➔ Middlewares (Auth/Validation) ➔ Controllers (Request/Response) ➔ Services (Business Logic) ➔ Repositories (Data Access) ➔ Database (Models)
```

### Server Directory Map (`/server`)
```txt
server/
├── src/
│   ├── config/             # Database connection & env schemas (Zod verified)
│   ├── constants/          # Role lists, statuses, salt rounds, prefixes
│   ├── controllers/        # Express handlers extracting tokens and payloads
│   ├── errors/             # Custom classes (ValidationError, NotFoundError, etc.)
│   ├── interfaces/         # Strong TypeScript interfaces for models & requests
│   ├── middlewares/        # JWT auth, role validation, Zod request body/query parsers
│   ├── models/             # Mongoose schemas (User and Lead)
│   ├── repositories/       # Isolated Mongoose queries (Find, Count, Populate)
│   ├── routes/             # Router files, including user.routes.ts (User management)
│   ├── services/           # Business logic: RBAC checks & CSV formatting
│   ├── utils/              # ApiResponse, logout blacklists, and bootstrap.ts (Admin seeder)
│   └── app.ts              # Express initialization, security middlewares, and rate limiters
├── tsconfig.json           # TS compiling configurations
├── Dockerfile              # Alpine Node.js multi-stage build script
└── test_suite.js           # Automated script for API integration test coverage
```

### Client Directory Map (`/client`)
```txt
client/
├── app/
│   ├── (dashboard)/        # Route group wrapping sidebar & header dashboards
│   │   ├── dashboard/      # Overview metrics panel
│   │   ├── dashboard-leads/# Interactive CRUD table with debounced search
│   │   ├── dashboard-users/# Users Management role switcher & deletion panel
│   │   └── dashboard-profile/ # Profile view
│   ├── globals.css         # Theme style sheets and animations
│   ├── layout.tsx          # Root font mapping & providers
│   └── page.tsx            # Landing/Home page with registration & login modals
├── components/
│   ├── dashboard/          # Sidebar, header, metrics cards, and lead modals
│   ├── modals/             # SignIn and SignUp modals
│   └── ui/                 # Radix UI wrapper elements
├── hooks/                  # Standard window hooks
├── lib/
│   ├── api.ts              # Strongly typed API endpoints and fetch utilities
│   ├── hooks/useDebounce.ts# Debounce utility hook
│   ├── session.ts          # Auth cookie & localStorage managers
│   └── utils.ts            # Tailmerge styling cleanups
├── Dockerfile              # Client Next.js production build environment
└── next.config.mjs         # Next.js bundler configurations
```

---

## ⚡ Database Optimization

To ensure scalable search queries under heavy lead volumes, the backend indexes specific fields on the Mongoose schema:
* **Single Field Indexes**: `status: 1`, `source: 1`, `createdBy: 1`, `createdAt: -1`
* **Text Search Index**: Combined index on `name` and `email` (`{ name: 'text', email: 'text' }`) enabling fast keyword queries.

*Implementation in `server/src/models/lead.model.ts`:*
```ts
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdBy: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text' });
```

---

## 💾 Lightweight Session Revocation

A common drawback of stateless JWT setups is the inability to revoke tokens on logout before they expire. 

To solve this for development environments without introducing heavy dependencies like Redis, we implemented a **JSON File-Backed Token Blacklist** (`server/src/utils/tokenBlacklist.ts`):
1. **Logout Action**: Calling `POST /auth/logout` places the active token into an in-memory Map, setting its expiration threshold.
2. **File Persistence**: The Map is asynchronously serialized to `server/.token_blacklist.json`.
3. **Recovery**: On server reload/restart, the file is read back into memory, pruning expired tokens.
4. **Verification**: The `authMiddleware` queries this list for each incoming call.

---

## 🔒 Security Configurations

1. **Helmet**: Configures secure HTTP response headers to defend against clickjacking, XSS, and MIME-sniffing.
2. **Rate Limiting**: Limits requests from any single IP to **100 requests per 15 minutes** to prevent brute-force attacks.
3. **CORS Policy**: Restricts origin requests strictly to the configured `CORS_ORIGIN` env value (in production) while allowing localhost configurations during development.
4. **Data Sanitization**: Employs Zod schemas on both URL queries and request bodies, ensuring bad inputs are rejected prior to Mongoose parsing.

---

## 🚀 Local Installation & Setup

### Prerequisites
* Node.js 18+ installed on your system.
* MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas connection string.

### 1. Clone & Configure Server
```bash
cd server
npm install
cp .env.example .env
```
Fill out `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sleads_dev
JWT_SECRET=use_a_strong_random_string_of_minimum_16_characters
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```
Start the development server:
```bash
npm run dev
```

### 2. Configure Client
Open a new terminal window:
```bash
cd client
npm install
cp .env.example .env.local
```
Start the Next.js development client:
```bash
npm run dev
```
The client dashboard will be available at `http://localhost:3000`.

---

## 🐳 Docker Compose Orchestration

The project contains a standard multi-container docker orchestration file at the root. It spins up three separate containers: MongoDB 6.0, the Node.js Express server, and the Next.js frontend client.

To run the entire app locally with docker:
```bash
# Verify server/.env exists before building
docker compose up --build -d
```
* **Frontend Panel**: `http://localhost:3000`
* **API Prefix**: `http://localhost:5000`
* **MongoDB**: Port `27017`

To shut down and prune database volumes:
```bash
docker compose down -v
```

---

## 🧪 Automated Test Suite

A standalone test runner script is located in `server/test_suite.js`. It runs a battery of integration tests covering registration, login, token verification, CRUD, Zod validation errors, pagination checks, sorting, search filtering, and CSV download generation.

To execute the tests:
1. Ensure the server is running (`npm run dev` inside `/server`).
2. Run the test command:
```bash
cd server
node test_suite.js
```
The console will print a detailed assertion walkthrough and output success upon completion.

---

## ☁️ Deployment Guide (Vercel & Atlas)

### 1. Database Configuration (MongoDB Atlas)
1. Register/Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Deploy a free **M0 Cluster**.
3. Create a database user and record the password.
4. Under **Network Access**, whitelist access from anywhere (`0.0.0.0/0`) since Vercel utilizes dynamic serverless IP pools.
5. Retrieve your connection string from "Connect" ➔ "Drivers".

### 2. Unified Full-Stack Deployment (Single URL)
You can deploy both frontend and backend together under a single Vercel project using the root-level `vercel.json` file:
1. Push your repository to GitHub.
2. Log in to your [Vercel Dashboard](https://vercel.com).
3. Click **"New Project"** and import your repository.
4. Keep the **Root Directory** as the repository root (`./`).
5. Vercel will automatically read the root `vercel.json` and build both the Next.js `client` and Express `server` concurrently.
6. Under **Environment Variables**, add the following configurations:
   * `MONGODB_URI`: (Your MongoDB Atlas connection string)
   * `JWT_SECRET`: (A strong random secret key of at least 16 characters)
   * `JWT_EXPIRES_IN`: `7d`
   * `CORS_ORIGIN`: `*` (or your resulting frontend Vercel URL)
   * `NEXT_PUBLIC_API_URL`: `/api/v1` (Uses relative routing pointing to the same server URL)
7. Click **Deploy**. Both services will run under a single link (e.g. `sleads-dashboard.vercel.app`).

### 3. Alternative: Separate Projects Deployment
If you prefer to deploy them as separate projects on Vercel:
* **Backend API Project**:
  * Import repository and set the root directory to `server`.
  * Set environment variables (`MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`).
  * Vercel will use `server/vercel.json` to build and serve the API.
* **Frontend UI Project**:
  * Import repository and set the root directory to `client`.
  * Set `NEXT_PUBLIC_API_URL` to your backend project's live URL (e.g. `https://sleads-api.vercel.app/api/v1`).
  * Vercel will run a standard Next.js deployment.

---

## 📧 Submission Details

* **Author**: Raghav Naithani
* **Submission Email**: `ritik.yadav@servicehive.tech`
* **Subject Format**: `MERN Internship Assignment Submission - Raghav Naithani`

### Included Materials
* Complete Next.js & Express TypeScript Codebase
* Automated Integration Test Suite (`server/test_suite.js`)
* Docker Compose orchestrator (`docker-compose.yml`)
* Detailed Local & Cloud Environment setups (`.env.example`)
* Comprehensive endpoint documentation (`API_DOCUMENTATION.md`)

---

## 🔗 API Documentation Quicklink
For request/response payload examples, Zod schemas, and RBAC matrix parameters, view the complete [API Documentation](file:///e:/DEVELOPMENT/PROJECTS/ACTIVE/SLeads/API_DOCUMENTATION.md).
