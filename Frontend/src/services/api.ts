// Use a relative base so the Vite dev server proxy forwards requests to the backend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

// Helper to build absolute API URLs without duplicate slashes
export function apiUrl(path: string) {
  return `${API_BASE_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
