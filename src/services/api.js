const API_BASE = "http://localhost/backend/api";

export async function register(email, password, nin) {
  const res = await fetch(`${API_BASE}/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, nin }),
  });
  return res.json();
}

export async function login(email, password, nin) {
  const res = await fetch(`${API_BASE}/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, nin }),
  });
  return res.json();
}

export async function getElections() {
  const res = await fetch(`${API_BASE}/getElections.php`);
  return res.json();
}

export async function vote(user_id, election_id, candidate_id) {
  const res = await fetch(`${API_BASE}/vote.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, election_id, candidate_id }),
  });
  return res.json();
}

export async function getResults(election_id) {
  const res = await fetch(`${API_BASE}/results.php?election_id=${election_id}`);
  return res.json();
}

export async function getCandidates(election_id) {
  const res = await fetch(`${API_BASE}/getCandidates.php?election_id=${election_id}`);
  return res.json();
}
