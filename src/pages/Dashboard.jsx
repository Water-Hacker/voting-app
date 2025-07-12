import React, { useEffect, useState } from "react";
import { getElections, vote, getResults } from "../services/api";

export default function Dashboard({ user }) {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("vote");
  const [hasVotedInElection, setHasVotedInElection] = useState(false);

  useEffect(() => {
    async function fetchElections() {
      const res = await getElections();
      if (res.success) setElections(res.elections);
    }
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      async function fetchVoteStatus() {
        const res = await fetch(`http://localhost/backend/api/hasVoted.php?user_id=${user.id}&election_id=${selectedElection.id}`);
        const data = await res.json();
        if (data.success) setHasVotedInElection(data.hasVoted);
      }

      async function fetchResults() {
        const res = await getResults(selectedElection.id);
        if (res.success) setResults(res.candidates || res.results || []);
      }

      fetchVoteStatus();
      fetchResults();

      const interval = setInterval(fetchResults, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedElection]);

  async function handleVote() {
    if (!selectedCandidate) {
      setMessage("Please select a candidate to vote.");
      return;
    }
    setLoading(true);
    setMessage("");
    const res = await vote(user.id, selectedElection.id, selectedCandidate);
    if (res.success) {
      setMessage("Vote recorded successfully!");
      setHasVotedInElection(true);
      const freshResults = await getResults(selectedElection.id);
      if (freshResults.success) setResults(freshResults.candidates || []);
    } else {
      setMessage(res.message || "Failed to record vote.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-[var(--color-bg-alt)] rounded-lg shadow-lg border border-[var(--color-border)]">
      <h1 className="text-[var(--color-primary)] font-orbitron text-4xl mb-8 text-center">
        Welcome, {user.email}
      </h1>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-main)]">
          Available Elections
        </h2>
        {elections.length === 0 && (
          <p className="text-[var(--color-text-muted)]">No active elections at this time.</p>
        )}
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {elections.map((el) => (
            <li
              key={el.id}
              onClick={() => {
                setSelectedElection(el);
                setView("vote");
                setSelectedCandidate(null);
                setMessage("");
              }}
              className={`cursor-pointer p-4 rounded-lg border border-[var(--color-border)] transition ${
                selectedElection?.id === el.id
                  ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)]"
                  : "hover:bg-[var(--color-bg-dark)]"
              }`}
            >
              <h3 className="font-semibold">{el.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] truncate">{el.description}</p>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                {new Date(el.start_date).toLocaleDateString()} → {new Date(el.end_date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {selectedElection && (
        <section className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
              {selectedElection.title}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setView("vote")}
                className={`px-4 py-2 rounded ${
                  view === "vote"
                    ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)]"
                    : "bg-[var(--color-bg-dark)] text-[var(--color-text-muted)]"
                }`}
              >
                Vote
              </button>
              <button
                onClick={() => setView("results")}
                className={`px-4 py-2 rounded ${
                  view === "results"
                    ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)]"
                    : "bg-[var(--color-bg-dark)] text-[var(--color-text-muted)]"
                }`}
              >
                Results
              </button>
            </div>
          </div>

          {view === "vote" && (
            <>
              {!hasVotedInElection ? (
                <>
                  <CandidatesList
                    electionId={selectedElection.id}
                    selectedCandidate={selectedCandidate}
                    setSelectedCandidate={setSelectedCandidate}
                  />
                  <button
                    onClick={handleVote}
                    disabled={loading}
                    className="mt-4 bg-[var(--color-accent)] text-[var(--color-bg-dark)] px-6 py-3 rounded-lg font-semibold hover:bg-[#22d3ee] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : "Submit Vote"}
                  </button>
                </>
              ) : (
                <p className="text-green-400 font-semibold">
                  You have already voted in this election.
                </p>
              )}
              {message && <p className="mt-4 text-center text-[var(--color-primary)] font-semibold">{message}</p>}
            </>
          )}

          {view === "results" && <ResultsDisplay results={results} />}
        </section>
      )}
    </div>
  );
}

function CandidatesList({ electionId, selectedCandidate, setSelectedCandidate }) {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function fetchCandidates() {
      const res = await fetch(`http://localhost/backend/api/getCandidates.php?election_id=${electionId}`);
      const data = await res.json();
      if (data.success) setCandidates(data.candidates);
    }
    fetchCandidates();
  }, [electionId]);

  return (
    <ul className="grid gap-3 sm:grid-cols-2 mt-4">
      {candidates.map((c) => (
        <li
          key={c.id}
          onClick={() => setSelectedCandidate(c.id)}
          className={`cursor-pointer p-3 border border-[var(--color-border)] rounded-lg flex items-center gap-3 transition ${
            selectedCandidate === c.id
              ? "bg-[var(--color-primary)] text-[var(--color-bg-dark)] font-semibold"
              : "hover:bg-[var(--color-bg-dark)]"
          }`}
        >
          <span>{c.name}</span>
        </li>
      ))}
    </ul>
  );
}

function ResultsDisplay({ results }) {
  return (
    <section className="mt-6">
      <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-3">Live Results</h3>
      <table className="w-full text-[var(--color-text-main)] border border-[var(--color-border)] rounded-md overflow-hidden">
        <thead className="bg-[var(--color-bg-dark)]">
          <tr>
            <th className="p-3 border-r border-[var(--color-border)] text-left">Candidate</th>
            <th className="p-3 text-right">Votes</th>
          </tr>
        </thead>
        <tbody>
          {results.map(({ name, candidate_name, votes }) => (
            <tr key={candidate_name || name} className="odd:bg-[var(--color-bg-alt)]">
              <td className="p-3 border-r border-[var(--color-border)]">{candidate_name || name}</td>
              <td className="p-3 text-right font-mono">{votes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
