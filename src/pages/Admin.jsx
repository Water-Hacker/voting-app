import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost/backend/api";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchElections();
  }, []);

  async function fetchElections() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/getElections.php`);
      const data = await res.json();
      if (data.success) {
        setElections(data.elections);
      }
    } catch (err) {
      setMessage("Failed to load elections");
    }
    setLoading(false);
  }

  async function handleCreateElection(e) {
    e.preventDefault();
    setMessage("");
    if (!title || !startDate || !endDate) {
      setMessage("Please fill all required fields");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setMessage("End date must be after start date");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/createElection.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, start_date: startDate, end_date: endDate }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Election created successfully");
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        fetchElections();
      } else {
        setMessage(data.message || "Error creating election");
      }
    } catch (err) {
      setMessage("Network error");
    }
    setLoading(false);
  }

  async function handleAddCandidate(e) {
    e.preventDefault();
    if (!selectedElection) {
      setMessage("Select an election first");
      return;
    }
    if (!candidateName.trim()) {
      setMessage("Candidate name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/addCandidate.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ election_id: selectedElection.id, name: candidateName }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Candidate added");
        setCandidateName("");
      } else {
        setMessage(data.message || "Error adding candidate");
      }
    } catch (err) {
      setMessage("Network error");
    }
    setLoading(false);
  }

  async function toggleElectionStatus(election, status) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/toggleElectionStatus.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ election_id: election.id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Election status updated");
        fetchElections();
      } else {
        setMessage(data.message || "Error updating status");
      }
    } catch (err) {
      setMessage("Network error");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-800 rounded mt-10 text-white">
      <h2 className="text-xl mb-4">Admin Panel - Create Election</h2>
      {message && <p className="mb-3">{message}</p>}

      <form onSubmit={handleCreateElection} className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Election Title"
          className="p-2 rounded bg-gray-700 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="p-2 rounded bg-gray-700 text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>
          Start Date and Time:
          <input
            type="datetime-local"
            className="p-2 rounded bg-gray-700 block mt-1 text-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <label>
          End Date and Time:
          <input
            type="datetime-local"
            className="p-2 rounded bg-gray-700 block mt-1 text-white"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          Create Election
        </button>
      </form>

      <hr className="my-6 border-gray-600" />

      <h3 className="text-lg mb-3">Manage Elections</h3>
      {loading && <p>Loading...</p>}
      {elections.length === 0 && !loading && <p>No elections found</p>}

      <ul className="space-y-3 max-h-64 overflow-auto">
        {elections.map((election) => (
          <li
            key={election.id}
            className={`p-3 rounded cursor-pointer ${
              selectedElection?.id === election.id ? "bg-gray-700" : "bg-gray-600"
            }`}
            onClick={() => setSelectedElection(election)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{election.title}</h4>
                <p className="text-sm">{election.description}</p>
                <p className="text-xs mt-1 text-gray-400">
                  {new Date(election.start_date).toLocaleString()} -{" "}
                  {new Date(election.end_date).toLocaleString()}
                </p>
              </div>
              <button
                className={`py-1 px-2 rounded text-sm ${
                  election.is_active ? "bg-red-600" : "bg-green-600"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleElectionStatus(election, election.is_active ? 0 : 1);
                }}
              >
                {election.is_active ? "Stop" : "Start"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedElection && (
        <>
          <hr className="my-6 border-gray-600" />
          <h3 className="text-lg mb-3">Add Candidate to "{selectedElection.title}"</h3>
          <form onSubmit={handleAddCandidate} className="flex gap-2">
            <input
              type="text"
              placeholder="Candidate Name"
              className="p-2 rounded bg-gray-700 text-white flex-grow"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 py-2 px-4 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              Add Candidate
            </button>
          </form>
        </>
      )}
    </div>
  );
}
