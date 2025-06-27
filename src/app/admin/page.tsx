// app/admin/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield, Users, Book, Settings, LogOut, AlertCircle, BadgeCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status !== 'authenticated' || session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/auth/signin',
      redirect: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header with Badge */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-red-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <span className="ml-2 px-2 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full">
                ADMIN MODE
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {session.user?.name || session.user?.email}
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Super Admin
                </span>
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center text-sm text-gray-500 hover:text-red-600"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Admin Welcome Section */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Welcome, <span className="text-red-600">Admin {session.user?.name?.split(' ')[0]}</span>
          </h2>
          <p className="text-gray-600">
            You have full administrative privileges to manage the platform.
          </p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'content' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Book className="inline mr-2 h-4 w-4" />
              Content Management
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Users className="inline mr-2 h-4 w-4" />
              User Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Settings className="inline mr-2 h-4 w-4" />
              System Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'content' && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Book className="h-5 w-5 mr-2 text-red-600" />
                Learning Content Management
              </h3>
              {/* Content management UI would go here */}
              <div className="space-y-4">
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium">Modules</h4>
                  <p className="text-sm text-gray-500">Manage learning modules</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium">Lessons</h4>
                  <p className="text-sm text-gray-500">Edit lesson content</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-red-600" />
                User Administration
              </h3>
              {/* User management UI would go here */}
              <div className="space-y-4">
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium">Create New Admin</h4>
                  <p className="text-sm text-gray-500">Register new admin users</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium">User Analytics</h4>
                  <p className="text-sm text-gray-500">View user progress and activity</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-red-600" />
                System Configuration
              </h3>
              {/* System settings UI would go here */}
              <div className="p-4 border rounded-lg bg-red-50">
                <h4 className="font-medium text-red-700 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Admin Settings
                </h4>
                <p className="text-sm text-red-600 mt-1">
                  These settings control critical system functionality.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}