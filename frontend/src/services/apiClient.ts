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

export default apiClient
