"use client";

import { useState } from "react";
import Image from "next/image";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  alt: string;
}

interface SidebarProps {
  currentPage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage = "/" }) => {
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(true);

  // Navigation items configuration
  const navItems: NavItem[] = [
    {
      href: "/Learn",
      icon: "/DashboardImage/learn.png",
      label: "Learning Modules",
      alt: "Learning Modules"
    },
    {
      href: "/Quiz",
      icon: "/DashboardImage/quiz.png",
      label: "Quiz",
      alt: "Quiz"
    },
    {
      href: "/Achievements",
      icon: "/DashboardImage/achievements.png",
      label: "Achievements",
      alt: "Achievements"
    },
    {
      href: "/Quest",
      icon: "/DashboardImage/quest.png",
      label: "Quest",
      alt: "Quest"
    }
  ];

  // Check if current page matches the nav item
  const isActive = (href: string): boolean => currentPage === href;

  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-72 h-full bg-white dark:bg-gray-800 hidden sm:block"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        {/* Logo */}
        <a href="/" className="flex justify-center items-center mb-5">
          <Image
            src="/MainImage/logo.png"
            className="h-16 sm:h-20"
            alt="Pibi Logo"
            width={150}
            height={110}
          />
        </a>

        {/* Navigation Items */}
        <ul className="space-y-4 font-medium">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`flex items-center p-4 text-lg rounded-lg ${
                  isActive(item.href)
                    ? "text-gray-900 dark:text-white bg-blue-100 dark:bg-gray-700 border border-blue-300 dark:border-gray-600"
                    : "text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700"
                }`}
              >
                <Image
                  src={item.icon}
                  className="w-6 h-6"
                  alt={item.alt}
                  width={24}
                  height={24}
                />
                <span className="ms-3 uppercase">{item.label}</span>
              </a>
            </li>
          ))}

          {/* Divider */}
          <hr className="border-t-2 border-gray-200 dark:border-gray-700 my-4" />

          {/* Nearby Stations */}
          <li>
            <a
              href="#"
              className="flex items-center p-4 text-lg text-gray-900 rounded-lg dark:text-white hover:bg-red-100 dark:hover:bg-red-700"
            >
              <Image
                src="/DashboardImage/station.png"
                className="w-6 h-6"
                alt="Nearby Stations"
                width={24}
                height={24}
              />
              <span className="ms-3 uppercase">Nearby Stations</span>
            </a>
          </li>
        </ul>

        {/* Dropdown Alert */}
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
                data-dismiss-target="#dropdown-cta"
                aria-label="Close"
                onClick={() => setDropdownVisible(false)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-2.5 h-2.5"
                  aria-hidden="true"
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
  );
};

export default Sidebar;