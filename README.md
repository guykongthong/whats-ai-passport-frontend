# What's AI Passport - Frontend (Group 14)

Course: 953331 Component-Based Software Development  
Semester: Project 2 (Academic Year 2026)  
College of Arts, Media and Technology (CAMT), Chiang Mai University

---

## Team Members

- **** Contributor
- **** Contributor
- **** Contributor

---

## Repositories & URLs

- **Frontend Repository (Group 14):**  
  https://github.com/chartchai-class/953331-2026-component-based-software-dev-project2-frontend-group-14
- **Backend Repository (Group 3):**  
  https://github.com/chartchai-class/953331-2026-component-based-software-dev-project-2-group-3
- **Frontend Local Dev:** `http://localhost:5173`
- **Backend API Base URL:** `http://localhost:8080/api`

---

## Test Accounts & Credentials

The system connects to the Spring Boot backend with seeded test users and full JWT authentication:

| Role | Username | Password | Level | Description |
| :--- | :--- | :--- | :---: | :--- |
| **Admin** | `admin` | `admin123` | Level 4 | Access to both admin portal (`/admin`) and user portal |
| **User 1** | `user1` | `user123` | Level 1 | Explorer tier; eligible for Level 1 -> 2 certification exam |
| **User 2** | `user2` | `user123` | Level 2 | Achiever tier; eligible for Level 2 -> 3 certification exam |
| **User 3** | `user3` | `user123` | Level 3 | Innovator tier; eligible for Level 3 -> 4 certification exam |
| **User 4** | `user4` | `user123` | Level 4 | Master tier; highest level achieved |

*Note: Seeded student accounts `user1` through `user32` all use password `user123`.*  
*You can also register a new user on `/register`, which starts at Level 1.*

---

## Tech Stack

- **Frontend Framework:** Vue 3 (Composition API, `<script setup lang="ts">`)
- **Build Tool:** Vite
- **Language:** TypeScript
- **State Management:** Pinia
- **Styling:** Tailwind CSS v4
- **Routing:** Vue Router (with auth and role guards)
- **HTTP Client:** Axios (configured with JWT interceptors in `src/services/apiClient.ts`)

---

## Project Setup & Running

### Prerequisites
- Node.js 22.x or 24.x
- npm 10.x+
- Running Spring Boot backend on `http://localhost:8080`

### 1. Clone & Install
```bash
git clone https://github.com/chartchai-class/953331-2026-component-based-software-dev-project2-frontend-group-14.git
cd 953331-2026-component-based-software-dev-project2-frontend-group-14/frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build & Type Check
```bash
# Type check TypeScript
npm run type-check

# Production build
npm run build

# Preview build locally
npm run preview
```

---

## System Overview & Key Features

### 1. User Portal (`/dashboard`)
- **Authentication:** Real backend JWT login and registration with validation and error feedback.
- **Profile & Passport:** View current level, earned badges, exam history, and eligible campus services.
- **Profile Edit:** Update first name, last name, province, and profile picture.
- **Examination Engine (`/exam`):**
  - Fetches level-specific questions and pass criteria directly from backend (`GET /api/me/exam`).
  - Real-time question progress, answer selection, and submission (`POST /api/me/exam/submit`).
  - Automatic level upgrade and exam history logging on pass.
- **e-Learning (`/dashboard/elearning`):** Video course viewer linked to curriculum topics.
- **Campus Services (`/dashboard/services`):** Dynamic display of active campus privileges and facilities unlocked for the user's tier.
- **Badges Gallery (`/dashboard/badges`):** Visual display of progression badges (Explorer, Achiever, Innovator, Master).

### 2. Admin Portal (`/admin`)
- **User Directory:** Paginated user list with live search, level filtering, and province filtering. Toggle user active/deactivated state in real time.
- **User Detail & Edit (`/admin/users/:id`):** View user details, inspection of exam attempts, and editing user profiles with avatar upload.
- **Criteria of Levels (`/admin/levels`):** Overview of all 4 certification tiers, pass criteria, and campus privileges.
- **Exam Management (`/admin/questions`):** Manage exam questions across all 4 levels (Level 1, 2, 3, and 4) with create, edit, and delete support.
