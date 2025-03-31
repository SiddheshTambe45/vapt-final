"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const { data: session } = useSession();

  const handleConfigureGitHub = async () => {
    window.location.href = "/api/github/install";
  };

  return (
    <div>
      {session ? (
        <>
          <p>Welcome, {session.user.name}!</p>
          <button onClick={() => signOut()}>Sign Out</button>
          <button
            onClick={handleConfigureGitHub}
            style={{ marginLeft: "10px" }}
          >
            Configure GitHub App
          </button>
        </>
      ) : (
        <button onClick={() => signIn("github")}>Sign In with GitHub</button>
      )}
    </div>
  );
}
