"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // already logged in
    }
  }, [status]);

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn("github", { callbackUrl: "/" })}>
        Sign in with GitHub
      </button>
    </div>
  );
}
