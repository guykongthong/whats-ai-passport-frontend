import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import { isUserAdmin, isUserDeactivated } from '@/shared/utils/auth'
import LoginView from '@/auth/views/LoginView.vue'
import RegisterPage from '@/auth/views/RegisterPage.vue'
import UserLayoutView from '@/views/user/UserLayoutView.vue'
import UserHomeView from '@/views/user/UserHomeView.vue'
import MyProfilePage from '@/user/views/MyProfilePage.vue'
import MyDetailsPage from '@/user/views/MyDetailsPage.vue'
import ELearningPage from '@/user/views/ELearningPage.vue'
import ExamPage from '@/user/views/ExamPage.vue'
import ExamHistoryPage from '@/user/views/ExamHistoryPage.vue'
import ServicesPage from '@/user/views/ServicesPage.vue'
import AdminDashboard from '@/admin/views/AdminDashboard.vue'
import UserDetailPage from '@/admin/views/UserDetailPage.vue'
import UserTabInfo from '@/admin/views/user-tabs/UserTabInfo.vue'
import UserTabHistory from '@/admin/views/user-tabs/UserTabHistory.vue'
import UserTabEdit from '@/admin/views/user-tabs/UserTabEdit.vue'
import LevelListPage from '@/admin/views/LevelListPage.vue'
import LevelDetailPage from '@/admin/views/LevelDetailPage.vue'
import LevelEditPage from '@/admin/views/LevelEditPage.vue'
import ExamManagementPage from '@/admin/views/ExamManagementPage.vue'
import UserBadgesPage from '@/user/views/UserBadgesPage.vue'
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
      path: '',
      component: UserLayoutView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/dashboard',
          alias: ['/home'],
          name: 'dashboard',
          component: UserHomeView,
          meta: { requiresAuth: true },
        },
        {
          path: '/profile',
          name: 'profile',
          component: MyProfilePage,
          meta: { requiresAuth: true },
        },
        {
          path: '/profile/edit',
          name: 'profile-edit',
          component: MyDetailsPage,
          meta: { requiresAuth: true },
        },
        {
          path: '/dashboard/elearning',
          alias: ['/elearning'],
          name: 'elearning',
          component: ELearningPage,
          meta: { requiresAuth: true },
        },
        {
          path: '/dashboard/exam',
          alias: ['/exam'],
          name: 'exam',
          component: ExamPage,
          meta: { requiresAuth: true },
        },
        {
          path: '/dashboard/exam-history',
          name: 'exam-history',
          component: ExamHistoryPage,
          meta: { requiresAuth: true },
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
      ],
    },
    {
      path: '/admin',
      alias: ['/admin/users'],
      name: 'admin',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/users/:id',
      component: UserDetailPage,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: (to) => `/admin/users/${to.params.id}/info`,
        },
        {
          path: 'info',
          name: 'admin-user-detail-info',
          component: UserTabInfo,
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: 'history',
          name: 'admin-user-detail-history',
          component: UserTabHistory,
          meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
          path: 'edit',
          name: 'admin-user-detail-edit',
          component: UserTabEdit,
          meta: { requiresAuth: true, requiresAdmin: true },
        },
      ],
    },
    {
      path: '/admin/levels',
      name: 'criteria',
      component: LevelListPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/levels/:id',
      name: 'admin-level-detail',
      component: LevelDetailPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/levels/:id/edit',
      name: 'admin-level-edit',
      component: LevelEditPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/exams',
      alias: ['/admin/questions'],
      name: 'admin-exams',
      component: ExamManagementPage,
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
