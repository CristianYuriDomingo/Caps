'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function AuthTest() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch all users to verify database integration
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (session) {
      fetchUsers()
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading authentication...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">🔐 Authentication Test</h1>
          <p className="text-gray-600 mb-6">Sign in to test the database integration</p>
          <button 
            onClick={() => signIn('google')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* User Info Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-green-800 mb-4">✅ Authentication Successful!</h1>
          <div className="flex items-center space-x-4">
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border-2 border-green-300" 
              />
            )}
            <div>
              <p className="text-lg font-semibold">{session.user?.name}</p>
              <p className="text-gray-600">{session.user?.email}</p>
              {session.user?.id && (
                <p className="text-sm text-gray-500">User ID: {session.user.id}</p>
              )}
            </div>
          </div>
        </div>

        {/* Database Test Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🗄️ Database Integration Test</h2>
            <button 
              onClick={fetchUsers}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Users'}
            </button>
          </div>
          
          {users.length > 0 ? (
            <div>
              <p className="text-green-600 font-semibold mb-3">
                ✅ Database connected! Found {users.length} user(s):
              </p>
              <div className="space-y-3">
                {users.map((user: any) => (
                  <div key={user.id} className="bg-gray-50 p-4 rounded border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Name:</strong> {user.name || 'N/A'}
                      </div>
                      <div>
                        <strong>Email:</strong> {user.email || 'N/A'}
                      </div>
                      <div>
                        <strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Accounts:</strong> {user.accounts?.length || 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-yellow-600">
              {loading ? 'Loading users...' : '⚠️ No users found or database not connected'}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button 
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Sign Out
          </button>
          <button 
            onClick={() => window.open('/api/auth/providers', '_blank')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            View Providers
          </button>
        </div>
      </div>
    </div>
  )
}