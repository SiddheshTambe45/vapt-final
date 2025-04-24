// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import axios from "axios";

// const Dashboard = () => {
//   const { data: session } = useSession();
//   const [repos, setRepos] = useState([]);
//   const [selectedRepo, setSelectedRepo] = useState("");
//   const [projectKey, setProjectKey] = useState("");
//   const [organization, setOrganization] = useState("");
//   const [apiToken, setApiToken] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchRepos = async () => {
//       if (!session) return;
//       try {
//         const res = await axios.get("/api/repos");
//         setRepos(res.data.repos);
//       } catch (error) {
//         console.error("Error fetching repos:", error);
//       }
//     };
//     fetchRepos();
//   }, [session]);

//   const handleSubmit = async (e) => {
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
//     <div>
//       <h1>Dashboard</h1>

//       <div>
//         <h2>Configure SonarCloud for a GitHub Repository</h2>

//         {session ? (
//           <>
//             <label>Select GitHub Repository:</label>
//             <select onChange={(e) => setSelectedRepo(e.target.value)}>
//               <option value="">-- Select a Repository --</option>
//               {repos.map((repo) => (
//                 <option key={repo.repoId} value={repo.repoId}>
//                   {repo.name} ({repo.owner})
//                 </option>
//               ))}
//             </select>

//             {selectedRepo && (
//               <form onSubmit={handleSubmit}>
//                 <label>SonarCloud Project Key:</label>
//                 <input
//                   type="text"
//                   value={projectKey}
//                   onChange={(e) => setProjectKey(e.target.value)}
//                   required
//                 />

//                 <label>SonarCloud Organization:</label>
//                 <input
//                   type="text"
//                   value={organization}
//                   onChange={(e) => setOrganization(e.target.value)}
//                   required
//                 />

//                 <label>SonarCloud Api Token:</label>
//                 <input
//                   type="text"
//                   value={apiToken}
//                   onChange={(e) => setApiToken(e.target.value)}
//                   required
//                 />

//                 <button type="submit" disabled={loading}>
//                   {loading ? "Configuring..." : "Link SonarCloud"}
//                 </button>
//               </form>
//             )}
//           </>
//         ) : (
//           <p>Please sign in to configure SonarCloud.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
