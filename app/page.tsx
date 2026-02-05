'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [updatingBusinessId, setUpdatingBusinessId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Refs for latest values in intersection observer callback
  const isLoadingRef = useRef(isLoadingBusinesses);
  const hasMoreRef = useRef(hasMore);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Keep refs updated
  useEffect(() => {
    isLoadingRef.current = isLoadingBusinesses;
    hasMoreRef.current = hasMore;
  }, [isLoadingBusinesses, hasMore]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery.length === 0) {
        setDebouncedSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Fetch businesses
  const fetchBusinesses = useCallback(
    async (resetCursor = false) => {
      setIsLoadingBusinesses(true);

      try {
        const data = await apiFetchBusinesses({
          limit: 10,
          cursor: !resetCursor && cursor ? cursor : undefined,
          search: debouncedSearch || undefined,
          categoryId: selectedCategory || undefined,
          city: selectedCity || undefined,
        });

        const newBusinesses = data.items || [];
        const nextCursor = data.meta?.nextCursor || null;

        if (resetCursor) {
          setBusinesses(newBusinesses);
        } else {
          setBusinesses((prev) => [...prev, ...newBusinesses]);
        }

        setCursor(nextCursor);
        setHasMore(data.meta?.hasNextPage || false);
      } catch (error) {
        console.error('Failed to fetch businesses:', error);
      } finally {
        setIsLoadingBusinesses(false);
      }
    },
    [cursor, debouncedSearch, selectedCategory, selectedCity]
  );

  // Callback ref for the last business element (infinity scroll)
  const lastBusinessElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      console.log('📍 Callback ref called', {
        node: !!node,
        isLoading: isLoadingRef.current,
        hasMore: hasMoreRef.current
      });

      // Disconnect previous observer if exists
      if (observerRef.current) {
        console.log('🧹 Disconnecting previous observer');
        observerRef.current.disconnect();
      }

      if (!node || !hasMoreRef.current) {
        console.log('⏸️ No node or no more items');
        return;
      }

      console.log('✅ Setting up new observer for node');
      observerRef.current = new IntersectionObserver(
        (entries) => {
          console.log('👁️ Intersection callback', {
            isIntersecting: entries[0].isIntersecting,
            intersectionRatio: entries[0].intersectionRatio,
            isLoading: isLoadingRef.current,
            hasMore: hasMoreRef.current,
          });

          if (entries[0].isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
            console.log('🚀 Loading more businesses!');
            fetchBusinesses(false);
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(node);
      console.log('📌 Observer attached to node');
    },
    [fetchBusinesses]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    setBusinesses([]);
    setCursor(null);
    setHasMore(true);
    fetchBusinesses(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory, selectedCity]);

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
                ref={isLastBusiness ? lastBusinessElementRef : null}
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
