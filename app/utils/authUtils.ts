// utils/authUtils.ts
import secureLocalStorage from 'react-secure-storage';
import { AppDispatch } from '../../redux/store'; // adjust path
import { userLogout, adminLogout } from '../../redux/features/auth/authActions'; // adjust path

interface JWTPayload {
  exp: number;
  [key: string]: any;
}

// Helper function to check if JWT token is expired
export const isTokenExpired = (token: string | null): boolean => {
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

// Helper function to get current token from localStorage
export const getCurrentToken = (): string | null => {
  const userToken = secureLocalStorage.getItem("xak") as string;
  const adminToken = secureLocalStorage.getItem("xuk") as string;
  return userToken || adminToken || null;
};

// Helper function to determine if user is admin
export const isAdminUser = (): boolean => {
  const adminToken = secureLocalStorage.getItem("xuk");
  return !!adminToken;
};

// Helper function to perform logout with Redux dispatch
export const performLogoutWithDispatch = (dispatch: AppDispatch): void => {
  try {
    if (isAdminUser()) {
      dispatch(adminLogout());
    } else {
      dispatch(userLogout());
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

// Helper function to perform logout without Redux (fallback)
export const performLogoutFallback = (): void => {
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