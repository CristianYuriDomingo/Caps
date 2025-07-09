// app/users/dashboard/page.tsx
/**
 * USER DASHBOARD PAGE
 * This is the main dashboard page for regular users (not admins)
 * 
 * Features:
 * - Authentication check (redirects unauthenticated users)
 * - Admin redirect (sends admins to admin dashboard)
 * - Search functionality for modules and lessons
 * - Shows learning modules using LearnCard components
 * - Fetches data from user-facing API
 * 
 * Layout:
 * - Welcome message
 * - Search bar
 * - Learning modules grid
 */

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LearnCard from '../components/LearnCard';
import SearchBar from '../components/SearchBar'; // Import the SearchBar component
import { fetchUserModules, handleModuleClick, UserModule } from '../lib/api';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State for modules data
  const [modules, setModules] = useState<UserModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authentication and role checking
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

  // Fetch modules data when component mounts
  useEffect(() => {
    const loadModules = async () => {
      if (status === 'authenticated' && session?.user?.role !== 'admin') {
        try {
          setLoading(true);
          const response = await fetchUserModules();
          
          if (response.success) {
            setModules(response.data);
          } else {
            setError(response.error || 'Failed to load modules');
          }
        } catch (err) {
          setError('Failed to load modules');
          console.error('Error loading modules:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadModules();
  }, [status, session]);

  // Handle module card clicks
  const onModuleClick = (moduleId: string, title: string) => {
    handleModuleClick(moduleId, title);
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting admin users
  if (status === 'authenticated' && session?.user?.role === 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Redirecting to admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting unauthenticated users
  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  // Main dashboard content
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Welcome back, {session?.user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your learning journey
          </p>
        </div>

        {/* Search Bar Section */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Learning Modules Section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Available Modules
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a module to start learning
          </p>
        </div>

        {/* Modules Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading modules...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : modules.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No modules available yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              console.log('Module data:', module); // Debug log
              return (
                <LearnCard
                  key={module.id}
                  moduleId={module.id} // Added moduleId prop
                  imageSrc={module.imageSrc}
                  title={module.title}
                  lessons={module.lessons}
                  buttonText={module.buttonText}
                  isAvailable={module.isAvailable}
                  onCardClick={() => onModuleClick(module.id, module.title)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}