import { useState, useEffect, useRef, useCallback } from 'react';

// Generic fetch parameters
export interface FetchParams {
  limit?: number;
  cursor?: string;
  search?: string;
  categoryId?: string;
  city?: string;
}

// Generic fetch response structure
export interface FetchResponse<T> {
  items: T[];
  meta: {
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}

// Hook parameters
export interface UseInfiniteScrollParams<T> {
  fetchFunction: (params: FetchParams) => Promise<FetchResponse<T>>;
  filters: {
    search: string;
    categoryId?: string;
    city?: string;
  };
  limit?: number;
}

// Hook return value
export interface UseInfiniteScrollReturn<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  lastElementRef: (node: HTMLDivElement | null) => void;
  refresh: () => void;
}

/**
 * Custom hook for infinite scroll with cursor-based pagination
 *
 * @param fetchFunction - Function that fetches paginated data
 * @param filters - Search and filter parameters
 * @param limit - Number of items per page (default: 10)
 * @returns Object containing items, loading state, and scroll ref
 *
 * @example
 * const { items, isLoading, lastElementRef } = useInfiniteScroll({
 *   fetchFunction: fetchBusinesses,
 *   filters: { search: searchQuery, categoryId: selectedCategory },
 *   limit: 10
 * });
 */
export function useInfiniteScroll<T>({
  fetchFunction,
  filters,
  limit = 10,
}: UseInfiniteScrollParams<T>): UseInfiniteScrollReturn<T> {
  // State
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Refs for latest values in intersection observer callback
  const isLoadingRef = useRef(isLoading);
  const hasMoreRef = useRef(hasMore);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Keep refs updated with latest state
  useEffect(() => {
    isLoadingRef.current = isLoading;
    hasMoreRef.current = hasMore;
  }, [isLoading, hasMore]);

  // Debounce search input (500ms delay, minimum 3 characters)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search.length >= 3 || filters.search.length === 0) {
        setDebouncedSearch(filters.search);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch data function
  const fetchData = useCallback(
    async (reset: boolean = false) => {
      // Prevent duplicate fetches
      if (isLoadingRef.current || (!reset && !hasMoreRef.current)) {
        return;
      }

      setIsLoading(true);

      try {
        const data = await fetchFunction({
          limit,
          cursor: !reset && cursor ? cursor : undefined,
          search: debouncedSearch || undefined,
          categoryId: filters.categoryId || undefined,
          city: filters.city || undefined,
        });

        if (data.items && Array.isArray(data.items)) {
          setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
          setCursor(data.meta?.nextCursor || null);
          setHasMore(data.meta?.hasNextPage || false);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [cursor, debouncedSearch, filters.categoryId, filters.city, fetchFunction, limit]
  );

  // Callback ref for the last element (infinite scroll trigger)
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Disconnect previous observer if exists
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Don't create observer if no node or no more data
      if (!node || !hasMoreRef.current) {
        return;
      }

      // Create new IntersectionObserver
      observerRef.current = new IntersectionObserver(
        (entries) => {
          // Load more when last element is visible
          if (entries[0].isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
            fetchData(false);
          }
        },
        { threshold: 0.1 } // Trigger when 10% of element is visible
      );

      observerRef.current.observe(node);
    },
    [fetchData]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    setItems([]);
    setCursor(null);
    setHasMore(true);
    fetchData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.categoryId, filters.city]);

  // Refresh function for manual reload
  const refresh = useCallback(() => {
    setItems([]);
    setCursor(null);
    setHasMore(true);
    fetchData(true);
  }, [fetchData]);

  return {
    items,
    isLoading,
    hasMore,
    lastElementRef,
    refresh,
  };
}
