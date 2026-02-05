// Business API functions

import apiClient from '../axios';
import { AxiosError } from 'axios';

// Types
export interface BusinessStatusResponse {
  code: number;
  businessId: string;
  status: string;
}

interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
  path: string;
  timestamp: string;
}

export interface Category {
  id: string;
  title: string;
  slug?: string;
}

export interface Business {
  id: string;
  name: string;
  owner?: {
    id: string;
    username: string | null;
    email: string | null;
  };
  status: string;
  category?: {
    id: string;
    title: string;
    slug: string;
  };
  address?: {
    city: string;
    state: string;
    countryCode: string;
    addressLine1: string;
    addressLine2: string | null;
    zip: string;
  };
  logo?: {
    id: string;
    url: string;
    type: string;
    mimeType: string;
    sizeBytes: number;
    originalName: string;
  } | null;
  createdAt: string;
}

export interface BusinessApproval extends Omit<Business, 'status'> {
  approvalStatus: string;
}

export interface FetchBusinessesParams {
  limit?: number;
  cursor?: string;
  search?: string;
  categoryId?: string;
  city?: string;
}

export interface FetchBusinessesResponse {
  items: Business[];
  meta: {
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}

export interface FetchBusinessApprovalsResponse {
  items: BusinessApproval[];
  meta: {
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}

/**
 * Activate a business
 * @param businessId - The ID of the business to activate
 * @returns Promise with the business status response
 */
export async function activateBusiness(
  businessId: string
): Promise<BusinessStatusResponse> {
  try {
    const response = await apiClient.post<BusinessStatusResponse>(
      `/admin/businesses/${businessId}/activate`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const message =
      axiosError.response?.data?.message || 'Failed to activate business';
    throw new Error(message);
  }
}

/**
 * Deactivate a business
 * @param businessId - The ID of the business to deactivate
 * @returns Promise with the business status response
 */
export async function deactivateBusiness(
  businessId: string
): Promise<BusinessStatusResponse> {
  try {
    const response = await apiClient.post<BusinessStatusResponse>(
      `/admin/businesses/${businessId}/deactivate`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const message =
      axiosError.response?.data?.message || 'Failed to deactivate business';
    throw new Error(message);
  }
}

/**
 * Fetch categories
 * @returns Promise with array of categories
 */
export async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
}

/**
 * Fetch paginated businesses with filters
 * @param params - Filter parameters (limit, cursor, search, categoryId, city)
 * @returns Promise with businesses and pagination metadata
 */
export async function fetchBusinesses(
  params: FetchBusinessesParams
): Promise<FetchBusinessesResponse> {
  const response = await apiClient.get<FetchBusinessesResponse>(
    '/admin/businesses',
    { params }
  );
  return response.data;
}

/**
 * Fetch businesses for approval with filters
 * @param params - Filter parameters (limit, cursor, search, categoryId, city)
 * @returns Promise with business approvals and pagination metadata
 */
export async function fetchBusinessApprovals(
  params: FetchBusinessesParams
): Promise<FetchBusinessApprovalsResponse> {
  const response = await apiClient.get<FetchBusinessApprovalsResponse>(
    '/admin/business-approvals',
    { params }
  );
  return response.data;
}
