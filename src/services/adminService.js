const API_URL = import.meta.env.VITE_API_URL;
export async function getAdminStats() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/admin/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Admin statistics request failed: ${response.status}`);
  }

  return await response.json();
}
export async function getAdminUsers() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/admin/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Admin users request failed: ${response.status}`);
  }

  return await response.json();
}
export async function blockAdminUser(userId) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_URL}/admin/users/${userId}/block`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Block user request failed: ${response.status}`);
  }

  return await response.json();
}
export async function unblockAdminUser(userId) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${API_URL}/admin/users/${userId}/unblock`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Unblock user request failed: ${response.status}`);
  }

  return await response.json();
}
export async function deleteAdminUser(userId) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Deleting user request failed: ${response.status}`);
  }

  return await response.json();
}
export async function getAdminJobs() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/admin/jobs`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Admin jobs request failed: ${response.status}`);
  }

  return await response.json();
}
export async function deleteAdminJob(jobId) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/admin/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Deleting job request failed: ${response.status}`);
  }

  return await response.json();
}
