# LMS Frontend Documentation

Frontend application for the LMS platform. This project provides the user interface for browsing courses, authentication, learning activities, payments, certificates, admin course management, and AI learning assistance.

## Live Deployment

- Frontend: https://learnexa-ten.vercel.app/
- Backend API: https://crack-be-dodyrokyimmanueln-production.up.railway.app

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn/Radix UI
- Axios
- TanStack React Query
- Zustand
- React Hook Form
- Zod

## Project Structure

```text
lms-frontend/
├─ public/              # Static assets
├─ src/
│  ├─ app/              # Next.js App Router pages
│  ├─ components/       # Reusable and feature components
│  ├─ hooks/            # Custom hooks
│  ├─ lib/              # API client, constants, utilities
│  ├─ store/            # Zustand stores
│  └─ types/            # Shared TypeScript types
├─ components.json
└─ next.config.ts
```

## Main Features

- Public landing and course browsing pages
- User login and registration
- Dashboard for enrolled users
- Profile and password management
- Learning path, module, and lesson pages
- Reading lesson and quiz experience
- Learning progress view
- Checkout and payment status pages
- Certificate list and certificate verification
- Admin course and user management
- Floating AI learning chatbot

## Getting Started

Install dependencies:

```bash
cd crack-fe-DodyRokyImmanuelN/lms-frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Learnexa
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production deployment, use:

```env
NEXT_PUBLIC_API_URL=https://crack-be-dodyrokyimmanueln-production.up.railway.app
NEXT_PUBLIC_APP_NAME=Learnexa
NEXT_PUBLIC_APP_URL=https://learnexa-ten.vercel.app
```

Run the development server:

```bash
npm run dev
```

Open the app at:

```bash
http://localhost:3000
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Main Routes

- `/` - Home page
- `/about` - About page
- `/courses` - Public course list
- `/login` - Login page
- `/register` - Register page
- `/dashboard` - User dashboard
- `/progress` - Learning progress
- `/profile` - User profile
- `/certificates` - User certificates
- `/checkout/[slug]` - Course checkout
- `/payment/success` - Successful payment page
- `/payment/failed` - Failed payment page
- `/learning/[slug]` - Learning path page
- `/learning/[slug]/module/[moduleSlug]` - Module page
- `/learning/[slug]/module/[moduleSlug]/lesson/[lessonSlug]` - Lesson page
- `/learning/[slug]/module/[moduleSlug]/quiz/[lessonSlug]` - Quiz page
- `/admin/courses` - Admin course management
- `/admin/courses/create` - Create course
- `/admin/courses/[slug]/edit` - Edit course
- `/admin/users` - Admin user management

## API Integration

API configuration is located in:

```text
src/lib/api.ts
src/lib/constants.ts
```

The frontend communicates with the backend using `NEXT_PUBLIC_API_URL`. Authenticated requests use an Axios instance that attaches the access token and automatically refreshes it when needed.

## Backend Requirement

Make sure the backend is running before using the frontend:

```bash
cd crack-be-DodyRokyImmanuelN/lms-backend
npm run start:dev
```

The frontend expects the backend at:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Notes

- Do not commit `.env.local` files.
- Keep API endpoint constants in `src/lib/constants.ts`.
- Use the shared Axios client from `src/lib/api.ts` for authenticated requests.
- Reusable UI components are stored in `src/components/ui`.
- Authentication state is managed with Zustand in `src/store/authStore.ts`.
