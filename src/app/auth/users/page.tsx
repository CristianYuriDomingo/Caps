// app/auth/users/page.tsx
import { prisma } from '@/lib/prisma'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
      sessions: true,
    },
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Registered Users</h1>
      {users.length === 0 ? (
        <p>No users found. Sign in first!</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border p-4 rounded">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Created:</strong> {user.createdAt.toLocaleDateString()}</p>
              <p><strong>Accounts:</strong> {user.accounts.length}</p>
              <p><strong>Active Sessions:</strong> {user.sessions.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}