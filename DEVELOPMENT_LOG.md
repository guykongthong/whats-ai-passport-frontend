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
