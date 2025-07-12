export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white text-center px-4">
      <div>
        <h1 className="text-4xl font-bold text-red-500 mb-4">403 Forbidden</h1>
        <p className="text-gray-400">Access blocked. Suspicious bot behavior detected.</p>
        <p className="mt-2 text-xs text-gray-600">Aichiow Shield Protection Active</p>
      </div>
    </main>
  )
}
