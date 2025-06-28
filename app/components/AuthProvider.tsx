// components/AuthProvider.tsx
'use client';

import { ReactNode } from 'react';
import { useAuthCheck } from '../hooks/useAuthCheck'; // adjust path

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that wraps your app and automatically checks for token expiration
 * Use this in your layout or wrap specific pages that need auth checking
 */
export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  useAuthCheck();
  
  return <>{children}</>;
};

// Alternative: Higher-Order Component approach
export const withAuthCheck = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const AuthCheckedComponent = (props: P) => {
    useAuthCheck();
    return <Component {...props} />;
  };
  
  AuthCheckedComponent.displayName = `withAuthCheck(${Component.displayName || Component.name})`;
  
  return AuthCheckedComponent;
};