// "use client";

// import { useEffect, useState } from "react";

// export default function ResultsPage() {
//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     // Fetch the results from the API or file system
//     const fetchResults = async () => {
//       try {
//         // Make a request to the server to fetch results files
//         const res = await fetch("/api/results");
//         const data = await res.json();
//         setResults(data);
//       } catch (error) {
//         console.error("Error fetching results:", error);
//       }
//     };

//     fetchResults();
//   }, []);

//   return (
//     <div>
//       <h1>Existing Results</h1>
//       {results.length === 0 ? (
//         <p>No results found.</p>
//       ) : (
//         <ul>
//           {results.map((result) => (
//             <li key={result.id}>
//               <a href={`/results/${result.id}`}>{result.id}</a>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// ---------------------------------------------------

"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/results");
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Scan Results</h1>

      {results.length === 0 ? (
        <div className="p-6 bg-white rounded-xl shadow text-center text-gray-500">
          No results found.
        </div>
      ) : (
        <ul className="space-y-4">
          {results.map((result) => (
            <li
              key={result.id}
              className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <a
                href={`/results/${result.id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                Result ID: {result.id}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
