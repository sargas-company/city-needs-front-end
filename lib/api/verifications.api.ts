// Verifications API functions

import apiClient from '../axios';

// Types

/**
 * Verification file attached to business verification submission
 */
export interface VerificationFile {
  id: string;
  url: string;
  mimeType: string;
  originalName: string;
}

/**
 * Business entity nested in verification (list view)
 */
export interface VerificationBusiness {
  id: string;
  name: string;
  logo: {
    id: string;
    url: string;
    type: string;
  } | null;
  owner: {
    email: string | null;
    username: string | null;
  };
}

/**
 * Extended business entity for verification detail view
 */
export interface VerificationBusinessDetail {
  id: string;
  name: string;
  logo: {
    id: string;
    url: string;
    type: string;
  } | null;
  owner: {
    email: string | null;
    username: string | null;
  };
  category: {
    id: string;
    title: string;
    slug: string;
    description: string;
    requiresVerification: boolean;
    gracePeriodHours: number;
  };
  address: {
    id: string;
    countryCode: string;
    city: string;
    state: string;
    addressLine1: string;
    addressLine2: string | null;
    zip: string;
  };
  files: Array<{
    id: string;
    url: string;
    type: string;
    mimeType: string;
    sizeBytes: number;
    originalName: string;
    createdAt: string;
  }>;
}

/**
 * Main verification entity (list view)
 */
export interface Verification {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  verificationFile: VerificationFile;
  business: VerificationBusiness;
}

/**
 * Detailed verification entity (detail view)
 */
export interface VerificationDetail {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  verificationFile: VerificationFile;
  business: VerificationBusinessDetail;
}

/**
 * Request parameters for fetching verifications
 */
export interface FetchVerificationsParams {
  limit?: number;
  cursor?: string;
  search?: string;
  categoryId?: string;
  city?: string;
}

/**
 * API response for verifications list
 */
export interface FetchVerificationsResponse {
  items: Verification[];
  meta: {
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}

/**
 * Fetch business verifications for admin approval
 * @param params - Filter parameters (limit, cursor, search, categoryId, city)
 * @returns Promise with verifications and pagination metadata
 */
export async function fetchVerifications(
  params: FetchVerificationsParams
): Promise<FetchVerificationsResponse> {
  const response = await apiClient.get<FetchVerificationsResponse>(
    '/admin/verifications',
    { params }
  );
  return response.data;
}

/**
 * Fetch a single verification by ID
 * @param verificationId - The ID of the verification to fetch
 * @returns Promise with detailed verification data
 */
export async function fetchVerificationById(
  verificationId: string
): Promise<VerificationDetail> {
  const response = await apiClient.get<VerificationDetail>(
    `/admin/verifications/${verificationId}`
  );
  return response.data;
}

/**
 * Signed URL response from file service
 */
export interface SignedUrlResponse {
  code: number;
  url: string;
  expiresAt: string;
}

/**
 * Get signed URL for viewing a file
 * @param fileId - The ID of the file to get signed URL for
 * @returns Promise with signed URL and expiration
 */
export async function getFileSignedUrl(fileId: string): Promise<SignedUrlResponse> {
  const response = await apiClient.get<SignedUrlResponse>(
    `/files/${fileId}/signed-url`
  );
  return response.data;
}

/**
 * Approve verification response
 */
export interface ApproveVerificationResponse {
  code: number;
  verificationId: string;
  verificationStatus: string;
  businessId: string;
  businessStatus: string;
}

/**
 * Approve a business verification
 * @param verificationId - The ID of the verification to approve
 * @returns Promise with verification and business status
 */
export async function approveVerification(
  verificationId: string
): Promise<ApproveVerificationResponse> {
  const response = await apiClient.post<ApproveVerificationResponse>(
    `/admin/verifications/${verificationId}/approve`
  );
  return response.data;
}

/**
 * Reject verification response (same format as approve)
 */
export interface RejectVerificationResponse {
  code: number;
  verificationId: string;
  verificationStatus: string;
  businessId: string;
  businessStatus: string;
}

/**
 * Reject a business verification
 * @param verificationId - The ID of the verification to reject
 * @param rejectionReason - The reason for rejection (required, max 500 chars)
 * @returns Promise with verification and business status
 */
export async function rejectVerification(
  verificationId: string,
  rejectionReason: string
): Promise<RejectVerificationResponse> {
  const response = await apiClient.post<RejectVerificationResponse>(
    `/admin/verifications/${verificationId}/reject`,
    { rejectionReason }
  );
  return response.data;
}

/**
 * Request resubmission response
 */
export interface RequestResubmissionResponse {
  verificationId: string;
  verificationStatus: string;
  businessId: string;
  businessStatus: string;
}

/**
 * Request resubmission for a business verification
 * @param verificationId - The ID of the verification to request resubmission for
 * @param resubmissionReason - The reason for requesting resubmission (required, max 500 chars)
 * @returns Promise with verification and business status
 */
export async function requestVerificationResubmission(
  verificationId: string,
  resubmissionReason: string
): Promise<RequestResubmissionResponse> {
  const response = await apiClient.post<RequestResubmissionResponse>(
    `/admin/verifications/${verificationId}/resubmission`,
    { resubmissionReason }
  );
  return response.data;
}
