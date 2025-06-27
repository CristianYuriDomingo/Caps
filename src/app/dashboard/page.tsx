// app/dashboard/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect unauthenticated users to sign-in
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    // Redirect admin users to admin dashboard
    else if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin');
    }
  }, [status, session, router]);

  // Loading state
  if (status !== 'authenticated' || session?.user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/auth/signin',
      redirect: true
    });
  };

  // Main dashboard content for regular users
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Basic header to confirm authentication */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">User Dashboard</h1>
          <button 
            onClick={handleSignOut}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="p-4">
        <h2 className="text-lg font-semibold mb-4">
          Welcome, {session.user?.name || 'User'}!
        </h2>
        <p className="text-gray-600">
          You are viewing the regular user dashboard.
        </p>
        
        {/* Debug info - can be removed in production */}
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm">Email: {session.user?.email}</p>
          <p className="text-sm">Role: {session.user?.role}</p>
        </div>
      </main>
    </div>
  );
}