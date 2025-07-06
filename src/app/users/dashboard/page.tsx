// app/users/dashboard/page.tsx
/**
 * USER DASHBOARD PAGE
 * This is the main dashboard page for regular users (not admins)
 * 
 * Features:
 * - Authentication check (redirects unauthenticated users)
 * - Admin redirect (sends admins to admin dashboard)
 * - Displays user account info
 * - Shows learning modules using LearnCard components
 * - Fetches data from user-facing API
 * 
 * Layout:
 * - Left column: Learning modules grid
 * - Right column: User account info and future features
 */

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LearnCard from '../components/LearnCard';
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Learning Modules */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Available Modules
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a module to start learning
              </p>
            </div>

            {/* Modules Grid - Wireframe Layout */}
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

          {/* Right Column - User Info and Stats */}
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                Your Account
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Email:</span>
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    {session?.user?.email}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Role:</span>
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    {session?.user?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>

            {/* Learning Stats Card */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                Learning Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-green-700 dark:text-green-300">
                    Available Modules:
                  </span>
                  <span className="ml-2 text-green-600 dark:text-green-400">
                    {modules.length}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-green-700 dark:text-green-300">
                    Total Lessons:
                  </span>
                  <span className="ml-2 text-green-600 dark:text-green-400">
                    {modules.reduce((total, module) => total + module.totalLessons, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 rounded-md transition-colors">
                  View Progress
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 rounded-md transition-colors">
                  Search Lessons
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 rounded-md transition-colors">
                  Recent Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}