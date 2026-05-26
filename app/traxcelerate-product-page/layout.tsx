import type { ReactNode } from "react";

/** Standalone marketing page — no app chrome padding from parent layouts */
export default function TraxcelerateProductLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
