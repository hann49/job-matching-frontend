const API_URL = import.meta.env.VITE_API_URL;
export async function getProfile() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Profile request failed: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
export async function createProfile(skill, education, experience, bio, phone) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ skill, education, experience, bio, phone }),
  });
  if (!response.ok) {
    throw new Error(`Profile request failed: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
export async function updateProfile(skill, education, experience, bio, phone) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ skill, education, experience, bio, phone }),
  });
  if (!response.ok) {
    throw new Error(`Update profile request failed: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
