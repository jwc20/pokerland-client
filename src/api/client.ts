import { useAuthStore } from "../stores/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function authFetch(
  endpoint: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = useAuthStore.getState().token;

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
  });
}

export async function login(
  username: string,
  password: string
): Promise<{ token: string; user: { id: number; username: string; email: string } }> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

export async function signup(
  username: string,
  email: string,
  password: string
): Promise<{ token: string; user: { id: number; username: string; email: string } }> {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const token = useAuthStore.getState().token;

  if (token) {
    await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }).catch(() => {
      // Logout from server failed, but we still clear client state
    });
  }

  useAuthStore.getState().clearAuth();
}
