// Statistics API functions

import apiClient from '../axios';

// Types

/**
 * Business category statistics
 */
export interface BusinessesByCategory {
  categoryId: string;
  title: string;
  count: number;
}

/**
 * Platform totals
 */
export interface StatisticsTotals {
  users: number;
  businesses: number;
  newUsers: number;
  reels: number;
}

/**
 * Statistics summary response
 */
export interface StatisticsSummary {
  businessesByCategory: BusinessesByCategory[];
  totals: StatisticsTotals;
}

/**
 * Fetch platform statistics summary
 * @returns Promise with statistics data
 */
export async function fetchStatisticsSummary(): Promise<StatisticsSummary> {
  const response = await apiClient.get<StatisticsSummary>(
    '/admin/statistics/summary'
  );
  return response.data;
}
