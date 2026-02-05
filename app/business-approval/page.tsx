'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import FilterBar from '@/app/components/FilterBar';
import BusinessApprovalCard from '@/app/components/BusinessApprovalCard';
import {
  fetchCategories,
  fetchBusinessApprovals as apiFetchBusinessApprovals,
} from '@/lib/api';

interface Business {
  id: string;
  name: string;
  owner?: {
    id: string;
    username: string | null;
    email: string | null;
  };
  approvalStatus: string;
  category?: {
    id: string;
    title: string;
    slug: string;
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

export default function BusinessApprovalPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

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

  // Fetch businesses for approval
  const fetchBusinesses = useCallback(
    async (reset: boolean = false) => {
      if (isLoadingRef.current || (!reset && !hasMoreRef.current)) {
        return;
      }

      setIsLoadingBusinesses(true);

      try {
        const data = await apiFetchBusinessApprovals({
          limit: 10,
          cursor: !reset && cursor ? cursor : undefined,
          search: debouncedSearch || undefined,
          categoryId: selectedCategory || undefined,
          city: selectedCity || undefined,
        });

        if (data.items && Array.isArray(data.items)) {
          setBusinesses((prev) => (reset ? data.items : [...prev, ...data.items]));
          setCursor(data.meta?.nextCursor || null);
          setHasMore(data.meta?.hasNextPage || false);
        }
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
      // Disconnect previous observer if exists
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasMoreRef.current) {
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
            fetchBusinesses(false);
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(node);
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

  const handleViewDocuments = (businessId: string) => {
    console.log('View documents for business:', businessId);
    // TODO: Implement document viewing logic
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

        {/* Business Grid */}
        {businesses.length === 0 && !isLoadingBusinesses ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No businesses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business, index) => {
              const isLastBusiness = index === businesses.length - 1;

              return (
                <BusinessApprovalCard
                  key={business.id}
                  business={business}
                  onViewDocuments={handleViewDocuments}
                  ref={isLastBusiness ? lastBusinessElementRef : null}
                />
              );
            })}
          </div>
        )}

        {/* Loading indicator */}
        {isLoadingBusinesses && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
