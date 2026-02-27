'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import DashboardLayout from '@/app/components/DashboardLayout';
import FilterBar from '@/app/components/FilterBar';
import VerificationCard from '@/app/components/VerificationCard';
import VerificationModal from '@/app/components/VerificationModal';
import {
  fetchCategories,
  fetchVerifications as apiFetchVerifications,
  approveVerification,
  rejectVerification,
  requestVerificationResubmission,
  type Verification,
} from '@/lib/api';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface Category {
  id: string;
  title: string;
}

export default function BusinessApprovalPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Modal state
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Use infinite scroll hook
  const {
    items: verificationsFromHook,
    isLoading: isLoadingVerifications,
    hasMore,
    lastElementRef,
  } = useInfiniteScroll<Verification>({
    fetchFunction: apiFetchVerifications,
    filters: {
      search: searchQuery,
      categoryId: selectedCategory,
      city: selectedCity,
    },
    limit: 10,
  });

  // Local state for optimistic updates
  const [verifications, setVerifications] = useState<Verification[]>([]);

  // Sync verifications with hook's items
  useEffect(() => {
    setVerifications(verificationsFromHook);
  }, [verificationsFromHook]);

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const categories = await fetchCategories();
        setCategories(categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  const handleViewDocument = (verification: Verification) => {
    setSelectedVerification(verification);
  };

  const handleCloseModal = () => {
    setSelectedVerification(null);
  };

  const handleApprove = async (verificationId: string) => {
    try {
      const response = await approveVerification(verificationId);

      // Update local state with new verification status
      setVerifications((prev) =>
        prev.map((verification) =>
          verification.id === verificationId
            ? { ...verification, status: response.verificationStatus as 'APPROVED' | 'PENDING' | 'REJECTED' }
            : verification
        )
      );

      toast.success('Business verification approved successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Failed to approve verification:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to approve verification';
      toast.error(errorMessage);
      handleCloseModal();
    }
  };

  const handleReject = async (verificationId: string, reason: string) => {
    try {
      const response = await rejectVerification(verificationId, reason);

      // Update local state with new verification status
      setVerifications((prev) =>
        prev.map((verification) =>
          verification.id === verificationId
            ? { ...verification, status: response.verificationStatus as 'APPROVED' | 'PENDING' | 'REJECTED' }
            : verification
        )
      );

      toast.success('Business verification rejected successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Failed to reject verification:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to reject verification';
      toast.error(errorMessage);
      handleCloseModal();
    }
  };

  const handleRequestResubmission = async (verificationId: string, reason: string) => {
    try {
      const response = await requestVerificationResubmission(verificationId, reason);

      // Update local state with new verification status
      setVerifications((prev) =>
        prev.map((verification) =>
          verification.id === verificationId
            ? { ...verification, status: response.verificationStatus as 'APPROVED' | 'PENDING' | 'REJECTED' }
            : verification
        )
      );

      toast.success('Re-submission request sent successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Failed to request resubmission:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to request resubmission';
      toast.error(errorMessage);
      handleCloseModal();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Approval</h1>
          <p className="text-gray-600">
            Review and approve business registration applications.
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedCity={selectedCity}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onCityChange={setSelectedCity}
        />

        {/* Verifications Grid */}
        {verifications.length === 0 && !isLoadingVerifications ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No verifications found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verifications.map((verification, index) => {
              const isLast = index === verifications.length - 1;

              return (
                <VerificationCard
                  key={verification.id}
                  verification={verification}
                  onViewDocument={handleViewDocument}
                  ref={isLast ? lastElementRef : null}
                />
              );
            })}
          </div>
        )}

        {/* Loading indicator */}
        {isLoadingVerifications && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {selectedVerification && (
        <VerificationModal
          verification={selectedVerification}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestResubmission={handleRequestResubmission}
        />
      )}
    </DashboardLayout>
  );
}
