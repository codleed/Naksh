import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';

const AuthPages: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 px-4 py-8">
      <div className="w-full max-w-md">
        <Routes>
          <Route 
            path="/sign-in/*" 
            element={
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-2xl"
                  }
                }}
                routing="path" 
                path="/auth/sign-in" 
                redirectUrl="/dashboard"
                signUpUrl="/auth/sign-up"
              />
            } 
          />
          <Route 
            path="/sign-up/*" 
            element={
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-2xl"
                  }
                }}
                routing="path" 
                path="/auth/sign-up" 
                redirectUrl="/dashboard"
                signInUrl="/auth/sign-in"
              />
            } 
          />
          <Route 
            path="*" 
            element={
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Authentication
                </h2>
                <p className="text-gray-600 mb-6">
                  Choose how you'd like to continue
                </p>
                <div className="space-y-4">
                  <a 
                    href="/auth/sign-in" 
                    className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </a>
                  <a 
                    href="/auth/sign-up" 
                    className="block w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

export default AuthPages;