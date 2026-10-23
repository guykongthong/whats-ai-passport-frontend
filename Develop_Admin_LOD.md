# Frontend Development Log
Project: The CAMT Passport (SE331 Project 2)
Repository: chartchai-class/953331-2026-component-based-software-dev-project2-frontend-group-14

This document tracks work progress, branch references, and implementation notes across project issues.

---

## Issue Status Summary

| Issue ID | Branch | Status | Files Changed | Verification |
|---|---|---|---|---|
| FE-ADMIN-01 | 1-fe-admin-01-define-typescript-interfaces-and-dtos-for-admin-features | Completed | frontend/src/types/admin.ts, frontend/src/types/index.ts | vue-tsc --build, vite build |
| FE-ADMIN-02 | feat/2-fe-admin-02-implement-admin-api-services-with-axios-client | Completed | frontend/src/services/apiClient.ts, AdminUserService.ts, AdminLevelService.ts, AdminQuestionService.ts, index.ts | vue-tsc --build, vite build, eslint |
| FE-ADMIN-03 | 3-fe-admin-03-build-admin-dashboard-shell-and-responsive-sidebar | Pending | frontend/src/components/admin/AdminSidebar.vue, frontend/src/views/admin/AdminLayoutView.vue | - |

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
  - `getUsers(page, pageSize, filters)`: fetch paginated users with optional search/filter params.
  - `getUserById(id)`: fetch single user detail by ID.
  - `updateUser(id, data)`: update user fields using `Partial<AdminUser>`.
  - `toggleUserStatus(id, enabled)`: enable or disable a user account.
- `AdminLevelService.ts`:
  - `getLevels()`: fetch all progression levels.
  - `getLevel(levelNumber)`: fetch detail for a specific level.
  - `updateLevel(levelNumber, data)`: update passing criteria, benefits, or services.
- `AdminQuestionService.ts`:
  - `getQuestionsByLevel(levelNumber)`: fetch question bank by level.
  - `createQuestion(data)`: add new multiple-choice question.
  - `updateQuestion(id, data)`: update question text, choices, or correct answer.
  - `deleteQuestion(id)`: delete question by ID.
- `services/index.ts`: Exported all services and client for clean imports (`@/services`).

Testing:
- Checked types with `npm run type-check` (`vue-tsc --build`).
- Ran `npm run build-only` and `npm run lint`. All passed with 0 warnings and 0 errors.
