export default function ForbiddenPage() {
  return (
    <main className="h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-bold">403</h1>
        <p className="text-lg text-red-500">Access Denied</p>
        <p className="text-sm text-gray-400">Your request was blocked by Aichiow Firewall.</p>
      </div>
    </main>
  )
}
