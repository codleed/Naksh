import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { createResource } from '../utils/api';

// Generic hooks for CRUD operations
export const useResource = <T = any>(endpoint: string) => {
  const resource = createResource<T>(endpoint);
  
  // Get all items
  const useGetAll = (params: Record<string, any> = {}, queryOptions: any = {}) => {
    return useQuery({
      queryKey: [endpoint, 'list', params],
      queryFn: () => resource.getAll(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...queryOptions,
    });
  };

  // Get single item by ID
  const useGetById = (id: string | number, queryOptions: any = {}) => {
    return useQuery({
      queryKey: [endpoint, 'detail', id],
      queryFn: () => resource.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...queryOptions,
    });
  };

  // Create new item
  const useCreate = (mutationOptions: any = {}) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: resource.create,
      onSuccess: (data: T) => {
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: [endpoint, 'list'] });
        
        // Add to cache if data has an id
        if (data && 'id' in data) {
          queryClient.setQueryData([endpoint, 'detail', (data as any).id], data);
        }
      },
      ...mutationOptions,
    });
  };

  // Update existing item
  const useUpdate = (mutationOptions: any = {}) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ id, data }: { id: string | number; data: Partial<T> }) => resource.update(id, data),
      onSuccess: (data: T, variables: { id: string | number; data: Partial<T> }) => {
        // Update item in cache
        queryClient.setQueryData([endpoint, 'detail', variables.id], data);
        
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: [endpoint, 'list'] });
      },
      ...mutationOptions,
    });
  };

  // Delete item
  const useDelete = (mutationOptions: any = {}) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: resource.delete,
      onSuccess: (_: void, id: string | number) => {
        // Remove from cache
        queryClient.removeQueries({ queryKey: [endpoint, 'detail', id] });
        
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: [endpoint, 'list'] });
      },
      ...mutationOptions,
    });
  };

  return {
    useGetAll,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
  };
};

// Example usage for specific resources
export const useUsers = () => useResource('/users');
export const usePosts = () => useResource('/posts');
export const useComments = () => useResource('/comments');

// Hook for search functionality
export const useSearch = <T = any>(
  endpoint: string, 
  searchTerm: string, 
  options: any = {}
) => {
  const resource = createResource<T>(endpoint);
  
  return useQuery({
    queryKey: [endpoint, 'search', searchTerm],
    queryFn: () => resource.getAll({ search: searchTerm }),
    enabled: !!searchTerm && searchTerm.length >= 2, // Only search if term is at least 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    ...options,
  });
};

// Hook for optimistic updates
export const useOptimisticUpdate = <T = any>(endpoint: string) => {
  const queryClient = useQueryClient();
  
  const optimisticUpdate = async (
    id: string | number, 
    updateData: Partial<T>, 
    mutationFn: () => Promise<T>
  ): Promise<T> => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: [endpoint, 'detail', id] });
    
    // Snapshot previous value
    const previousData = queryClient.getQueryData<T>([endpoint, 'detail', id]);
    
    // Optimistically update
    queryClient.setQueryData<T>([endpoint, 'detail', id], (old) => ({
      ...old,
      ...updateData,
    } as T));
    
    try {
      // Perform actual mutation
      const result = await mutationFn();
      return result;
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData([endpoint, 'detail', id], previousData);
      throw error;
    }
  };
  
  return { optimisticUpdate };
};