// app/users/lib/api.ts
/**
 * API Service functions for user-facing operations
 * This file contains functions to interact with user-facing APIs
 * 
 * Functions:
 * - fetchUserModules: Get all modules for user display
 * - fetchModule: Get single module with lessons (future use)
 * 
 * All functions handle errors gracefully and return consistent data structures
 */

// Type definitions for API responses
export interface UserModule {
  id: string;
  title: string;
  imageSrc: string;
  lessons: string;
  buttonText: string;
  isAvailable: boolean;
  totalLessons: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  error?: string;
}

/**
 * Fetch all modules for user display
 * Used in dashboard to show available learning modules
 */
export async function fetchUserModules(): Promise<ApiResponse<UserModule[]>> {
  try {
    const response = await fetch('/api/users/modules', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch modules');
    }

    return data;
  } catch (error) {
    console.error('Error fetching user modules:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Handle module card click
 * Navigate to module details or lessons
 */
export function handleModuleClick(moduleId: string, title: string) {
  // For now, just show an alert
  // Later, you can navigate to module details or lessons
  alert(`Opening module: ${title} (ID: ${moduleId})`);
  
  // Future implementation:
  // router.push(`/users/modules/${moduleId}`);
}