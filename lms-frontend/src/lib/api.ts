import axios from 'axios';
import { API_URL } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';

const API = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // penting buat kirim refreshToken cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password'
];

// Request interceptor → attach access token
API.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor → auto refresh token kalau access token expired
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isAuthRoute = authRoutes.some((route) =>
      originalRequest.url?.includes(route),
    );

    if (isAuthRoute) {
      return Promise.reject(error);
    }
    // kalau access token expired
    if (status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

        // backend kamu return:
        // data: { accessToken: result.accessToken }
        const newAccessToken = response.data.data.accessToken;

        // update token di zustand
        useAuthStore.getState().setToken(newAccessToken);

        // retry request lama
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);

        useAuthStore.getState().logout();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    if (status === 403) {
    return Promise.reject(error); 
  }

    return Promise.reject(error);
  },
);

export default API;