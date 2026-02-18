'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import DashboardLayout from '@/app/components/DashboardLayout';
import VerificationModal from '@/app/components/VerificationModal';
import BusinessVideoReviewModal from '@/app/components/BusinessVideoReviewModal';
import { Play, Ban } from 'lucide-react';
import {
  fetchBusinessById,
  approveVerification,
  rejectVerification,
  requestVerificationResubmission,
  approveBusinessVideo,
  rejectBusinessVideo,
  requestBusinessVideoResubmission,
  type BusinessDetail,
} from '@/lib/api';

export default function VerificationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;

  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showVideoReviewModal, setShowVideoReviewModal] = useState(false);

  useEffect(() => {
    async function loadBusiness() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchBusinessById(businessId);
        setBusiness(data);
      } catch (err) {
        console.error('Failed to fetch business:', err);
        setError('Failed to load business details');
        toast.error('Failed to load business details');
      } finally {
        setIsLoading(false);
      }
    }

    if (businessId) {
      loadBusiness();
    }
  }, [businessId]);

  const handleApprove = async (verificationId: string) => {
    try {
      await approveVerification(verificationId);

      // Reload business data to get updated verification status
      const updatedBusiness = await fetchBusinessById(businessId);
      setBusiness(updatedBusiness);

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
      await rejectVerification(verificationId, reason);

      // Reload business data to get updated verification status
      const updatedBusiness = await fetchBusinessById(businessId);
      setBusiness(updatedBusiness);

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
      await requestVerificationResubmission(verificationId, reason);

      // Reload business data to get updated verification status
      const updatedBusiness = await fetchBusinessById(businessId);
      setBusiness(updatedBusiness);

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

  const handleVideoApprove = async () => {
    if (!business?.video) return;
    try {
      await approveBusinessVideo(business.video.id);
      const updatedBusiness = await fetchBusinessById(businessId);
      setBusiness(updatedBusiness);
      toast.success('Business video approved successfully');
      setShowVideoReviewModal(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to approve video');
    }
  };

  const handleVideoReject = async (reason: string) => {
    if (!business?.video) return;
    try {
      await rejectBusinessVideo(business.video.id, reason);
      const updatedBusiness = await fetchBusinessById(businessId);
      setBusiness(updatedBusiness);
      toast.success('Business video rejected successfully');
      setShowVideoReviewModal(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to reject video');
    }
  };

  const handleVideoResubmission = async (reason: string) => {
    if (!business?.video) return;
    try {
      await requestBusinessVideoResubmission(business.video.id, reason);
      const updatedBusiness = await fetchBusinessById(businessId);
      setBusiness(updatedBusiness);
      toast.success('Video re-submission request sent successfully');
      setShowVideoReviewModal(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to request video resubmission');
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

  if (error || !business) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error || 'Business not found'}</p>
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

  // Get the latest verification (most recent one)
  const latestVerification = business.verifications.length > 0
    ? business.verifications[business.verifications.length - 1]
    : null;

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
                {business.logo ? (
                  <img
                    src={business.logo.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm font-semibold">
                    {business.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {business.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {business.owner.username || business.owner.email}
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
                {business.name}
              </span>
            </p>
            <p className="text-gray-500">
              Email:{' '}
              <span className="text-gray-900 font-medium">
                {business.owner.email || 'N/A'}
              </span>
            </p>
            <p className="text-gray-500">
              Owner:{' '}
              <span className="text-gray-900 font-medium">
                {business.owner.username || business.owner.email || 'N/A'}
              </span>
            </p>
            <p className="text-gray-500">
              City:{' '}
              <span className="text-gray-900 font-medium">
                {business.address.city}
              </span>
            </p>
            <p className="text-gray-500">
              Business ID:{' '}
              <span className="text-gray-900 font-medium">
                {business.id}
              </span>
            </p>
            <p className="text-gray-500">
              Category:{' '}
              <span className="text-gray-900 font-medium">
                {business.category.title}
              </span>
            </p>
          </div>
        </div>

        {/* Verification Document */}
        {latestVerification && (
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
                {latestVerification.verificationFile.originalName}
              </button>
            </div>
          </div>
        )}

        {/* Verification Status */}
        {latestVerification && latestVerification.status !== 'PENDING' && (
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
                    latestVerification.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {latestVerification.status}
                </span>
              </div>

              {/* Submitted At */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Submitted At</span>
                <span className="text-sm text-gray-900 font-medium">
                  {new Date(latestVerification.submittedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Reviewed At */}
              {latestVerification.reviewedAt && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Reviewed At</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {new Date(latestVerification.reviewedAt).toLocaleString('en-US', {
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
                  {new Date(latestVerification.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Rejection Reason */}
              {latestVerification.status === 'REJECTED' && latestVerification.rejectionReason && (
                <div className="py-2">
                  <span className="text-sm text-gray-500 block mb-2">Rejection Reason</span>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-900">{latestVerification.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Business Files */}
        {(() => {
          // Filter out verification documents from business files
          const businessFilesOnly = business.files.filter(
            (file) => file.type !== 'BUSINESS_VERIFICATION_DOCUMENT' && file.type !== 'BUSINESS_VIDEO'
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
                    className="text-blue-600 hover:underline cursor-pointer truncate"
                    title={file.originalName}
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

        {/* Business Video */}
        {business.video && (
          <div className="bg-white rounded-xl border border-gray-200 mt-8">
            <h3 className="px-6 py-4 text-lg font-semibold text-gray-900">
              Business Video
            </h3>

            <div className="grid grid-cols-3 px-6 py-3 bg-gray-100 text-sm font-medium text-gray-600">
              <span>Video</span>
              <span>Uploaded video</span>
              <span className="text-right">Verification</span>
            </div>

            <div className="grid grid-cols-3 px-6 py-4 text-sm items-center text-gray-900 border-t border-gray-100">
              <span>Business Video</span>
              <div>
                {business.video.processingStatus === 'READY' ? (
                  <a
                    href={business.video.processedUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <Play className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">
                      {business.name}
                    </span>
                  </a>
                ) : (
                  <span className="text-gray-600">{business.video.processingStatus}</span>
                )}
              </div>
              <div className="flex justify-end">
                {business.video.processingStatus === 'READY' ? (
                  <button
                    onClick={() => {
                      if (business.video?.status === 'PENDING') {
                        setShowVideoReviewModal(true);
                      }
                    }}
                    className={`text-sm text-gray-700 ${
                      business.video.status === 'PENDING'
                        ? 'cursor-pointer hover:text-gray-900'
                        : 'cursor-default'
                    }`}
                  >
                    {business.video.status.charAt(0) + business.video.status.slice(1).toLowerCase()}
                  </button>
                ) : (
                  <Ban className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {showDocumentModal && latestVerification && (
        <VerificationModal
          verification={{
            id: latestVerification.id,
            status: latestVerification.status,
            submittedAt: latestVerification.submittedAt,
            reviewedAt: latestVerification.reviewedAt,
            rejectionReason: latestVerification.rejectionReason,
            createdAt: latestVerification.createdAt,
            verificationFile: latestVerification.verificationFile,
            business: {
              id: business.id,
              name: business.name,
              logo: business.logo,
              owner: business.owner,
            },
          }}
          onClose={() => setShowDocumentModal(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestResubmission={handleRequestResubmission}
        />
      )}

      {/* Business Video Review Modal */}
      {showVideoReviewModal && business.video && (
        <BusinessVideoReviewModal
          onClose={() => setShowVideoReviewModal(false)}
          onApprove={handleVideoApprove}
          onReject={handleVideoReject}
          onRequestResubmission={handleVideoResubmission}
        />
      )}
    </DashboardLayout>
  );
}
