import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';

// Generic type for the data returned by the query function
type QueryFunctionResult<T> = Promise<T>;
type QueryFunction<T> = () => QueryFunctionResult<T>;

/**
 * An optimized hook for data fetching with built-in error handling and caching
 * 
 * @param queryKey - The key for the query cache
 * @param queryFn - The function that fetches the data
 * @param options - Additional options for the query
 * @returns UseQueryResult<T, Error>
 */
export function useOptimizedQuery<T>(
  queryKey: string[], 
  queryFn: QueryFunction<T>,
  options: Omit<UseQueryOptions<T, Error, T, string[]>, 'queryKey' | 'queryFn'> = {}
): UseQueryResult<T, Error> {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes by default
    retry: (failureCount, error) => {
      // Don't retry on 404s or unauthorized errors
      if (
        error instanceof Error && 
        (error.message.includes('404') || error.message.includes('401'))
      ) {
        return false;
      }
      // Otherwise retry twice
      return failureCount < 2;
    },
    refetchOnWindowFocus: false, // Don't refetch when window focuses by default
    ...options,
    meta: {
      ...options.meta,
    },
  });
}

// Custom onError callback that can be used with useQuery
export const handleQueryError = (error: Error, queryKey: string[]) => {
  console.error(`Query error for ${queryKey.join('.')}:`, error);
  toast.error('Failed to load data. Please try again later.');
};

export default useOptimizedQuery;
