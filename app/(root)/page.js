"use client";

import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <p>Hello, {session.user.name}!</p>
          <p>Welcome to your dashboard.</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <p>Please sign in to access your dashboard.</p>
      )}
    </div>
  );
}
