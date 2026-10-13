const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function apiUrl(path) {
  if (import.meta.env.PROD && !API_BASE_URL) {
    throw new Error('VITE_API_URL is not configured. Set it to the deployed RoadGuard API origin.');
  }
  return `${API_BASE_URL}${path}`;
}

export async function parseApiResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('The API returned a non-JSON response. Check that VITE_API_URL points to the RoadGuard backend.');
  }
  return response.json();
}
