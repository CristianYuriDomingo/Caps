// app/debug/page.tsx
export default function DebugPage() {
  return (
    <div className="p-8">
      <h1>Environment Debug</h1>
      <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'NOT SET'}</p>
      <p>GOOGLE_CLIENT_ID: {process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET'}</p>
      <p>GOOGLE_CLIENT_SECRET: {process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET'}</p>
      <p>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET'}</p>
    </div>
  )
}