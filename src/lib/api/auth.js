import api from "$lib/api";
import { jwtDecode } from "jwt-decode";

export async function login(username, password) {
  const url = "/auth/login";
  const body = new URLSearchParams({ username, password });

  try {
    const response = await api.post(url, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      skipInterceptor: true
    });

    const { access_token, token_type } = response.data;

    localStorage.setItem("token", access_token);

    return { access_token, token_type };
  } catch (error) {
    const message = error.response?.data?.detail || error.response?.statusText || error.message;

    throw new Error(message);
  }
}


export function getRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}


