'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from './components/DashboardLayout';
import BusinessCard from './components/BusinessCard';
import FilterBar from './components/FilterBar';
import {
  activateBusiness,
  deactivateBusiness,
  fetchCategories,
  fetchBusinesses as apiFetchBusinesses,
} from '@/lib/api';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface Business {
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

interface Category {
  id: string;
  title: string;
}

export default function Home() {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [updatingBusinessId, setUpdatingBusinessId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Use infinite scroll hook
  const {
    items: businessesFromHook,
    isLoading: isLoadingBusinesses,
    hasMore,
    lastElementRef,
  } = useInfiniteScroll<Business>({
    fetchFunction: apiFetchBusinesses,
    filters: {
      search: searchQuery,
      categoryId: selectedCategory,
      city: selectedCity,
    },
    limit: 10,
  });

  // Local state for optimistic updates on status toggle
  const [businesses, setBusinesses] = useState<Business[]>([]);

  // Sync businesses with hook's items
  useEffect(() => {
    setBusinesses(businessesFromHook);
  }, [businessesFromHook]);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        setCategories(categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleStatusToggle = async (businessId: string, currentStatus: string) => {
    // Prevent multiple simultaneous requests
    if (updatingBusinessId) return;

    setUpdatingBusinessId(businessId);
    const isActive = ['ACTIVE', 'PENDING', 'REJECTED'].includes(currentStatus);

    try {
      // Call appropriate API function
      const data = isActive
        ? await deactivateBusiness(businessId)
        : await activateBusiness(businessId);

      // Success case - update business status in state
      if (data.code === 200 && data.status) {
        setBusinesses((prevBusinesses) =>
          prevBusinesses.map((business) =>
            business.id === businessId
              ? { ...business, status: data.status }
              : business
          )
        );

        // Show success notification
        if (isActive) {
          toast.success('Business deactivated');
        } else {
          toast.success('Business activated');
        }
      }
    } catch (error) {
      console.error('Failed to toggle business status:', error);
      // Show error message from API
      toast.error(error instanceof Error ? error.message : 'An error occurred while updating business status');
    } finally {
      setUpdatingBusinessId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Businesses</h1>
          <p className="text-gray-600">
            Manage business profiles, approvals and activity status.
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

        {/* Business Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business, index) => {
            const isLastBusiness = index === businesses.length - 1;
            const isUpdating = updatingBusinessId === business.id;
            const isDisabled = !!updatingBusinessId;

            return (
              <BusinessCard
                key={business.id}
                business={business}
                onStatusToggle={handleStatusToggle}
                isUpdating={isUpdating}
                isDisabled={isDisabled}
                ref={isLastBusiness ? lastElementRef : null}
              />
            );
          })}
        </div>

        {/* Loading indicator */}
        {isLoadingBusinesses && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading...</div>
          </div>
        )}

        {/* No results */}
        {!isLoadingBusinesses && businesses.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <p className="text-gray-600 text-lg mb-2">No businesses found</p>
              <p className="text-gray-500 text-sm">
                Try adjusting your filters or search query
              </p>
            </div>
          </div>
        )}

        {/* End of list */}
        {!hasMore && businesses.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500 text-sm">No more businesses to load</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
