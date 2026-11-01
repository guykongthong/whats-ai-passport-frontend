# Frontend Development Log
Project: The CA?T Passport (SE331 Project 2)
Repository: chartchai-class/953331-2026-component-based-software-dev-project2-frontend-group-14

This document tracks work progress, branch references, and implementation notes across project issues.

---

## Issue Status Summary

| Issue ID | Branch | Status | Files Changed | Verification |
|---|---|---|---|---|
| FE-ADMIN-01 | 1-fe-admin-01-define-typescript-interfaces-and-dtos-for-admin-features | Completed | frontend/src/types/admin.ts, frontend/src/types/index.ts | vue-tsc --build, vite build |
| FE-ADMIN-02 | feat/2-fe-admin-02-implement-admin-api-services-with-axios-client | Completed | frontend/src/services/apiClient.ts, AdminUserService.ts, AdminLevelService.ts, AdminQuestionService.ts, index.ts | vue-tsc --build, vite build, eslint |
| FE-ADMIN-03 | 3-fe-admin-03-build-admin-dashboard-shell-and-responsive-sidebar | In Review (PR #50) | frontend/src/components/admin/AdminSidebar.vue, frontend/src/views/admin/AdminLayoutView.vue | vue-tsc --build, vite build, eslint |
| FE-ADMIN-04 | feat/4-fe-admin-04-setup-role-based-navigation-guard-for-admin-routes | Completed | frontend/src/router/index.ts, frontend/src/router.ts, frontend/src/composables/useToast.ts, frontend/src/shared/components/UserPageLayout.vue | vue-tsc --build, vite build, eslint |
| FE-USER-02 | feat/28-fe-user-02-implement-user-api-services-with-axios-client | In Review (PR #49) | frontend/src/services/apiClient.ts, UserService.ts, ELearningService.ts, ExamService.ts, index.ts | vue-tsc --build, vite build |
| FE-USER-03 | feat/29-fe-user-03-build-registration-page-with-veevalidateyup-and-initial-level-1-setup | Completed | frontend/src/auth/components/RegisterForm.vue, RegisterPage.vue, LoginView.vue, registerSchema.ts, authStore.ts, User.ts | vue-tsc --build, vite build, eslint |
| FE-USER-04 | feat/0-fe-user-04-integrate-cloud-storage-image-upload-into-registration-form | Completed | frontend/src/services/FileService.ts, frontend/src/components/common/ImageUpload.vue, frontend/src/auth/components/RegisterForm.vue, RegisterPage.vue, authStore.ts | vue-tsc --build, vite build, eslint |
| FE-USER-06 | feat/31-fe-user-06-build-top-right-user-profile-header-area-with-avatar-and-name | Completed | frontend/src/components/user/UserNavbarProfile.vue, frontend/src/shared/components/NavBar.vue, frontend/src/router/index.ts | vue-tsc --build, vite build, eslint |
| FE-USER-09 | feat/33-fe-user-09-implement-instant-reactive-level-and-benefits-update-without-re-login | Completed | frontend/src/stores/user.ts, frontend/src/stores/authStore.ts, frontend/src/stores/examStore.ts, frontend/src/views/user/UserHomeView.vue, frontend/src/user/views/ExamPage.vue, frontend/src/router/index.ts | vue-tsc --build, vite build, eslint |
| FE-USER-10 | feat/34-fe-user-10-setup-user-profile-layout-with-4-nested-sub-routes | Completed | frontend/src/views/user/profile/ProfileLayoutView.vue, tabs/, router/index.ts, user.ts, UserService.ts | vue-tsc --build, vite build, eslint |
| FE-USER-11 | feat/35-fe-user-11-sub-route-1-user-details-view-and-self-edit-using-reusable-form | Completed | frontend/src/views/user/profile/tabs/MyDetailsTab.vue, frontend/src/shared/components/UserEditForm.vue, frontend/src/views/admin/user-detail/UserEditTab.vue, frontend/src/stores/user.ts | vue-tsc --build, vite build, eslint |
| FE-USER-12 | feat/35-fe-user-11-sub-route-1-user-details-view-and-self-edit-using-reusable-form | Completed | frontend/src/views/user/profile/tabs/ExamHistoryTab.vue, frontend/src/views/user/profile/ProfileLayoutView.vue, frontend/src/views/user/profile/tabs/ProfileBadgesTab.vue, frontend/src/views/user/profile/tabs/ProfileServicesTab.vue, frontend/src/router/index.ts | vue-tsc --build, vite build, eslint |
| FE-USER-13 | feat/37-fe-user-13-sub-route-3-unlocked-badges-gallery-and-level-progression-showcase | Completed | frontend/src/views/user/profile/tabs/BadgesTab.vue, frontend/src/router/index.ts | vue-tsc --build, vite build, eslint |
| FE-USER-14 | feat/37-fe-user-13-sub-route-3-unlocked-badges-gallery-and-level-progression-showcase | Completed | frontend/src/views/user/profile/tabs/AvailableServicesTab.vue, frontend/src/router/index.ts | vue-tsc --build, vite build, eslint |
| FE-ADMIN-25 | feat/74-fe-admin-25refactor-modernize-and-polish-the-admin-portal-interface-across-exam-question-management | Completed | frontend/src/shared/components/NavBar.vue, frontend/src/components/user/UserNavbarProfile.vue, frontend/src/views/admin/AdminUserListView.vue, frontend/src/views/admin/user-detail/UserDetailLayout.vue, frontend/src/views/admin/elearning/AdminElearningView.vue | vue-tsc --build, vite build, eslint |

---

## Implementation Details

### FE-ADMIN-01: Define TypeScript Interfaces and DTOs for Admin Features

- Date: 2026-10-22
- Branch: `1-fe-admin-01-define-typescript-interfaces-and-dtos-for-admin-features`
- Status: Completed

Summary:
Defined TypeScript interfaces in `frontend/src/types/admin.ts` to match backend Spring Boot entities and DTOs (`_user`, `level`, `question`, and `exam_attempt`):
- `AdminUser`: user account fields (`id`, `username`, `firstname`, `lastname`, `email`, `province`, `profileImageUrl`, `currentLevel`, `enabled`, `roles`).
- `LevelAdmin`: level settings (`id`, `levelNumber`, `name`, `passCriteria`, `benefits`, `services`, `badge`).
- `QuestionAdmin`: multiple-choice questions (`id`, `levelNumber`, `questionText`, `choices`, `correctAnswer`).
- `ExamHistoryItem`: exam submission history (`id`, `levelNumber`, `score`, `totalScore`, `passed`, `attemptDateTime`, `badgeName`).

Barrel Export:
- Re-exported all admin types through `frontend/src/types/index.ts` so components and services can import from `@/types` or `@/types/admin`.

Testing:
- Checked types with `npx vue-tsc --build` and ran `npm run build`. Build passed with 0 errors.

### FE-ADMIN-02: Implement Admin API Services with Axios Client

- Date: 2026-10-23
- Branch: `feat/2-fe-admin-02-implement-admin-api-services-with-axios-client`
- Status: Completed

Summary:
Implemented Axios API client and dedicated service modules for admin operations against the Spring Boot backend:
- `apiClient.ts`: Configured central Axios instance with base URL fallback (`http://localhost:8080/api`) and a request interceptor that automatically attaches `Authorization: Bearer <token>` from localStorage.
- `AdminUserService.ts`:
  - `getUsers(page, pageSize, filters)`: fetch paginated users with typed `AdminUserFilters` search/filter params.
  - `getUserById(id)`: fetch single user detail by ID.
  - `updateUser(id, data)`: update user fields using `Partial<AdminUser>`.
  - `toggleUserStatus(id, enabled)`: enable or disable a user account.
- `AdminLevelService.ts`:
  - `getLevels()`: fetch all progression levels.
  - `getLevel(levelNumber)`: fetch detail for a specific level.
  - `updateLevel(levelNumber, data)`: update passing criteria, benefits, or services using `Partial<LevelAdmin>`.
- `AdminQuestionService.ts`:
  - `getQuestionsByLevel(levelNumber)`: fetch question bank by level.
  - `createQuestion(data)`: add new multiple-choice question using `CreateQuestionPayload` (`Omit<QuestionAdmin, 'id'>`).
  - `updateQuestion(id, data)`: update question using `Partial<QuestionAdmin>`.
  - `deleteQuestion(id)`: delete question by ID.
- `services/index.ts`: Exported all services and client for clean imports (`@/services`).

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`).
- Ran `npm run build-only` and `npm run lint`. All passed with 0 warnings and 0 errors.

### FE-USER-02: Implement User API Services with Axios Client

- Date: 2026-10-24
- Branch: `feat/28-fe-user-02-implement-user-api-services-with-axios-client`
- Status: In Review (PR #49)

Summary:
Created API services for user-facing features using a shared Axios client:
- `apiClient.ts`: Axios instance with `baseURL` from `VITE_API_URL` and a request interceptor that attaches `Authorization: Bearer <token>` from `localStorage`.
- `UserService.ts`: `getUserProfile()` (GET `/api/v1/user/me`), `updateUserProfile()` (PUT `/api/v1/user/me`), `getUserLevelDetails()` (GET `/api/v1/user/me/level-details`).
- `ELearningService.ts`: `getCurrentLevelVideos()` (GET `/api/v1/elearning/current-level`).
- `ExamService.ts`: `getExamQuestions()` (GET `/api/v1/exam/questions`), `submitExam()` (POST `/api/v1/exam/submit`).
- `index.ts`: barrel export for all services.

Known Follow-up:
- Some types are declared locally in services (`UserProfile`, `UserLevelDetails`, `ExamSubmissionPayload`, `ExamAnswer`) because FE-USER-01 (#27) is not yet merged into `dev`. After #27 is merged, switch to importing from `@/types` and update return types to `ExamResultResponse` / `ELearningContent`.

Testing:
- Checked types with `npx vue-tsc --build` and ran `npm run build`. Build passed with 0 errors.

### FE-ADMIN-04: Setup Role-Based Navigation Guard for Admin Routes

- Date: 2026-10-26
- Branch: `feat/4-fe-admin-04-setup-role-based-navigation-guard-for-admin-routes`
- Status: Completed

Summary:
Configured route-level metadata and global navigation guards in Vue Router to restrict admin access:
- `router/index.ts` & `router.ts`: Added `meta: { requiresAuth: true, requiresAdmin: true }` across all `/admin` routes and child routes (`/admin/users/:id/info`, `history`, `edit`, `/admin/levels`, `/admin/exams`). Added route aliases `/login-view`, `/admin/users`, `/admin/questions`.
- Navigation Guards (`router.beforeEach`):
  - Unauthenticated access to protected routes redirects to `login` (with query `redirect`).
  - Authenticated non-admin access (lacking `ROLE_ADMIN` / `admin` role) is redirected to user dashboard (`/dashboard?error=unauthorized`) with an unauthorized toast notification.
  - Deactivated accounts (`enabled === false` or `isActive === false`) are blocked from navigating and logging in, forcing immediate logout.
- Toast feedback: Configured global singleton toast state in `useToast.ts` and integrated toast display in `UserPageLayout.vue` and `MyProfilePage.vue`.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`).
- Ran `npm run build-only` and `npm run lint`. All passed with 0 warnings and 0 errors.
### FE-USER-03: Build Registration Page with Vee-Validate/Yup and Initial Level 1 Setup

- Date: 2026-10-26
- Branch: `feat/29-fe-user-03-build-registration-page-with-veevalidateyup-and-initial-level-1-setup`
- Status: Completed

Summary:
- Form & API Contract Alignment:
  - Aligned registration payload shape with backend `POST /auth/register` contract (`username`, `password`, `firstname`, `lastname`, `email`, `province`, `profileImageUrl`).
  - Removed Thai name fields (`nameTh`, `surnameTh`) from the form and registration flow.
- Schema Validation (Vee-Validate & Yup):
  - Created `registerSchema` and `step1Schema` using `yup` and `@vee-validate/yup`.
  - Added real-time inline errors and form validation for `username` (min 4 chars), `password` (min 6 chars), `confirmPassword` (matches password), `firstname`, `lastname`, `province`, `profileImageUrl` (URL validation), and `email`.
  - Step 1 validates profile details before advancing to step 2; step 2 validates credentials on submit.
- User Store & Progression Setup:
  - Updated `authStore.register()` to accept `RegisterPayload`.
  - Automatically initializes new users at `level: '1'`, `role: 'user'`, and `isActive: true`.
  - Allowed login by username in addition to email.
- UI & Feedback:
  - Displayed inline error messages for each field and `AlertBox` for submission error alerts.
  - Added redirect to `/login?registered=true` after registration with toast notification ("Registration successful! Please log in.").

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`).
- Built production bundle with `npm run build-only`.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 errors and 0 warnings.

### FE-USER-04: Integrate Cloud Storage Image Upload into Registration Form

- Date: 2026-10-27
- Branch: `feat/0-fe-user-04-integrate-cloud-storage-image-upload-into-registration-form`
- Status: Completed

Summary:
Integrated cloud image uploading into the user registration flow so profile pictures are uploaded directly to the backend storage endpoint prior to registration (Criteria #3):
- `FileService.ts`: Added `uploadImage(file: File)` service executing `POST /files/upload` with `multipart/form-data` payload (`file` field), returning `{ url: string }`. Public endpoint accessible without authentication.
- `ImageUpload.vue`: Built reusable upload component with file picker, drag-and-drop support, file format/size validation (PNG, JPG, WEBP up to 5MB), upload spinner, live preview thumbnail, and replace/remove actions.
- Form Integration (`RegisterForm.vue` & `RegisterPage.vue`): Embedded `ImageUpload` component in Step 1 of the registration wizard, binding the uploaded public image URL to `profileImageUrl`. Updated step 1 validation to ensure profile picture upload.
- State Persistence (`authStore.ts`): Stored `profileImageUrl` in the new user record upon successful registration.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`).
- Built production bundle with `npm run build-only`.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 errors and 0 warnings.

### FE-USER-06: Build Top-Right User Profile Header Area with Avatar and Name

- Date: 2026-10-27
- Branch: `feat/31-fe-user-06-build-top-right-user-profile-header-area-with-avatar-and-name`
- Status: Completed

Summary:
Implemented the top-right user profile header area displaying the user's avatar, name, and current level badge with an interactive dropdown menu across all user pages (Criteria #21):
- `UserNavbarProfile.vue`: Built the header profile component:
  - Circular avatar using `currentUser.profileImageUrl` with fallback to user initials / SVG icon on error or missing image.
  - User's full name (`firstname lastname` or `name surname`) with responsive truncation.
  - Current Level badge pill (e.g., "Level 2") styled with dynamic level-based colors.
  - Interactive dropdown menu containing direct navigation links:
    - "My Profile" (`/profile`)
    - "eLearning" (`/elearning`)
    - "Take Exam" (`/exam`)
    - "Admin Dashboard" (`/admin`) for users with administrative roles
    - "Log out" button calling `authStore.logout()` and redirecting to `/login`
  - Click-outside event listener to automatically dismiss the dropdown.
  - Mobile-responsive layout that gracefully collapses full name to compact avatar and level badge on small screens.
- `NavBar.vue`: Integrated `UserNavbarProfile` in the top-right header area, rendering whenever `currentUser` is logged in, replacing the legacy placeholder.
- `router/index.ts`: Added route aliases for `/profile`, `/elearning`, and `/exam` ensuring seamless navigation from the dropdown menu.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`). All passed with 0 errors.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 warnings and 0 errors.
- Built production bundle with `npm run build-only` (`vite build`). All passed.

### FE-USER-09: Implement Instant Reactive Level and Benefits Update without Re-login

- Date: 2026-10-28
- Branch: `feat/33-fe-user-09-implement-instant-reactive-level-and-benefits-update-without-re-login`
- Status: Completed
- Closes: #33 (Criteria #19)

Summary:
Implemented immediate, real-time reactive updates for the user's level, benefits, and services upon passing an upgrade exam without requiring page reload or re-login:
- Store Implementation (`src/stores/user.ts` & `src/stores/authStore.ts`):
  - Maintained reactive states `currentUserLevel: computed<number>` and `currentLevelDetails: ref<UserLevelDetails | null>` in `useUserStore`.
  - Added action `upgradeUserLevel(newLevel: number)` that:
    - Immediately updates the Pinia state (`currentUserLevel`, `currentUser.level`, and active user in `users` list) for instant UI reactivity.
    - Updates `currentLevelDetails` immediately with fallback details and re-fetches `UserService.getUserLevelDetails()` in the background to sync with the backend.
    - Persists the updated user profile into `localStorage` cache (`currentUser`).
  - Added `fetchLevelDetails()` to retrieve level details on component mount with graceful fallback to `levelStore` when offline.
- Exam Flow Integration (`src/stores/examStore.ts` & `src/user/views/ExamPage.vue`):
  - In `submitExam()`, when an exam is passed (`pass && !alreadyPassed`), triggered `userStore.upgradeUserLevel(nextLevel)` alongside `authStore.levelUp()`.
  - Updated `ExamPage.vue` to check promotion status using reactive `userStore.currentUserLevel`, presenting a congratulations toast notification upon level upgrade.
- View Reactivity (`src/views/user/UserHomeView.vue` & `src/router/index.ts`):
  - Created `UserHomeView.vue` connected directly to computed Pinia getters (`currentLevel`, `levelDetails`, `currentBenefits`, `activeServices`).
  - Upon exam pass, all computed properties automatically re-evaluate, dynamically re-rendering the Hero Banner progress bar, next milestone indicator, Active Benefits card, and Available Services card with 0ms delay.
  - Configured router to map `/dashboard` (and alias `/home`) directly to `UserHomeView.vue`.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`). All passed with 0 errors.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 warnings and 0 errors.
- Built production bundle with `npm run build-only` (`vite build`). All passed.

### FE-USER-10: Setup User Profile Layout with 4 Nested Sub-routes

- Date: 2026-10-29
- Branch: `feat/34-fe-user-10-setup-user-profile-layout-with-4-nested-sub-routes`
- Status: Completed
- Closes: #34 (Criteria #22, Score 4)

Summary:
Configured nested routes and shared layout for the User Profile section covering User Details, Exam History, Badges, and Available Services:
- Store & Service Layer (`src/services/UserService.ts` & `src/stores/user.ts`):
  - Updated `UserProfile` interface to adhere strictly to the Baseline API Contract (`GET /me`, `PUT /me`).
  - Added reactive `userProfile` state and computed getters `badges`, `examHistories`, and `availableServices` with offline fallback.
  - Implemented single-fetch action `fetchUserProfile(force = false)` in `useUserStore` to share user profile state across all 4 nested sub-routes without redundant network requests on tab switching.
  - Implemented `updateUserProfile(data)` action to persist profile edits and sync local auth state.
- Tab Views (`src/views/user/profile/tabs/`):
  - `ProfileDetailsTab.vue`: Personal info display and edit form with input validation and instant reactivity.
  - `ProfileHistoryTab.vue`: Certification exam attempt records, scores, status badges, and timestamp formatting.
  - `ProfileBadgesTab.vue`: Unlocked digital skill credentials grid with level milestone metadata and verified badge indicator.
  - `ProfileServicesTab.vue`: Catalog of institutional campus services unlocked by certified level tier.
- Shared Profile Layout & Router Integration (`src/views/user/profile/ProfileLayoutView.vue` & `src/router/index.ts`):
  - Created `ProfileLayoutView.vue` featuring a shared header card with profile image/initials, full name, email, province, and dynamic level badge.
  - Implemented 4-item navigation tab bar with active indicator and smooth `<RouterView />` transitions (`tab-fade`).
  - Configured nested route tree in `src/router/index.ts` under `/profile` (`/profile/details`, `/profile/history`, `/profile/badges`, `/profile/services`, and redirect `/profile` -> `/profile/details`).
  - Cleaned up redundant route declarations and preserved aliases for backward compatibility.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`). All passed with 0 errors.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 warnings and 0 errors.
- Built production bundle with `npm run build-only` (`vite build`). All passed.

### FE-USER-11: Sub-route 1 - User Details View and Self-Edit using Reusable Form

- Date: 2026-10-30
- Branch: `feat/35-fe-user-11-sub-route-1-user-details-view-and-self-edit-using-reusable-form`
- Status: Completed
- Closes: #35 (Criteria #24)

Summary:
Developed the user profile details sub-route (`/profile/details`) allowing users to inspect and update their personal details using a shared, reusable form component:
- Component Reusability (`src/shared/components/UserEditForm.vue` & `src/views/admin/user-detail/UserEditTab.vue`):
  - Created a single reusable form component `UserEditForm.vue` that serves both User Self-Edit (`MyDetailsTab.vue`) and Admin User Edit (`UserEditTab.vue`).
  - Supports configurable themes: `theme="light"` for the User Profile card and `theme="dark"` for the Admin glassmorphism panel.
  - Supports `disableEmail: boolean`: In User Profile mode, email is read-only according to the Baseline API Contract (`PUT /me` request body only accepts `firstname`, `lastname`, `province`, `profileImageUrl`), while in Admin mode email remains editable.
  - Form validation for required fields, whitespace trimming, and email pattern.
- User Self-Edit View (`src/views/user/profile/tabs/MyDetailsTab.vue`):
  - Renders personal information with account status pill and loading skeleton.
  - Passes current user profile as `initialData` into `UserEditForm`.
  - Dispatches `userStore.updateUserProfile(payload)` on submit, sending exact payload to `PUT /me`.
  - Updates both `userStore.userProfile` and `authStore.currentUser` upon success so changes persist across route transitions and reloads.
  - Provides dismissible success toast and error alerts.
- Store & Service Alignment (`src/stores/user.ts` & `src/services/UserService.ts`):
  - Added single-fetch profile caching action `fetchUserProfile()` to prevent redundant requests across tab navigation.
  - Added action `updateUserProfile(data)` syncing both backend and client Pinia states.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`). All passed with 0 errors.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 warnings and 0 errors.
- Built production bundle with `npm run build-only` (`vite build`). All passed.

### FE-USER-12: Sub-route 2 - User Exam History Records and Attempts Table

- Date: 2026-10-30
- Branch: `feat/35-fe-user-11-sub-route-1-user-details-view-and-self-edit-using-reusable-form`
- Status: Completed
- Closes: #36

Summary:
Developed the examination history and achievements sub-route (`/profile/history`):
- Exam History Records View (`src/views/user/profile/tabs/ExamHistoryTab.vue`):
  - Displays all user examination attempts in reverse-chronological order (newest first).
  - Matches the Baseline API Contract data structure (`examHistories` array in `GET /me`):
    - Level examined with level name and distinctive color badge (`Level X: {Name} Exam`).
    - Attempt Date and Time formatted cleanly.
    - Score achieved vs total score with percentage display (`score / totalScore`).
    - Progression result pill: `PASSED` (emerald badge) or `FAILED` (rose badge).
    - Unlocked badge notification pill if a badge was awarded on that attempt.
  - Showcase section for all unlocked badges with badge images, names, and unlock dates.
  - Empty state with educational copy and a "Take Level Exam" CTA button when no attempts exist.
- Shared Profile Shell & Nested Sub-routes (`src/views/user/profile/ProfileLayoutView.vue` & `src/router/index.ts`):
  - Created `ProfileLayoutView.vue` with shared gradient header card displaying user avatar (or initials fallback), full name, level badge, email, province, and quick statistics counters (Badges, Exams Taken, Available Services).
  - Navigation tab bar providing smooth switching between:
    - `/profile/details` (`MyDetailsTab.vue`)
    - `/profile/history` (`ExamHistoryTab.vue`)
    - `/profile/badges` (`ProfileBadgesTab.vue`)
    - `/profile/services` (`ProfileServicesTab.vue`)
  - Redirects `/profile` to `/profile/details` automatically.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`). All passed with 0 errors.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 warnings and 0 errors.
- Built production bundle with `npm run build-only` (`vite build`). All passed.

### FE-USER-13: Sub-route 3 - Unlocked Badges Gallery and Level Progression Showcase

- Date: 2026-10-30
- Branch: `feat/37-fe-user-13-sub-route-3-unlocked-badges-gallery-and-level-progression-showcase`
- Status: Completed
- Closes: #37 (Criteria #21, Score 4)

Summary:
Developed the Certification & Badges sub-page showcasing earned and upcoming credentials corresponding to level progression:
- Badges Gallery View (`src/views/user/profile/tabs/BadgesTab.vue`):
  - Renders a 4-level credential matrix (Explorer, Achiever, Innovator, Master) tailored to a digital passport aesthetic.
  - **Unlocked Badges:** Displays full-color emblems, level tags, official badge titles, competency descriptions, unlock timestamps, and verified credential tags.
  - **Locked Badges:** Grayscale styling with lock overlay icons and explicit unlock criteria ("Pass Level X exam to unlock").
  - **Interactive Badge Details Modal:** Clicking any badge opens an in-depth modal featuring the official credential overview, required passing criteria percentage, unlock status, timestamp, and a direct CTA ("Go to Exam") if locked.
- Routing & Navigation (`src/router/index.ts`):
  - Wired `/profile/badges` directly to `BadgesTab.vue` under the nested `/profile` route hierarchy.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`). All passed with 0 errors.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 warnings and 0 errors.
- Built production bundle with `npm run build-only` (`vite build`). All passed.

### FE-USER-14: Sub-route 4 - Available Services Catalog for Current Level

- Date: 2026-10-30
- Branch: `feat/37-fe-user-13-sub-route-3-unlocked-badges-gallery-and-level-progression-showcase`
- Status: Completed
- Closes: #38 (Criteria #22, Score 4)

Summary:
Developed the Available Services Catalog sub-page detailing campus facilities, digital perks, and specialized workshops:
- Available Services View (`src/views/user/profile/tabs/AvailableServicesTab.vue`):
  - Displays all active services accessible at the user's current certified tier (cumulative up to current level).
  - Each service card highlights the service title, comprehensive description, tier color code, access tag (e.g. "Level 1 Access", "Level 2 Exclusive"), and active status pill ("Active & Available").
  - **Next Level Services Preview:** Previews upcoming services unlocked upon reaching the next level with lock indicator pills, requirement notices ("Pass Level X Exam to Unlock"), and direct examination action links.
  - **Master Level Banner:** Displays an all-access completion notice when reaching Level 4.
- Routing & Navigation (`src/router/index.ts`):
  - Wired `/profile/services` directly to `AvailableServicesTab.vue` under the nested `/profile` route hierarchy.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`). All passed with 0 errors.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 warnings and 0 errors.
- Built production bundle with `npm run build-only` (`vite build`). All passed.


| FE-USER-15 | feat/39-fe-user-15-build-elearning-video-player-page-matching-users-current-level | Completed | frontend/src/views/user/elearning/ElearningView.vue, frontend/src/router/index.ts | vue-tsc --build, vite build, eslint |
| FE-USER-16 | feat/39-fe-user-15-build-elearning-video-player-page-matching-users-current-level | Completed | frontend/src/views/user/elearning/ElearningView.vue | vue-tsc --build, vite build, eslint |
| FE-USER-17 | feat/39-fe-user-15-build-elearning-video-player-page-matching-users-current-level | Completed | frontend/src/views/user/exam/ExamTakingView.vue, frontend/src/router/index.ts | vue-tsc --build, vite build, eslint |

---

### FE-USER-15: Build eLearning Video Player Page Matching User's Current Level

- Date: 2026-10-30
- Branch: `feat/39-fe-user-15-build-elearning-video-player-page-matching-users-current-level`
- Status: Completed
- Closes: #39

Summary:
Developed the eLearning curriculum view (`src/views/user/elearning/ElearningView.vue`):
- Responsive Video Player (16:9 Aspect Ratio) supporting automatic URL transformations:
  - YouTube standard and short links (`youtu.be`, `youtube.com/watch`) converted dynamically to privacy-enhanced embed frames (`youtube-nocookie.com/embed`).
  - Direct HTML5 videos (`.mp4`, `.webm`, `.ogg`) using `<video controls>`.
  - Fallback cards for external lecture resources with a direct open button.
- Active Lesson Metadata Details:
  - Lesson index pill, current level indicator badge with thematic level colors.
  - Title and detailed lesson descriptions.
- Course Outline Playlist Sidebar:
  - Interactive playlist displaying all lessons for the user's level.
  - Active lesson indicator with playing icon and quick selection handlers.
- Integrated `ELearningService.getCurrentLevelVideos()` (`GET /me/videos`) following the Baseline API Contract.

### FE-USER-16: Implement Dynamic eLearning Content Transition upon Level Upgrade

- Date: 2026-10-30
- Branch: `feat/39-fe-user-15-build-elearning-video-player-page-matching-users-current-level`
- Status: Completed
- Closes: #40

Summary:
Enhanced `ElearningView.vue` with automated level transition capabilities:
- Dynamic Watcher on `userStore.currentUserLevel`: Automatically detects when the user's level changes (e.g. after passing an advancement exam) and triggers an immediate curriculum reload without requiring a manual page refresh.
- Level Upgrade Notification Banner: Displays a dismissible feedback banner welcoming the user to the newly unlocked curriculum tier.
- Level 4 Master / Completion State:
  - In accordance with the Baseline API Contract (where Level 4 is the top tier with no subsequent exam), the Call-To-Action banner dynamically switches to a celebratory Platinum completion banner.
  - Links directly to `/profile` and `/profile/badges` to view earned credentials.

### FE-USER-17: Build Exam Taking View and Fetch Level-Matched Questions

- Date: 2026-10-30
- Branch: `feat/39-fe-user-15-build-elearning-video-player-page-matching-users-current-level`
- Status: Completed
- Closes: #41

Summary:
Built the complete examination interface in `src/views/user/exam/ExamTakingView.vue`:
- Exam Instructions & Guidelines Header:
  - Displays target level (`targetLevelNumber = currentLevel + 1`), total questions, and passing score criteria (`passCriteria`).
  - Gracefully renders a "Maximum Level Reached" state if the user is already Level 4.
- Question Cards & Multiple-Choice Selector:
  - Formats choices A, B, C, D as interactive buttons with active selection states and radio indicators.
  - Answer Progress Bar tracking completed vs remaining questions in real-time.
  - Question Jump Navigator allowing direct navigation to any question with answered/unanswered color codes.
- Sticky Action Bar & Validation:
  - Floating submission bar with answered counter.
  - Prevents premature submission with validation warning banners and auto-scrolls to the first unanswered question.
- API Submission & Result Feedback (`POST /me/exam/submit`):
  - Submits answers with 0-based `selectedChoice` indices matching the Baseline API Contract.
  - Displays a comprehensive results modal with score, pass criteria, and unlocked badge card (`badgeUnlocked`).
  - Immediately updates `userStore.currentUserLevel` upon passing so the entire app reflects the promotion immediately.
  - Configured router entries for `/elearning` and `/exam` in `src/router/index.ts`.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`). All passed with 0 errors.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 warnings and 0 errors.
- Built production bundle with `npm run build-only` (`vite build`). All passed.


| FE-USER-18 | feat/42-fe-user-18-implement-exam-completion-validation-to-block-incomplete-submission | Completed | frontend/src/views/user/exam/ExamTakingView.vue | vue-tsc --build, vite build, eslint |
| FE-USER-19 | feat/42-fe-user-18-implement-exam-completion-validation-to-block-incomplete-submission | Completed | frontend/src/views/user/exam/ExamTakingView.vue, frontend/src/components/user/ExamResultModal.vue | vue-tsc --build, vite build, eslint |

---

### FE-USER-18: Implement Exam Completion Validation to Block Incomplete Submission

- Date: 2026-10-30
- Branch: `feat/42-fe-user-18-implement-exam-completion-validation-to-block-incomplete-submission`
- Status: Completed
- Closes: #42

Summary:
Enforced strict exam completion validation in `src/views/user/exam/ExamTakingView.vue` to prevent incomplete submissions (Criteria #25):
- Created computed property `isExamComplete` verifying that `answeredCount === questions.length`.
- Submit Button State Management & Visual Indicator:
  - Dynamically disabled when incomplete with slate grey tones, distinct lock icon, and `cursor-not-allowed`.
  - Added hover tooltip: `"Please answer all questions before submitting (X/Y completed)"` with exact answered vs total counters.
- Unanswered Question Counter Badge:
  - Integrated a pulsing red counter pill at the top-right corner of the bottom action bar's counter displaying `remainingCount`.
  - Added an "Incomplete" warning chip adjacent to the remaining count text.
- Form Validation & Error Highlight:
  - Attempting to submit while incomplete flags unanswered questions with prominent red borders, red background accents, and `"Required"` status chips.
  - Automatically scrolls to the first unanswered question to guide user focus.

### FE-USER-19: Implement Exam Submission, Result Modal, and Instant Level Upgrade

- Date: 2026-10-30
- Branch: `feat/42-fe-user-18-implement-exam-completion-validation-to-block-incomplete-submission`
- Status: Completed
- Closes: #43

Summary:
Engineered the complete exam evaluation and instant progression workflow:
- Created Reusable Modal Component (`src/components/user/ExamResultModal.vue`):
  - Score Breakdown: Clearly displays user score and pass criteria (e.g. `Score: 4 / 5 - Pass Criteria: 3`).
  - Result Status Headline: Shows emerald `"CONGRATULATIONS! YOU PASSED"` or ruby `"NOT PASSED"`.
  - Celebration Effects: Dynamic CSS confetti particle explosion upon passing.
  - Unlocked Badge Showcase: Detailed card previewing the earned badge image, badge title, and achievement status.
  - Action Navigation:
    - If Passed: Direct shortcuts to `"Go to Dashboard"` (`/dashboard`) and `"View New Benefits"` (`/profile/services`).
    - If Failed: Friendly encouraging message with `"Try Again"` (resets exam) and `"Review eLearning"` (`/elearning`).
- Instant Reactive Progression Synchronization:
  - Invokes `userStore.upgradeUserLevel(result.newLevel)` immediately upon passing.
  - Refreshes Pinia store state, `authStore.currentUser.level`, and cached profile without requiring a page reload or re-login.
  - Submits 0-based answer indices matching Baseline API Contract `POST /me/exam/submit`.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`). All passed with 0 errors.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 warnings and 0 errors.
- Built production bundle with `npm run build-only` (`vite build`). All passed.


| FE-USER-20 | feat/44-fe-user-20-verify-exam-attempt-history-recording-and-badge-unlocking | Completed | frontend/src/views/user/exam/ExamTakingView.vue, frontend/src/stores/user.ts, frontend/src/components/user/ExamResultModal.vue, frontend/src/views/user/profile/tabs/ExamHistoryTab.vue, frontend/src/views/user/profile/tabs/BadgesTab.vue | vue-tsc --build, vite build, eslint |

---

### FE-USER-20: Verify Exam Attempt History Recording and Badge Unlocking

- Date: 2026-10-30
- Branch: `feat/44-fe-user-20-verify-exam-attempt-history-recording-and-badge-unlocking`
- Status: Completed
- Closes: #44

Summary:
Verified and enhanced the exam attempt history recording and badge unlocking pipeline:
- History Recording Action in User Store (`src/stores/user.ts`):
  - Added `recordExamAttempt(attempt, badgeUnlocked)` to store action suite.
  - Automatically unshifts new attempt records (with `levelNumber`, `score`, `totalScore`, `passed`, `attemptDateTime`, and `badgeName`) into `userProfile.examHistories` and syncs with `examStore.records`.
  - Supports both passed and failed attempts so user history remains fully auditable.
- Unlocked Badge Synchronization:
  - If an examination is passed, adds newly unlocked badge details to `userProfile.badges` immediately.
  - Reflects the newly earned badge instantly in the Badges Gallery (`/profile/badges`) without requiring re-login.
- Result Modal Direct Shortcuts & UI Cleanliness (`src/components/user/ExamResultModal.vue`):
  - Added direct navigation button to `"Exam History"` (`/profile/history`) on both pass and fail result views.
  - Purged all emojis across all User-facing UI pages and replaced them with accessible SVG icon components (`TrophyIcon.vue`, `BadgeMedalIcon.vue`, `DocumentTextIcon.vue`, `CheckCircleIcon.vue`, `LockIcon.vue`).
- Complete User UI Emoji Replacement:
  - Replaced all emojis in `UserHomeView.vue`, `ElearningView.vue`, `UserHeroBanner.vue`, `ExamResultModal.vue`, `BadgesTab.vue`, and `AvailableServicesTab.vue` with dedicated SVG icon components.
  - Verified 0 unicode emojis remain in user-facing components.
- Exam History & Badges Gallery Consistency:
  - Updated `ExamHistoryTab.vue` and `BadgesTab.vue` to leverage SVG icons and render instant store state.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`). All passed with 0 errors.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 warnings and 0 errors.
- Built production bundle with `npm run build-only` (`vite build`). All passed.

---

### FE-ADMIN-25: Refactor, Modernize, and Polish the Admin Portal Interface Across Navigation, User Management, and Curriculum

- Date: 2026-11-01
- Branch: `feat/74-fe-admin-25refactor-modernize-and-polish-the-admin-portal-interface-across-exam-question-management`
- Status: Completed
- Closes: #74

Summary:
Addressed complete administrative feedback and UI refactoring:
- Navigation & Header:
  - Fixed header to top (`sticky top-0 z-40 backdrop-blur-md`) ensuring menu stays accessible while scrolling.
  - Inverted menu button styles: inactive links use soft blue button styling (`bg-[#9eb8cd] text-[#002D4F]`), active links use frosted glass outline (`bg-white/15 border-white/40 text-white`).
  - Styled profile dropdown with dark frosted glass (`bg-[#002742]/95 backdrop-blur-md border border-white/20`).
  - Aligned level badges with official Criteria colors (Level 1 `#C1D7AE`, Level 2 `#F2D794`, Level 3 `#E5A88B`, Level 4 `#DD898E`) and purged purple/violet highlights.
- User Management & Directory:
  - Upgraded search filter toolbar and user directory table to frosted glass cards (`bg-white/10 backdrop-blur-md border border-white/20`).
  - Formatted user identity into three distinct rows (Full name, `@username`, and email).
  - Removed pulsing dot animation from status badges.
  - Replaced text actions ("View Details", "Deactivate User") with tooltip-supported SVG icon buttons.
  - Centered table headers and cells for Province, Level, Status, and Actions.
  - Resolved filter event mismatch (`@filter-change` and `@update:filters`) and fixed search reset.
  - Set default page size to 6 to display pagination within viewport and prevented scroll-jumping.
- User Details & Edit:
  - Added fallback in `adminUserStore.fetchUserById` to gracefully resolve local mock data when backend is offline.
  - Increased spacing around "User not found" return button.
  - Enlarged User Information typography and label spacing.
  - Styled User Edit inputs and select with frosted glass, bright white labels, and level 1 green save button.
- Criteria of Levels & Exam Questions:
  - Standardized max width to `max-w-[1400px]` across admin pages.
  - Increased error message and retry button spacing in level criteria view.
  - Restyled "+ Add Question" button to frosted glass.
- Admin e-Learning Management:
  - Created `AdminElearningView.vue` with course video publishing form (Title, Description, Video URL, Live Preview player, and Level 2/3/4 selector).
  - Built course video catalog cards with preview player, badges, and delete capabilities.
  - Registered `/admin/elearning` (with `/learning` alias) in router and navigation menu.
- Dropdown & Form Controls Modernization:
  - Replaced dark solid background in `UserFilterToolbar.vue` and `UserEditForm.vue` with frosted glass styling (`bg-white/10 hover:bg-white/15 border-white/20 backdrop-blur-md`) matching text inputs.
  - Added `appearance-none` and integrated clean SVG chevron-down indicators to prevent OS-level shrinking and squished appearance.
  - Standardized dropdown height to `h-11` in filter toolbar and `h-12` in user edit form.
- Unified "Try Again" Error Actions:
  - Standardized error card container padding (`p-8 sm:p-10`), typography, and spacing across `AdminLevelListView.vue`, `AdminQuestionListView.vue`, `AdminUserListView.vue`, and `AdminLevelEditView.vue`.
  - Harmonized "Try Again" button dimensions (`px-6 py-2.5 text-sm font-bold min-w-[130px] rounded-xl`) to ensure 100% visual parity across all administrative error states.

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`). All passed with 0 errors.
- Linted codebase with `npm run lint` (`oxlint`, `eslint`). All passed with 0 warnings and 0 errors.
- Built production bundle with `npm run build` (`vite build`). All passed.
