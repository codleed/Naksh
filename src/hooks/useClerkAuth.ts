import { useUser, useAuth as useClerkAuth, useSignIn, useSignUp } from '@clerk/clerk-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../utils/api';

// Query keys
export const CLERK_AUTH_KEYS = {
  currentUser: ['clerk-auth', 'currentUser'] as const,
  session: ['clerk-auth', 'session'] as const,
};

// Get current user from Clerk and sync with backend
export const useCurrentUser = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { getToken } = useClerkAuth();

  return useQuery({
    queryKey: CLERK_AUTH_KEYS.currentUser,
    queryFn: async () => {
      if (!clerkUser) return null;
      
      // Get the user from our backend (this will sync with Clerk automatically via webhook)
      try {
        const token = await getToken();
        return await userAPI.getCurrentUser(token);
      } catch (error) {
        console.error('Error fetching user from backend:', error);
        // Return Clerk user data as fallback
        return {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          name: clerkUser.fullName,
          imageUrl: clerkUser.imageUrl,
        };
      }
    },
    enabled: isLoaded && !!clerkUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { getToken } = useClerkAuth();

  return useMutation({
    mutationFn: async (userData: any) => {
      const token = await getToken();
      return userAPI.updateProfile(userData, token);
    },
    onSuccess: (data) => {
      // Update user cache
      queryClient.setQueryData(CLERK_AUTH_KEYS.currentUser, data);
      
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: CLERK_AUTH_KEYS.currentUser });
    },
  });
};

// Get session information
export const useSession = () => {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();

  return {
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded || isUserLoading,
    user,
  };
};

// Sign in hook
export const useSignInMutation = () => {
  const { signIn, setActive } = useSignIn();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!signIn) throw new Error('Sign in not available');

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        return result;
      } else {
        throw new Error('Sign in incomplete');
      }
    },
    onSuccess: () => {
      // Invalidate user queries after successful sign in
      queryClient.invalidateQueries({ queryKey: CLERK_AUTH_KEYS.currentUser });
    },
  });
};

// Sign up hook
export const useSignUpMutation = () => {
  const { signUp, setActive } = useSignUp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      firstName, 
      lastName 
    }: { 
      email: string; 
      password: string; 
      firstName: string; 
      lastName: string; 
    }) => {
      if (!signUp) throw new Error('Sign up not available');

      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      // Send email verification
      await result.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      return result;
    },
    onSuccess: () => {
      // Invalidate user queries after successful sign up
      queryClient.invalidateQueries({ queryKey: CLERK_AUTH_KEYS.currentUser });
    },
  });
};

// Verify email hook
export const useVerifyEmail = () => {
  const { signUp, setActive } = useSignUp();

  return useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      if (!signUp) throw new Error('Sign up not available');

      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        return result;
      } else {
        throw new Error('Verification incomplete');
      }
    },
  });
};

// Sign out hook
export const useSignOut = () => {
  const { signOut } = useClerkAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
};