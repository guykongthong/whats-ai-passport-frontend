import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { isUserAdmin, isUserDeactivated } from '@/shared/utils/auth'
import LoginView from '@/auth/views/LoginView.vue'
import RegisterPage from '@/auth/views/RegisterPage.vue'
import UserHomeView from '@/views/user/UserHomeView.vue'
import ProfileLayoutView from '@/views/user/profile/ProfileLayoutView.vue'
import MyDetailsTab from '@/views/user/profile/tabs/MyDetailsTab.vue'
import ExamHistoryTab from '@/views/user/profile/tabs/ExamHistoryTab.vue'
import BadgesTab from '@/views/user/profile/tabs/BadgesTab.vue'
import AvailableServicesTab from '@/views/user/profile/tabs/AvailableServicesTab.vue'
import ElearningView from '@/views/user/elearning/ElearningView.vue'
import ExamTakingView from '@/views/user/exam/ExamTakingView.vue'
import ServicesPage from '@/user/views/ServicesPage.vue'
import UserBadgesPage from '@/user/views/UserBadgesPage.vue'
import AdminUserListView from '@/views/admin/AdminUserListView.vue'
import UserDetailLayout from '@/views/admin/user-detail/UserDetailLayout.vue'
import UserInfoTab from '@/views/admin/user-detail/UserInfoTab.vue'
import UserExamHistoryTab from '@/views/admin/user-detail/UserExamHistoryTab.vue'
import UserEditTab from '@/views/admin/user-detail/UserEditTab.vue'
import AdminLevelListView from '@/views/admin/levels/AdminLevelListView.vue'
import AdminLevelEditView from '@/views/admin/levels/AdminLevelEditView.vue'
import AdminQuestionListView from '@/views/admin/questions/AdminQuestionListView.vue'
import AdminElearningView from '@/views/admin/elearning/AdminElearningView.vue'
import NotFoundPage from '@/shared/components/NotFoundPage.vue'
import OfflinePage from '@/shared/components/OfflinePage.vue'
import ServerErrorPage from '@/shared/components/ServerErrorPage.vue'
import PrivacyPolicyPage from '@/shared/components/PrivacyPolicyPage.vue'
import TermsOfServicePage from '@/shared/components/TermsOfServicePage.vue'
import SupportPage from '@/shared/components/SupportPage.vue'

NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      alias: ['/login-view'],
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      alias: ['/home'],
      name: 'dashboard',
      component: UserHomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      component: ProfileLayoutView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/profile/details',
        },
        {
          path: 'details',
          name: 'profile-details',
          component: MyDetailsTab,
          meta: { requiresAuth: true },
        },
        {
          path: 'history',
          alias: ['exam-history'],
          name: 'profile-history',
          component: ExamHistoryTab,
          meta: { requiresAuth: true },
        },
        {
          path: 'badges',
          name: 'profile-badges',
          component: BadgesTab,
          meta: { requiresAuth: true },
        },
        {
          path: 'services',
          name: 'profile-services',
          component: AvailableServicesTab,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/profile/edit',
      redirect: '/profile/details',
    },
    {
      path: '/dashboard/elearning',
      alias: ['/elearning'],
      name: 'elearning',
      component: ElearningView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/exam',
      alias: ['/exam'],
      name: 'exam',
      component: ExamTakingView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/exam-history',
      redirect: '/profile/history',
    },
    {
      path: '/dashboard/services',
      name: 'services',
      component: ServicesPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/badges',
      name: 'badges',
      component: UserBadgesPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      alias: ['/admin/users'],
      name: 'admin',
      component: AdminUserListView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/users/:id',
      component: UserDetailLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: (to) => `/admin/users/${to.params.id}/info`,
        },
        {
          path: 'info',
          name: 'admin-user-detail-info',
          component: UserInfoTab,
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: 'history',
          name: 'admin-user-detail-history',
          component: UserExamHistoryTab,
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: 'edit',
          name: 'admin-user-detail-edit',
          component: UserEditTab,
          meta: { requiresAuth: true, requiresAdmin: true },
        },
      ],
    },
    {
      path: '/admin/levels',
      name: 'criteria',
      component: AdminLevelListView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/levels/:levelNumber',
      alias: ['/admin/levels/:levelNumber/edit'],
      name: 'admin-level-edit',
      component: AdminLevelEditView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/exams',
      alias: ['/admin/questions'],
      name: 'admin-exams',
      component: AdminQuestionListView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/elearning',
      alias: ['/learning', '/admin/learning'],
      name: 'admin-elearning',
      component: AdminElearningView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/notfound',
      name: 'not-found',
      component: NotFoundPage,
    },
    {
      path: '/offline',
      name: 'offline',
      component: OfflinePage,
    },
    {
      path: '/server-error',
      name: 'server-error',
      component: ServerErrorPage,
    },
    {
      path: '/privacy',
      name: 'privacy-policy',
      component: PrivacyPolicyPage,
    },
    {
      path: '/terms',
      name: 'terms-of-service',
      component: TermsOfServicePage,
    },
    {
      path: '/support',
      name: 'support',
      component: SupportPage,
    },
    {
      path: '/policy',
      redirect: '/privacy',
    },
    {
      path: '/help',
      redirect: '/support',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/notfound',
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const user = authStore.currentUser
  const { triggerToast } = useToast()

  // 1. Check if user account is deactivated (enabled === false or isActive === false)
  if (user && isUserDeactivated(user)) {
    authStore.logout()
    triggerToast('Your account has been deactivated. Please contact an administrator.')
    return { name: 'login', query: { error: 'account_deactivated' } }
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

  const isAdmin = isUserAdmin(user)

  // 2. Redirect authenticated users away from guest routes
  if (requiresGuest && user) {
    return { name: isAdmin ? 'admin' : 'dashboard' }
  }

  // 3. Unauthenticated access to protected routes
  if (requiresAuth && !user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 4. Role-based guard for admin routes
  if (requiresAdmin && !isAdmin) {
    triggerToast('Access denied: Administrator privileges required.')
    return { name: 'dashboard', query: { error: 'unauthorized' } }
  }
})

router.beforeEach(() => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
