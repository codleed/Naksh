import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useCurrentUser } from '../../hooks/useClerkAuth';

const Dashboard: React.FC = () => {
  const { user: clerkUser } = useUser();
  const { data: backendUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your Dashboard!
          </h1>
          <p className="text-gray-600">
            You're successfully signed in with Clerk authentication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clerk User Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Clerk User Information
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-600">
                  {clerkUser?.fullName || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-600">
                  {clerkUser?.primaryEmailAddress?.emailAddress || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">User ID:</span>
                <span className="ml-2 text-gray-600 font-mono text-sm">
                  {clerkUser?.id}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-600">
                  {clerkUser?.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Backend User Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Backend User Information
            </h2>
            {backendUser ? (
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Display Name:</span>
                  <span className="ml-2 text-gray-600">
                    {backendUser.displayName || 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Username:</span>
                  <span className="ml-2 text-gray-600">
                    {backendUser.username || 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Bio:</span>
                  <span className="ml-2 text-gray-600">
                    {backendUser.bio || 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email Verified:</span>
                  <span className="ml-2 text-gray-600">
                    {backendUser.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                Backend user data not available. This might be normal if this is your first time signing in.
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Update Profile
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              View Posts
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;