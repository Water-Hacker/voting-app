import React, { useEffect, useState } from "react";
import { getElections } from "../services/api";

export default function ElectionsList({ onSelectElection }) {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchElections() {
      const res = await getElections();
      if (res.success) {
        setElections(res.elections);
      }
      setLoading(false);
    }
    fetchElections();
  }, []);

  if (loading) return <p>Loading elections...</p>;

  if (elections.length === 0) return <p>No active elections at the moment.</p>;

  return (
    <div>
      <h2 className="text-xl mb-4">Active Elections</h2>
      <ul className="space-y-2">
        {elections.map((election) => (
          <li
            key={election.id}
            className="p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
            onClick={() => onSelectElection(election)}
          >
            <h3 className="font-semibold">{election.title}</h3>
            <p className="text-sm">{election.description}</p>
            <p className="text-xs mt-1 text-gray-400">
              From {new Date(election.start_date).toLocaleString()} to{" "}
              {new Date(election.end_date).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
