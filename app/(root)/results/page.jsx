"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch the results from the API or file system
    const fetchResults = async () => {
      try {
        // Make a request to the server to fetch results files
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
    <div>
      <h1>Existing Results</h1>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {results.map((result) => (
            <li key={result.id}>
              <a href={`/results/${result.id}`}>{result.id}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
