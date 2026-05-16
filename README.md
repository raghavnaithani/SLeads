# Smart Leads Dashboard

A production-grade, full-stack Lead Management System built with the MERN stack and TypeScript.

## Features

- **Authentication**: JWT-based auth with secure HTTP design.
- **Role-Based Access**: 
  - `admin`: Can view, create, edit, and delete all leads.
  - `sales`: Can view and create leads, but only edit their own.
- **Advanced Lead Management**:
  - Full CRUD capabilities.
  - Server-side pagination.
  - Complex filtering by status, source, and search query.
- **Export**: Generates and downloads CSV exports respecting active filters.
- **UI/UX**: Clean, responsive Dashboard built with React, Vite, and Tailwind CSS.
- **Robustness**: Zod schema validation across all API endpoints, centralized error handling.

## Tech Stack

**Frontend**
- React 18, TypeScript, Vite
- Tailwind CSS
- Zustand (Global State)
- TanStack Query (Data Fetching)
- React Hook Form + Zod
- Lucide React

**Backend**
- Node.js, Express, TypeScript
- MongoDB, Mongoose
- JSON Web Tokens (JWT), bcryptjs
- Zod (Validation)
- Helmet, express-rate-limit

## 100% Free Deployment Guide

This project is configured to be deployed completely for free using Vercel (Frontend & Backend) and MongoDB Atlas (Database).

### 1. Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free M0 cluster.
2. In Database Access, create a database user and password.
3. In Network Access, allow access from anywhere (`0.0.0.0/0`).
4. Click "Connect" -> "Connect your application" and copy the MongoDB URI.

### 2. Backend Deployment (Vercel)
The backend is configured to run as a free Vercel Serverless Function via `server/vercel.json`.
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Configure the Project:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `MONGODB_URI`: (Your Atlas URI from step 1)
   - `JWT_SECRET`: (A strong random string)
   - `JWT_EXPIRES_IN`: `1d`
   - `CORS_ORIGIN`: `*` (or your future frontend Vercel URL)
5. Deploy. Copy the resulting Vercel deployment URL (e.g., `https://sleads-backend.vercel.app`).

### 3. Frontend Deployment (Vercel)
The frontend is configured as a standard React SPA with client-side routing via `client/vercel.json`.
1. Go to Vercel and import the repository AGAIN to create a second project.
2. Configure the Project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
3. Add Environment Variables:
   - `VITE_API_URL`: (Your backend Vercel URL from step 2, e.g., `https://sleads-backend.vercel.app/api/v1`)
4. Deploy. 

## Local Development (Free)

### Prerequisites
- Node.js 18+
- MongoDB instance running locally (free) or Atlas (free)

### Backend Setup
1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in values.
4. `npm run dev`

### Frontend Setup
1. `cd client`
2. `npm install`
3. Copy `.env.example` to `.env` (or let it fallback to defaults).
4. `npm run dev`

## Default Admin Credentials

To facilitate immediate testing without requiring database seeding, the system allows self-registration.
Register any user and their default role will be `sales`.
To test `admin` features, manually change the user role to `admin` in your MongoDB instance, or test standard CRUD as `sales`.
