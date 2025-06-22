import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Button } from '../../components';

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 px-4 py-16">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Naksh
          </h1>
          <SignedOut>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Your journey starts here. Sign in to continue or create a new account.
            </p>
          </SignedOut>
          <SignedIn>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Welcome back! Ready to explore your dashboard?
            </p>
          </SignedIn>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="primary" size="large" className="w-48 bg-white text-blue-600 hover:bg-gray-50">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="outline" size="large" className="w-48 border-white text-white hover:bg-white hover:text-blue-600">
                Create Account
              </Button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <Link to="/dashboard">
              <Button variant="primary" size="large" className="w-48 bg-white text-blue-600 hover:bg-gray-50">
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/protected">
              <Button variant="outline" size="large" className="w-48 border-white text-white hover:bg-white hover:text-blue-600">
                View Protected Content
              </Button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Home;