'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import DashboardLayout from '@/app/components/DashboardLayout';
import VerificationModal from '@/app/components/VerificationModal';
import {
  fetchVerificationById,
  approveVerification,
  rejectVerification,
  requestVerificationResubmission,
  type VerificationDetail,
} from '@/lib/api';

export default function VerificationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const verificationId = params.id as string;

  const [verification, setVerification] = useState<VerificationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  useEffect(() => {
    async function loadVerification() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchVerificationById(verificationId);
        setVerification(data);
      } catch (err) {
        console.error('Failed to fetch verification:', err);
        setError('Failed to load verification details');
        toast.error('Failed to load verification details');
      } finally {
        setIsLoading(false);
      }
    }

    if (verificationId) {
      loadVerification();
    }
  }, [verificationId]);

  const handleApprove = async (verificationId: string) => {
    try {
      const response = await approveVerification(verificationId);

      // Update local state with new verification status
      setVerification((prev) =>
        prev
          ? {
              ...prev,
              status: response.verificationStatus as 'APPROVED' | 'PENDING' | 'REJECTED',
            }
          : prev
      );

      toast.success('Business verification approved successfully');
      setShowDocumentModal(false);
    } catch (error) {
      console.error('Failed to approve verification:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to approve verification';
      toast.error(errorMessage);
      setShowDocumentModal(false);
    }
  };

  const handleReject = async (verificationId: string, reason: string) => {
    try {
      const response = await rejectVerification(verificationId, reason);

      // Update local state with new verification status
      setVerification((prev) =>
        prev
          ? {
              ...prev,
              status: response.verificationStatus as 'APPROVED' | 'PENDING' | 'REJECTED',
              rejectionReason: reason,
            }
          : prev
      );

      toast.success('Business verification rejected successfully');
      setShowDocumentModal(false);
    } catch (error) {
      console.error('Failed to reject verification:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to reject verification';
      toast.error(errorMessage);
      setShowDocumentModal(false);
    }
  };

  const handleRequestResubmission = async (verificationId: string, reason: string) => {
    try {
      const response = await requestVerificationResubmission(verificationId, reason);

      // Update local state with new verification status
      setVerification((prev) =>
        prev
          ? {
              ...prev,
              status: response.verificationStatus as 'APPROVED' | 'PENDING' | 'REJECTED',
            }
          : prev
      );

      toast.success('Re-submission request sent successfully');
      setShowDocumentModal(false);
    } catch (error) {
      console.error('Failed to request resubmission:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to request resubmission';
      toast.error(errorMessage);
      setShowDocumentModal(false);
    }
  };

  const formatFileType = (type: string): string => {
    return type.replace('BUSINESS_', '');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !verification) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error || 'Verification not found'}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Businesses
          </h1>
          <p className="text-sm text-gray-500">
            Manage business profiles, approvals and activity status.
          </p>
        </div>

        {/* Business card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {verification.business.logo ? (
                  <img
                    src={verification.business.logo.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm font-semibold">
                    {verification.business.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {verification.business.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {verification.business.owner.username || verification.business.owner.email}
                </p>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={() => router.back()}
              className="
                px-8 py-2
                rounded-full
                bg-blue-900
                text-white
                text-sm
                cursor-pointer
                hover:bg-blue-800
                transition
              "
            >
              Back
            </button>
          </div>

          {/* Business details */}
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <p className="text-gray-500">
              Business Name:{' '}
              <span className="text-gray-900 font-medium">
                {verification.business.name}
              </span>
            </p>
            <p className="text-gray-500">
              Email:{' '}
              <span className="text-gray-900 font-medium">
                {verification.business.owner.email || 'N/A'}
              </span>
            </p>
            <p className="text-gray-500">
              Owner:{' '}
              <span className="text-gray-900 font-medium">
                {verification.business.owner.username || verification.business.owner.email || 'N/A'}
              </span>
            </p>
            <p className="text-gray-500">
              City:{' '}
              <span className="text-gray-900 font-medium">
                {verification.business.address.city}
              </span>
            </p>
            <p className="text-gray-500">
              Business ID:{' '}
              <span className="text-gray-900 font-medium">
                {verification.business.id}
              </span>
            </p>
            <p className="text-gray-500">
              Category:{' '}
              <span className="text-gray-900 font-medium">
                {verification.business.category.title}
              </span>
            </p>
          </div>
        </div>

        {/* Verification Document */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
            Verification Document
          </h3>

          <div className="grid grid-cols-2 px-6 py-3 bg-gray-100 text-sm font-medium text-gray-600">
            <span>Document</span>
            <span>Uploaded file</span>
          </div>

          <div className="grid grid-cols-2 px-6 py-4 text-sm text-gray-900">
            <span>Verification File</span>
            <button
              onClick={() => setShowDocumentModal(true)}
              className="text-blue-600 hover:underline cursor-pointer text-left"
            >
              {verification.verificationFile.originalName}
            </button>
          </div>
        </div>

        {/* Verification Status */}
        {verification.status !== 'PENDING' && (
          <div className="bg-white rounded-xl border border-gray-200 mb-8">
            <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
              Verification Status
            </h3>

            <div className="px-6 py-4 space-y-3">
              {/* Status */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Status</span>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    verification.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {verification.status}
                </span>
              </div>

              {/* Submitted At */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Submitted At</span>
                <span className="text-sm text-gray-900 font-medium">
                  {new Date(verification.submittedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Reviewed At */}
              {verification.reviewedAt && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Reviewed At</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {new Date(verification.reviewedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}

              {/* Created At */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Created At</span>
                <span className="text-sm text-gray-900 font-medium">
                  {new Date(verification.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Rejection Reason */}
              {verification.status === 'REJECTED' && verification.rejectionReason && (
                <div className="py-2">
                  <span className="text-sm text-gray-500 block mb-2">Rejection Reason</span>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-900">{verification.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Business Files */}
        {(() => {
          // Filter out verification documents from business files
          const businessFilesOnly = verification.business.files.filter(
            (file) => file.type !== 'BUSINESS_VERIFICATION_DOCUMENT'
          );

          return businessFilesOnly.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200">
              <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
                Business Files
              </h3>

              <div className="grid grid-cols-3 px-6 py-3 bg-gray-100 text-sm font-medium text-gray-600">
                <span>File Name</span>
                <span>Type</span>
                <span>Size</span>
              </div>

              {businessFilesOnly.map((file) => (
                <div
                  key={file.id}
                  className="grid grid-cols-3 px-6 py-4 text-sm items-center text-gray-900 border-t border-gray-100"
                >
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {file.originalName}
                  </a>
                  <span className="text-gray-600">{formatFileType(file.type)}</span>
                  <span className="text-gray-600">
                    {(file.sizeBytes / 1024).toFixed(2)} KB
                  </span>
                </div>
              ))}
            </div>
          ) : null;
        })()}
      </div>

      {/* Document Preview Modal */}
      {showDocumentModal && (
        <VerificationModal
          verification={{
            id: verification.id,
            status: verification.status,
            submittedAt: verification.submittedAt,
            reviewedAt: verification.reviewedAt,
            rejectionReason: verification.rejectionReason,
            createdAt: verification.createdAt,
            verificationFile: verification.verificationFile,
            business: {
              id: verification.business.id,
              name: verification.business.name,
              logo: verification.business.logo,
              owner: verification.business.owner,
            },
          }}
          onClose={() => setShowDocumentModal(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestResubmission={handleRequestResubmission}
        />
      )}
    </DashboardLayout>
  );
}
