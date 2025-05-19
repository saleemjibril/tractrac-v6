
// components/ClientOnly.tsx
'use client';

import { useState, useEffect, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
}

export default function ClientOnly({ children }: ClientOnlyProps): JSX.Element | null {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : null;
}