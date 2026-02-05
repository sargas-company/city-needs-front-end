// Auth API functions

import apiClient from '../axios';

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  username: string | null;
  role: 'END_USER' | 'BUSINESS_OWNER' | 'ADMIN' | null;
  status: string;
}

interface FetchUserDataResponse {
  code: number;
  data: {
    user: User;
  };
  message: string;
}

/**
 * Fetch current user data from API using Firebase token
 * @returns User object or null if fetch fails
 */
export async function fetchUserData(): Promise<User | null> {
  try {
    const response = await apiClient.get<FetchUserDataResponse>('/auth/me');

    // API returns: { code, data: { user: {...} }, message }
    // Extract user data from the nested structure
    if (response.data?.data?.user) {
      return response.data.data.user;
    }

    throw new Error('Invalid response structure');
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
}
