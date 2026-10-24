# Frontend Development Log
Project: The CA?T Passport (SE331 Project 2)
Repository: chartchai-class/953331-2026-component-based-software-dev-project2-frontend-group-14

This document tracks work progress, branch references, and implementation notes across project issues.

---

## Issue Status Summary

| Issue ID | Branch | Status | Files Changed | Verification |
|---|---|---|---|---|
| FE-ADMIN-01 | 1-fe-admin-01-define-typescript-interfaces-and-dtos-for-admin-features | Completed | frontend/src/types/admin.ts, frontend/src/types/index.ts | vue-tsc --build, vite build |
| FE-ADMIN-02 | 2-fe-admin-02-implement-admin-api-services-with-axios-client | Pending | frontend/src/services/AdminUserService.ts, AdminLevelService.ts, AdminQuestionService.ts | - |
| FE-ADMIN-03 | 3-fe-admin-03-build-admin-dashboard-shell-and-responsive-sidebar | Pending | frontend/src/components/admin/AdminSidebar.vue, frontend/src/views/admin/AdminLayoutView.vue | - |
| FE-USER-02 | feat/28-fe-user-02-implement-user-api-services-with-axios-client | In Review (PR #49) | frontend/src/services/apiClient.ts, UserService.ts, ELearningService.ts, ExamService.ts, index.ts | vue-tsc --build, vite build |

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
