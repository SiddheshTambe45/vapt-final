// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation"; // Import useParams hook

// export default function ResultPage() {
//   const { id } = useParams(); // Use useParams to get the dynamic parameter
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     const fetchResult = async () => {
//       try {
//         const res = await fetch(`/api/results/${id}`);
//         const data = await res.json();
//         setResult(data);
//       } catch (error) {
//         console.error("Error fetching result:", error);
//       }
//     };

//     if (id) {
//       fetchResult();
//     }
//   }, [id]);

//   if (!result) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>Result: {id}</h1>
//       <pre>{JSON.stringify(result, null, 2)}</pre>{" "}
//       {/* Display the whole JSON for now */}
//     </div>
//   );
// }

// ---------------------------------------------

// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function ResultPage() {
//   const { id } = useParams();
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     const fetchResult = async () => {
//       try {
//         const res = await fetch(`/api/results/${id}`);
//         const data = await res.json();
//         setResult(data);
//       } catch (error) {
//         console.error("Error fetching result:", error);
//       }
//     };

//     if (id) {
//       fetchResult();
//     }
//   }, [id]);

//   if (!result) return <p>Loading...</p>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">
//         ZAP Scan Result: <span className="text-blue-600">{id}</span>
//       </h1>

//       {Array.isArray(result) && result.length > 0 ? (
//         result.map((vuln, index) => (
//           <div
//             key={index}
//             className="border border-gray-300 rounded-2xl shadow-md p-5 bg-white space-y-2"
//           >
//             <h2 className="text-xl font-semibold text-red-600">
//               🛡️ Vulnerability #{index + 1}:{" "}
//               {vuln.alerts[0]?.alert || "Unknown Issue"}
//             </h2>

//             <p>
//               <strong>🔗 URL:</strong> {vuln.url}
//             </p>
//             <p>
//               <strong>📍 Path:</strong> {vuln.path}
//             </p>
//             <p>
//               <strong>⚠️ Risk:</strong> {vuln.alerts[0]?.risk}
//             </p>
//             <p>
//               <strong>🧠 Description:</strong> {vuln.alerts[0]?.description}
//             </p>
//             <p>
//               <strong>🔧 Parameter:</strong> {vuln.alerts[0]?.param}
//             </p>
//             <p>
//               <strong>🧪 Method:</strong> {vuln.alerts[0]?.method}
//             </p>
//             <p>
//               <strong>📊 Confidence:</strong> {vuln.alerts[0]?.confidence}
//             </p>
//             <p>
//               <strong>🛠️ Solution:</strong>
//             </p>
//             <p className="whitespace-pre-line text-gray-700">
//               {vuln.alerts[0]?.solution}
//             </p>

//             {vuln.alerts[0]?.reference && (
//               <p className="text-sm mt-2">
//                 <strong>📚 Reference:</strong>{" "}
//                 <a
//                   href={vuln.alerts[0].reference}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline"
//                 >
//                   {vuln.alerts[0].reference}
//                 </a>
//               </p>
//             )}
//           </div>
//         ))
//       ) : (
//         <p>No vulnerabilities found in this result.</p>
//       )}
//     </div>
//   );
// }

// ---------------------------------------------

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/results/${id}`);
        const data = await res.json();
        setResult(data);
      } catch (error) {
        console.error("Error fetching result:", error);
      }
    };

    if (id) {
      fetchResult();
    }
  }, [id]);

  const handleDownload = () => {
    if (!result) return;

    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `zap-scan-result-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!result) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          ZAP Scan Result: <span className="text-blue-600">{id}</span>
        </h1>
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          ⬇️ Download JSON
        </button>
      </div>

      {Array.isArray(result) && result.length > 0 ? (
        result.map((vuln, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-2xl shadow-md p-5 bg-white space-y-2"
          >
            <h2 className="text-xl font-semibold text-red-600">
              🛡️ Vulnerability #{index + 1}:{" "}
              {vuln.alerts[0]?.alert || "Unknown Issue"}
            </h2>

            <p>
              <strong>🔗 URL:</strong> {vuln.url}
            </p>
            <p>
              <strong>📍 Path:</strong> {vuln.path}
            </p>
            <p>
              <strong>⚠️ Risk:</strong> {vuln.alerts[0]?.risk}
            </p>
            <p>
              <strong>🧠 Description:</strong> {vuln.alerts[0]?.description}
            </p>
            <p>
              <strong>🔧 Parameter:</strong> {vuln.alerts[0]?.param}
            </p>
            <p>
              <strong>🧪 Method:</strong> {vuln.alerts[0]?.method}
            </p>
            <p>
              <strong>📊 Confidence:</strong> {vuln.alerts[0]?.confidence}
            </p>
            <p>
              <strong>🛠️ Solution:</strong>
            </p>
            <p className="whitespace-pre-line text-gray-700">
              {vuln.alerts[0]?.solution}
            </p>

            {vuln.alerts[0]?.reference && (
              <p className="text-sm mt-2">
                <strong>📚 Reference:</strong>{" "}
                <a
                  href={vuln.alerts[0].reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {vuln.alerts[0].reference}
                </a>
              </p>
            )}
          </div>
        ))
      ) : (
        <p>No vulnerabilities found in this result.</p>
      )}
    </div>
  );
}
