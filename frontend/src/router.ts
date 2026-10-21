import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAuthStore } from '@/stores/authStore'
import LoginView from '@/auth/views/LoginView.vue'
import RegisterPage from '@/auth/views/RegisterPage.vue'
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
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true},
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
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
      name: 'elearning',
      component: ELearningPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/exam',
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
    {
      path: '/admin',
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
          redirect: to => `/admin/users/${to.params.id}/info`
        },
        {
          path: 'info',
          name: 'admin-user-detail-info',
          component: UserTabInfo
        },
        {
          path: 'history',
          name: 'admin-user-detail-history',
          component: UserTabHistory
        },
        {
          path: 'edit',
          name: 'admin-user-detail-edit',
          component: UserTabEdit
        }
      ]
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
      redirect: '/privacy'
    },
    {
      path: '/help',
      redirect: '/support'
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/notfound'
    }
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const user = authStore.currentUser

  if (to.meta.requiresGuest && user) {
    return { name: user.role === 'admin' ? 'admin' : 'dashboard' }
  }

  if (to.meta.requiresAuth && !user) {
    return { name: 'login' }
  }

  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    return { name: 'dashboard' }
  }
})

router.beforeEach(() => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
