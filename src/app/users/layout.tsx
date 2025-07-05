// app/users/layout.tsx
'use client';

import { ReactNode, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface UsersLayoutProps {
  children: ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isDropdownVisible, setDropdownVisible] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/auth/signin',
      redirect: true,
    });
  };

  const navigation = [
    { 
      name: 'Learning Modules', 
      href: '/users/dashboard', 
      icon: '/DashboardImage/dashboard.png',
      alt: 'Dashboard'
    },
    { 
      name: 'Quiz', 
      href: '/users/reports', 
      icon: '/DashboardImage/reports.png',
      alt: 'Reports'
    },
    { 
      name: 'Achievements', 
      href: '/users/alerts', 
      icon: '/DashboardImage/alerts.png',
      alt: 'Alerts'
    },
    { 
      name: 'Quest', 
      href: '/users/profile', 
      icon: '/DashboardImage/profile.png',
      alt: 'Profile'
    },
    { 
      name: 'Settings', 
      href: '/users/settings', 
      icon: '/DashboardImage/settings.png',
      alt: 'Settings'
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-72 h-full bg-white dark:bg-gray-800 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Close button for mobile - only shows when sidebar is open and on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 text-blue-500 hover:text-white hover:bg-blue-500 rounded-lg transition-colors duration-200 sm:hidden"
            aria-label="Close sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Logo */}
          <a href="/users/dashboard" className="flex justify-center items-center mb-5">
            <Image
              src="/MainImage/logo.png"
              className="h-16 sm:h-20"
              alt="Bantay Bayan Logo"
              width={150}
              height={110}
            />
          </a>

          {/* Navigation Menu */}
          <ul className="space-y-4 font-medium">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-4 text-lg rounded-lg transition-colors ${
                      isActive
                        ? 'text-gray-900 dark:text-white bg-blue-100 dark:bg-gray-700 border border-blue-300 dark:border-gray-600'
                        : 'text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Image
                      src={item.icon}
                      className="w-6 h-6"
                      alt={item.alt}
                      width={24}
                      height={24}
                    />
                    <span className="ms-3 uppercase">{item.name}</span>
                  </Link>
                </li>
              );
            })}
            
            {/* Divider */}
            <hr className="border-t-2 border-gray-200 dark:border-gray-700 my-4" />
            
            {/* Sign Out */}
            <li>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center p-4 text-lg text-gray-900 rounded-lg dark:text-white hover:bg-red-100 dark:hover:bg-red-700 transition-colors"
              >
                <Image
                  src="/DashboardImage/logout.png"
                  className="w-6 h-6"
                  alt="Logout"
                  width={24}
                  height={24}
                />
                <span className="ms-3 uppercase">Sign Out</span>
              </button>
            </li>
          </ul>

          {/* Remember Alert */}
          {isDropdownVisible && (
            <div
              id="dropdown-cta"
              className="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900"
              role="alert"
            >
              <div className="flex items-center mb-3">
                <span className="bg-orange-100 text-orange-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded-sm dark:bg-orange-200 dark:text-orange-900">
                  Remember!
                </span>
                <button
                  type="button"
                  className="ms-auto -mx-1.5 -my-1.5 bg-blue-50 inline-flex justify-center items-center w-6 h-6 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
                  aria-label="Close"
                  onClick={() => setDropdownVisible(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-2.5 h-2.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
              <p className="mb-3 text-sm text-blue-800 dark:text-blue-400">
                Do not ignore any suspicious activity—report it immediately to authorities.
              </p>
              <a
                className="text-sm text-blue-800 underline font-medium hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                href="#"
              >
                Contact the Police
              </a>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4 sm:ml-72">
        {/* Mobile sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none mb-4"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row w-full gap-4">
          {/* Left column - 70% */}
          <div className="w-full lg:w-[70%]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full overflow-hidden p-6">
              {children}
            </div>
          </div>
          
          {/* Right column - 30% */}
          <div className="w-full lg:w-[30%] lg:sticky lg:top-4 h-fit max-h-screen bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col gap-4 overflow-y-auto">
            {/* Placeholder content for right column */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Right Column Content
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                This is the right column placeholder. You can add any content here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}