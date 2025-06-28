import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store'; // adjust path to your store
import { isTokenExpired, performLogoutWithDispatch } from '../utils/authUtils'; // adjust path
import { userLogout, adminLogout } from '../../redux/features/auth/authActions';

interface AuthState {
  userToken: string | null;
  adminToken: string | null;
  profileInfo: any;
  adminInfo: any;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface RootState {
  auth: AuthState;
}

// Custom hook to check token expiration periodically
export const useAuthCheck = (): void => {
  const dispatch = useDispatch<AppDispatch>();
  const { userToken, adminToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkTokenExpiration = (): void => {
      if (userToken && isTokenExpired(userToken)) {
        console.log('User token expired, logging out...');
        dispatch(userLogout());
      }
      
      if (adminToken && isTokenExpired(adminToken)) {
        console.log('Admin token expired, logging out...');
        dispatch(adminLogout());
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every 60 seconds
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, [userToken, adminToken, dispatch]);
};

// Usage in your main App component:
// import { useAuthCheck } from './hooks/useAuthCheck';
// 
// function App() {
//   useAuthCheck(); // Add this line
//   return (
//     // your app content
//   );
// }