import React, { useEffect, useState } from "react";
import { vote, getResults } from "../services/api";

export default function Voting({ user, election, onBack }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchCandidates() {
      // We fetch candidates from results.php as it returns candidates & votes
      const res = await getResults(election.id);
      if (res.success) {
        setCandidates(res.candidates);
      }
      setLoading(false);
    }
    fetchCandidates();
  }, [election.id]);

  async function handleVote() {
    if (!selectedCandidate) {
      setMessage("Please select a candidate");
      return;
    }

    console.log("handleVote called with:");
    console.log("user.id:", user?.id);
    console.log("election.id:", election?.id);
    console.log("selectedCandidate:", selectedCandidate);

    setMessage("Submitting vote...");

    const res = await vote(user.id, election.id, selectedCandidate);

    if (res.success) {
      setMessage("Vote recorded! Thank you.");
    } else {
      setMessage("Error: " + res.message);
    }
  }

  if (loading) return <p>Loading candidates...</p>;

  return (
    <div>
      <h2 className="text-xl mb-4">Vote in {election.title}</h2>
      {message && <p className="mb-2">{message}</p>}
      <ul className="space-y-2 mb-4">
        {candidates.map((cand) => (
          <li
            key={cand.id}
            className="bg-gray-700 p-3 rounded flex items-center cursor-pointer hover:bg-gray-600"
            onClick={() => setSelectedCandidate(cand.id)}
          >
            <input
              type="radio"
              name="candidate"
              checked={selectedCandidate === cand.id}
              onChange={() => setSelectedCandidate(cand.id)}
              className="mr-3"
            />
            <span>
              {cand.name} ({cand.votes} votes)
            </span>
          </li>
        ))}
      </ul>
      <button
        className="bg-green-600 py-2 px-4 rounded hover:bg-green-700 transition mr-2"
        onClick={handleVote}
      >
        Submit Vote
      </button>
      <button
        className="bg-gray-500 py-2 px-4 rounded hover:bg-gray-600 transition"
        onClick={onBack}
      >
        Back to Elections
      </button>
    </div>
  );
}
