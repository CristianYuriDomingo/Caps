// app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  MapPin, 
  Bell, 
  Settings, 
  LogOut,
  Plus,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/auth/signin',
      redirect: true
    });
  };

  const stats = [
    {
      icon: Shield,
      label: 'Active Reports',
      value: '24',
      change: '+12%',
      changeType: 'increase'
    },
    {
      icon: Users,
      label: 'Community Members',
      value: '1,247',
      change: '+5%',
      changeType: 'increase'
    },
    {
      icon: AlertTriangle,
      label: 'Urgent Cases',
      value: '3',
      change: '-8%',
      changeType: 'decrease'
    },
    {
      icon: Eye,  
      label: 'Cases Resolved',
      value: '156',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bantay Bayan</h1>
                <p className="text-sm text-gray-500">Community Safety Dashboard</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.name || session?.user?.email || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                </div>
                
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {(session?.user?.name || session?.user?.email || 'U')[0].toUpperCase()}
                  </span>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Friend'}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening in your community today.
          </p>
          
          {/* Debug info - remove in production */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900">Session Info:</h3>
            <p className="text-sm text-blue-700">Email: {session?.user?.email}</p>
            <p className="text-sm text-blue-700">Name: {session?.user?.name}</p>
            <p className="text-sm text-blue-700">Status: {status}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.changeType === 'increase' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 text-center rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <span className="font-medium">Report Emergency</span>
            </button>
            
            <button className="p-4 text-center rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <span className="font-medium">Safety Map</span>
            </button>
            
            <button className="p-4 text-center rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <span className="font-medium">Community</span>
            </button>
            
            <button className="p-4 text-center rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <Settings className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}