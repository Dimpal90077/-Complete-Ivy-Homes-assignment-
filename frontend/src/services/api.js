const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD;

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
      "X-API-Password": API_PASSWORD,

      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),

      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.detail ||
      data.error ||
      "API request failed"
    );
  }

  return data;
}

export async function getListings(params = "") {
  return apiRequest(`/listings${params}`);
}

export async function getRentals(params = "") {
  return apiRequest(`/rentals${params}`);
}

export async function getProjects(params = "") {
  return apiRequest(`/projects${params}`);
}

export async function loginUser(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}