const API_URL = import.meta.env.VITE_API_URL;
export async function createJob(title, description, requiredskill, deadline) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, requiredskill, deadline }),
  });
  if (!response.ok) {
    throw new Error(`Job request failed: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
export async function getJobs(search = "") {
  const url = new URL(`${API_URL}/jobs`);

  if (search.trim()) {
    url.searchParams.set("search", search.trim());
  }

  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load jobs");
  }

  return data;
}
export async function getJob(jobId) {
  const response = await fetch(`${API_URL}/jobs/${jobId}`);
  if (!response.ok) {
    throw new Error(`Job request failed: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
export async function getMyJobs() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/jobs/my`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`My Jobs request failed: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
export async function updateJob(
  jobId,
  title,
  description,
  requiredskill,
  deadline,
) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
      requiredskill,
      deadline,
    }),
  });

  if (!response.ok) {
    throw new Error(`Update job request failed: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
export async function deleteJob(jobId) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Delete job request failed: ${response.status}`);
  }

  return await response.json();
}
