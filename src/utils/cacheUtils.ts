
import { QueryClient } from '@tanstack/react-query';

/**
 * Prefetch data into the query cache with smart cache management
 */
export const prefetchQueries = async (
  queryClient: QueryClient, 
  queries: Array<{
    queryKey: string[],
    queryFn: () => Promise<any>,
    staleTime?: number
  }>
) => {
  await Promise.all(
    queries.map(({ queryKey, queryFn, staleTime = 1000 * 60 * 5 }) => 
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime, // Configurable stale time with default of 5 minutes
        retry: (failureCount) => failureCount < 2 // Retry up to 2 times
      })
    )
  );
};

/**
 * Optimized query invalidation by key with advanced pattern matching
 */
export const invalidateQueriesOptimized = async (
  queryClient: QueryClient, 
  queryKey: string[],
  options?: { 
    exact?: boolean, 
    refetchActive?: boolean,
    refetchInactive?: boolean 
  }
) => {
  await queryClient.invalidateQueries({ 
    queryKey,
    ...options
  });
};

/**
 * Add data directly to the cache without fetching
 */
export const setQueryData = <T>(
  queryClient: QueryClient, 
  queryKey: string[], 
  data: T,
  options?: { 
    updater?: (oldData: T | undefined) => T 
  }
) => {
  if (options?.updater && queryClient.getQueryData(queryKey)) {
    // Update existing data with updater function
    queryClient.setQueryData(queryKey, options.updater);
  } else {
    // Set new data directly
    queryClient.setQueryData(queryKey, data);
  }
};

/**
 * Batch update multiple cache entries for optimized performance
 */
export const batchUpdateQueries = <T>(
  queryClient: QueryClient,
  updates: Array<{ 
    queryKey: string[], 
    data: T | ((oldData: T | undefined) => T)
  }>
) => {
  updates.forEach(({ queryKey, data }) => {
    if (typeof data === 'function') {
      queryClient.setQueryData(queryKey, data);
    } else {
      queryClient.setQueryData(queryKey, data);
    }
  });
};

/**
 * Create optimistic updates for improved UI responsiveness
 */
export const optimisticUpdate = <T, U>(
  queryClient: QueryClient,
  queryKey: string[],
  updateFn: (oldData: T) => T,
  mutationFn: () => Promise<U>
): Promise<U> => {
  // Store previous data
  const previousData = queryClient.getQueryData<T>(queryKey);
  
  // Immediately update cache with optimistic data
  if (previousData) {
    queryClient.setQueryData(queryKey, updateFn(previousData as T));
  }
  
  // Return promise with rollback on error
  return mutationFn().catch(error => {
    // Rollback to previous data on error
    if (previousData) {
      queryClient.setQueryData(queryKey, previousData);
    } else {
      queryClient.invalidateQueries({ queryKey });
    }
    throw error;
  });
};
