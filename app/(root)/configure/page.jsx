// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import axios from "axios";

// export default function ConfigurePage() {
//   const { data: session } = useSession();

//   const [repos, setRepos] = useState([]);
//   const [selectedRepo, setSelectedRepo] = useState("");
//   const [projectKey, setProjectKey] = useState("");
//   const [organization, setOrganization] = useState("");
//   const [apiToken, setApiToken] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!session) return;
//     const fetchRepos = async () => {
//       try {
//         const res = await axios.get("/api/repos");
//         setRepos(res.data.repos);
//       } catch (error) {
//         console.error("Error fetching repos:", error);
//       }
//     };
//     fetchRepos();
//   }, [session]);

//   const handleGitHubAppInstall = () => {
//     window.location.href = "/api/github/install";
//   };

//   const handleSonarSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post("/api/sonarcloud/configure", {
//         repoId: selectedRepo,
//         projectKey,
//         organization,
//         apiToken,
//       });
//       alert("SonarCloud linked successfully!");
//     } catch (error) {
//       console.error("Error linking SonarCloud:", error);
//       alert("Failed to link SonarCloud");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>Configure Your Integration</h1>

//       {!session ? (
//         <p>Please sign in to configure GitHub and SonarCloud.</p>
//       ) : (
//         <>
//           <section style={{ marginTop: "2rem" }}>
//             <h2>Step 1: Connect GitHub App</h2>
//             <button onClick={handleGitHubAppInstall}>Install GitHub App</button>
//           </section>

//           <section style={{ marginTop: "2rem" }}>
//             <h2>Step 2: Link SonarCloud Project</h2>

//             <label>Select GitHub Repository:</label>
//             <select
//               value={selectedRepo}
//               onChange={(e) => setSelectedRepo(e.target.value)}
//             >
//               <option value="">-- Select a Repository --</option>
//               {repos.map((repo) => (
//                 <option key={repo.repoId} value={repo.repoId}>
//                   {repo.name} ({repo.owner})
//                 </option>
//               ))}
//             </select>

//             {selectedRepo && (
//               <form onSubmit={handleSonarSubmit} style={{ marginTop: "1rem" }}>
//                 <div>
//                   <label>SonarCloud Project Key:</label>
//                   <input
//                     type="text"
//                     value={projectKey}
//                     onChange={(e) => setProjectKey(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label>SonarCloud Organization:</label>
//                   <input
//                     type="text"
//                     value={organization}
//                     onChange={(e) => setOrganization(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label>SonarCloud API Token:</label>
//                   <input
//                     type="text"
//                     value={apiToken}
//                     onChange={(e) => setApiToken(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <button type="submit" disabled={loading}>
//                   {loading ? "Linking..." : "Link SonarCloud"}
//                 </button>
//               </form>
//             )}
//           </section>
//         </>
//       )}
//     </div>
//   );
// }

// -------------------------------------------------------

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function ConfigurePage() {
  const { data: session } = useSession();

  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [organization, setOrganization] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    const fetchRepos = async () => {
      try {
        const res = await axios.get("/api/repos");
        setRepos(res.data.repos);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };
    fetchRepos();
  }, [session]);

  const handleGitHubPermissionGrant = () => {
    window.location.href = "/api/github/install";
  };

  const handleSonarSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/sonarcloud/configure", {
        repoId: selectedRepo,
        projectKey,
        organization,
        apiToken,
      });
      alert("SonarCloud linked successfully!");
    } catch (error) {
      console.error("Error linking SonarCloud:", error);
      alert("Failed to link SonarCloud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Configure Your Integration</h1>

      {!session ? (
        <p>Please sign in to configure GitHub and SonarCloud.</p>
      ) : (
        <>
          <section style={{ marginTop: "2rem" }}>
            <h2>Step 1: Grant Permission to Access GitHub Repositories</h2>
            <p>Allow us to access your GitHub repositories for analysis.</p>
            <button onClick={handleGitHubPermissionGrant}>
              {repos.length > 0
                ? "Manage GitHub Permissions"
                : "Grant Access to GitHub Repositories"}
            </button>
          </section>

          <section style={{ marginTop: "2rem" }}>
            <h2>Step 2: Link SonarCloud Project</h2>

            <label>Select GitHub Repository:</label>
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
            >
              <option value="">-- Select a Repository --</option>
              {repos.map((repo) => (
                <option key={repo.repoId} value={repo.repoId}>
                  {repo.name} ({repo.owner})
                </option>
              ))}
            </select>

            {selectedRepo && (
              <form onSubmit={handleSonarSubmit} style={{ marginTop: "1rem" }}>
                <div>
                  <label>SonarCloud Project Key:</label>
                  <input
                    type="text"
                    value={projectKey}
                    onChange={(e) => setProjectKey(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>SonarCloud Organization:</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>SonarCloud API Token:</label>
                  <input
                    type="text"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? "Linking..." : "Link SonarCloud"}
                </button>
              </form>
            )}
          </section>
        </>
      )}
    </div>
  );
}
