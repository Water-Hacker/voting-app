import React, { useEffect, useState } from "react";
import { getResults } from "../services/api";

export default function Results({ election }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      const res = await getResults(election.id);
      if (res.success) {
        setCandidates(res.candidates);
      }
      setLoading(false);
    }

    fetchResults();

    // Optional: refresh results every 10 seconds
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, [election.id]);

  if (loading) return <p>Loading results...</p>;

  return (
    <div>
      <h2 className="text-xl mb-4">Results for {election.title}</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b border-gray-600 p-2">Candidate</th>
            <th className="border-b border-gray-600 p-2">Votes</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((cand) => (
            <tr key={cand.id} className="hover:bg-gray-700">
              <td className="p-2">{cand.name}</td>
              <td className="p-2">{cand.votes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
