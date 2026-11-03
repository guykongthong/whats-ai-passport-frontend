# What's AI Passport - Frontend

Vue 3 single page app for **AI Passport**, a platform where students build AI skills step by step. Users watch e-learning videos and take an exam at each level to move up four tiers (Explorer, Achiever, Innovator, Master). Every tier unlocks badges and campus services. Admins manage users, level criteria and exam questions.

Built as a group project for Component-Based Software Development at CAMT, Chiang Mai University. The API it talks to is in [whats-ai-passport-backend](https://github.com/guykongthong/whats-ai-passport-backend).

## Features

**Student portal**
- Register with a profile photo, log in, and edit your profile
- Dashboard showing your current level, badges and unlocked services
- E-learning video viewer
- Level exam with progress tracking and a result screen, plus exam history
- Your level and benefits update straight after passing, without logging in again

**Admin portal**
- Paginated user list with search, level and province filters, and an enable or disable toggle
- Tabbed user detail page for info, exam history and editing
- Level criteria editing and exam question management (create, edit, delete)

**Across the app**
- Route guards for guests, logged-in users and admins
- An Axios client that attaches the JWT to each request and handles expired sessions globally
- Offline, 404 and server error pages, plus toast messages for feedback

## Tech stack

Vue 3 (Composition API, `<script setup>`), TypeScript, Vite, Pinia, Vue Router, Axios, Tailwind CSS v4, VeeValidate with Yup for forms, ESLint, Oxlint and Prettier.

## Running locally

You need Node.js 22 or newer and the backend running on `http://localhost:8080`.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Requests to `/api` are sent to the backend, and you can point to a different one with `VITE_API_URL`.

Other scripts: `npm run type-check`, `npm run lint`, `npm run build` and `npm run preview`.

## Demo accounts

These exist once the backend has seeded its database.

| Role  | Username            | Password   |
| ----- | ------------------- | ---------- |
| Admin | `admin`             | `admin123` |
| User  | `user1` to `user32` | `user123`  |

`user1` to `user4` sit at levels 1 to 4, which is handy for trying each exam. New registrations start at level 1.

## Project structure

```
frontend/src/
  auth/        login and register forms, validation schemas
  components/  shared UI such as the image upload and profile header
  views/       user and admin pages
  stores/      Pinia stores for auth, user and exam state
  services/    Axios client and one service per API area
  router/      routes and navigation guards
```

## CI and deployment

GitHub Actions type-checks, lints and builds on pull requests. A push to `prod` builds the Docker image (nginx serving the built app) and redeploys it with Docker Compose. That workflow needs Docker Hub and VM secrets, so it only runs in the original setup.

`DEVELOPMENT_LOG.md` tracks the issues the team worked through and how each was verified.
