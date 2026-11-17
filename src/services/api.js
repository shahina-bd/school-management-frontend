import axios from 'axios'

const DEV_BEARER_TOKEN = '2|bnlBZ5VTxUD6R3ykexIwRSe60MSlHj5bzruJRI0jb1eaa930'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor to attach valid Bearer token
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token')
    if (!token || token === 'dummy-token') {
      token = DEV_BEARER_TOKEN
      localStorage.setItem('token', token)
    }
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.setItem('token', DEV_BEARER_TOKEN)
    }
    return Promise.reject(error)
  }
)

export default api
