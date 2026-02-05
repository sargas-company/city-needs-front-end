// Auth utility functions for Firebase

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('firebase_token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;

  // Save to localStorage
  localStorage.setItem('firebase_token', token);

  // Save to cookie for middleware
  document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;

  // Remove from localStorage
  localStorage.removeItem('firebase_token');

  // Remove from cookie
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
}

/**
 * Get auth headers for fetch requests
 * @deprecated Use axios instance from lib/axios.ts instead - it handles auth automatically
 */
export function getAuthHeaders(): HeadersInit {
  const token = getToken();

  if (!token) {
    return {
      'Content-Type': 'application/json',
    };
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Check if user has admin role
export function isAdmin(role: string | null | undefined): boolean {
  return role === 'ADMIN';
}
