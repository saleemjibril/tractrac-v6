import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import secureLocalStorage from 'react-secure-storage';

interface JWTPayload {
  exp: number;
  [key: string]: any;
}

const http = axios.create({
  baseURL: "https://tractracplus-backend-v6.onrender.com/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true
});

// Helper function to get current token from localStorage
const getCurrentToken = (): string | null => {
  const userToken = secureLocalStorage.getItem("xak") as string;
  const adminToken = secureLocalStorage.getItem("xuk") as string;
  return userToken || adminToken || null;
};

// Helper function to determine if user is admin
const isAdminUser = (): boolean => {
  const adminToken = secureLocalStorage.getItem("xuk");
  return !!adminToken;
};

// Helper function to perform logout
const performLogout = (): void => {
  try {
    // Clear tokens from localStorage
    secureLocalStorage.removeItem("xak");
    secureLocalStorage.removeItem("xad");
    secureLocalStorage.removeItem("xuk");
    secureLocalStorage.removeItem("xua");
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

// Helper function to check if JWT token is expired
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  try {
    const payload: JWTPayload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Request interceptor to add token to headers and check expiration
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCurrentToken();
    
    if (token) {
      // Check if token is expired before making request
      if (isTokenExpired(token)) {
        performLogout();
        return Promise.reject(new Error('Token expired'));
      }
      
      // Add token to request headers
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration from server
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized responses (token expired/invalid)
    if (error.response?.status === 401) {
      console.log('Token expired or invalid, logging out...');
      performLogout();
    }
    
    // Handle 403 Forbidden responses (might also indicate token issues)
    if (error.response?.status === 403) {
      console.log('Access forbidden, checking token...');
      const token = getCurrentToken();
      if (token && isTokenExpired(token)) {
        performLogout();
      }
    }
    
    return Promise.reject(error);
  }
);

export default http;