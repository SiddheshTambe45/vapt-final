// "use client";

// import { useSession, signOut } from "next-auth/react";

// export default function Home() {
//   const { data: session } = useSession();

//   return (
//     <div>
//       {session ? (
//         <>
//           <p>Hello, {session.user.name}!</p>
//           <p>Welcome to your dashboard.</p>
//           <button onClick={() => signOut()}>Sign Out</button>
//         </>
//       ) : (
//         <p>Please sign in to access your dashboard.</p>
//       )}
//     </div>
//   );
// }

// ---------------------------------------

"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        {session ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Hello, {session.user.name} 👋
            </h1>
            <p className="text-gray-600 mb-6">
              Welcome to your VAPT dashboard.
            </p>

            <div className="flex flex-col gap-4">
              <Link
                href="/configure"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
              >
                Configure Integration
              </Link>
              <Link
                href="/results"
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md transition"
              >
                View Scan Results
              </Link>
              <Link
                href="/about"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
              >
                About This Project
              </Link>
              <Link
                href="/flowchart"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
              >
                Flowchart of the Pipeline
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition mt-2"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">
            Please sign in to access your dashboard.
          </p>
        )}
      </div>
    </div>
  );
}
