import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { QueryProvider } from './providers/QueryProvider';
import { Navbar } from './layout';
import { Home, Dashboard } from './pages';
import { AuthPages } from './pages/Auth';

function App() {
  return (
    <QueryProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/dashboard" 
                element={
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                } 
              />
              <Route 
                path="/auth/*" 
                element={
                  <SignedOut>
                    <AuthPages />
                  </SignedOut>
                } 
              />
              <Route 
                path="/protected" 
                element={
                  <>
                    <SignedIn>
                      <div className="p-8">
                        <h1 className="text-2xl font-bold">Protected Content</h1>
                        <p>This content is only visible to signed-in users.</p>
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryProvider>
  );
}

export default App;