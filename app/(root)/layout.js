"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  return <AuthGate>{children}</AuthGate>;
}

// Only render children if session exists
function AuthGate({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (!session) {
    router.push("/login"); // Redirect to login if not authenticated
    return null;
  }

  return <main>{children}</main>;
}
