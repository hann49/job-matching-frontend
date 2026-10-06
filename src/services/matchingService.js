const API_URL = import.meta.env.VITE_API_URL;
export async function generateMatches() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/matching`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Matching request failed: ${response.status}`);
  }

  return await response.json();
}

export async function getMatches() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/matching`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Matching request failed: ${response.status}`);
  }

  return await response.json();
}
export async function getCandidatesForJob(jobId) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/matching/job/${jobId}/candidates`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Candidates request failed: ${response.status}`);
  }
  return await response.json();
}
