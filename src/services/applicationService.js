const API_URL = import.meta.env.VITE_API_URL;
export async function getMyApplications() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/applications/my`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Application request failed: ${response.status}`);
  }

  return await response.json();
}
export async function updateApplicationStatus(applicationId, status) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_URL}/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    throw new Error(`Application status update failed: ${response.status}`);
  }

  return await response.json();
}
export async function applyToJob(jobId) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/applications/${jobId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Application request failed: ${response.status}`);
  }
  return await response.json();
}
export async function getApplicationsForJob(jobId) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/applications/job/${jobId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Application request failed: ${response.status}`);
  }
  return await response.json();
}
