import React, { useEffect, useState } from "react";
import { getElections, getResults } from "../services/api";

export default function LiveResults() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchElections() {
      const res = await getElections();
      if (res.success) setElections(res.elections);
    }
    fetchElections();
  }, []);

  const handleElectionSelect = async (e) => {
    const electionId = e.target.value;
    setSelectedElection(electionId);
    setLoading(true);
    const res = await getResults(electionId);
    if (res.success) setResults(res.results);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-12 bg-[var(--color-bg-alt)] rounded-xl shadow-xl border border-[var(--color-border)]">
      <h1 className="text-3xl font-orbitron text-[var(--color-primary)] mb-6 text-center">Live Election Results</h1>

      <div className="mb-8">
        <label className="block text-[var(--color-text-main)] mb-2 font-semibold">Select Election</label>
        <select
          onChange={handleElectionSelect}
          value={selectedElection || ""}
          className="w-full p-3 rounded bg-[var(--color-bg-dark)] text-[var(--color-text-main)] border border-[var(--color-border)] font-mono"
        >
          <option value="">-- Choose an election --</option>
          {elections.map((election) => (
            <option key={election.id} value={election.id}>
              {election.title}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="text-center text-[var(--color-primary)] font-mono">Loading results...</p>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4 mt-6">
          {results.map((candidate) => (
            <div
              key={candidate.id}
              className="p-4 bg-[var(--color-bg-dark)] rounded-lg border border-[var(--color-border)]"
            >
              <h3 className="text-lg font-bold text-[var(--color-text-main)]">{candidate.name}</h3>
              <p className="text-[var(--color-primary)] font-mono">Votes: {candidate.votes}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && selectedElection && results.length === 0 && (
        <p className="text-center text-[var(--color-text-muted)]">No results yet for this election.</p>
      )}
    </div>
  );
}
