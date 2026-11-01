import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Automatically attach Bearer token if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    let token: string | null = null
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token') || localStorage.getItem('access_token')
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercept 401 Unauthorized globally: clear stale credentials and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('access_token')
        localStorage.removeItem('currentUser')
        localStorage.removeItem('custom_admin_avatar')
      }
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?sessionExpired=true'
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
