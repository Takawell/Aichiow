import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Trash2, User, Check } from 'lucide-react'

type UserItem = {
  id: string
  email: string
  role?: string
  created_at?: string
}

export default function DashboardPage(): JSX.Element {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'email' | 'created_at' | 'role'>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 12

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch('/auth/api/users')
      .then(async res => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `HTTP ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (cancelled) return
        const payload = data?.users ?? data
        if (!Array.isArray(payload)) throw new Error('Invalid users response')
        setUsers(payload)
      })
      .catch(err => {
        if (cancelled) return
        console.error('[dashboard] fetch users error', err)
        setError(err.message || 'Failed to load users')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = users.filter(u => {
      if (!q) return true
      return (
        u.email.toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q) ||
        (u.id || '').toLowerCase().includes(q)
      )
    })

    list.sort((a, b) => {
      const aKey = (a[sortBy] ?? '') as string
      const bKey = (b[sortBy] ?? '') as string
      if (sortDir === 'asc') return aKey.localeCompare(bKey)
      return bKey.localeCompare(aKey)
    })

    return list
  }, [users, query, sortBy, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [pageCount, page])

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  function downloadCSV() {
    if (!users || users.length === 0) return
    const rows = [['id', 'email', 'role', 'created_at'], ...users.map(u => [u.id, u.email, u.role ?? '', u.created_at ?? ''])]
    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aichiow-users-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function humanDate(s?: string) {
    if (!s) return '-'
    try {
      return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(s))
    } catch {
      return s
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-6xl mx-auto"
      >
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-white/60 mt-1">User management — Aichiow</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search email, role or id"
                className="w-72 pl-10 pr-3 py-2 rounded-lg bg-white/6 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                <Search className="w-4 h-4" />
              </div>
            </div>

            <button
              onClick={downloadCSV}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:opacity-90"
              title="Download CSV"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>

            <div className="bg-white/6 rounded-lg px-3 py-2 flex items-center gap-2">
              <User className="w-4 h-4 text-white/80" />
              <div className="text-xs text-white/80">Total</div>
              <div className="ml-2 font-medium text-sm">{users.length}</div>
            </div>
          </div>
        </header>

        <main>
          <section className="bg-white/4 p-4 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <label className="text-sm">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="rounded-md bg-white/6 px-3 py-2 outline-none"
                >
                  <option value="created_at">Created</option>
                  <option value="email">Email</option>
                  <option value="role">Role</option>
                </select>

                <button
                  onClick={() => setSortDir(d => (d === 'desc' ? 'asc' : 'desc'))}
                  className="px-3 py-2 bg-white/6 rounded-md"
                  title="Toggle sort direction"
                >
                  {sortDir === 'desc' ? 'Newest' : 'Oldest'}
                </button>
              </div>

              <div className="text-sm text-white/70">Showing <span className="font-medium">{filtered.length}</span> results</div>
            </div>

            {loading ? (
              <div className="w-full py-20 flex items-center justify-center">
                <svg className="w-10 h-10 animate-spin text-white/70" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-400">Failed to load users: {error}</div>
            ) : (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="text-sm text-white/70 border-b border-white/6">
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3 hidden md:table-cell">Role</th>
                        <th className="text-left p-3">Created</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map(u => (
                        <tr key={u.id} className="hover:bg-white/4 transition">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 flex items-center justify-center text-black font-semibold">{u.email.charAt(0).toUpperCase()}</div>
                              <div>
                                <div className="font-medium">{u.email}</div>
                                <div className="text-xs text-white/60">id: {u.id}</div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3 hidden md:table-cell">
                            <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs ${u.role === 'admin' ? 'bg-green-400/20 text-green-300' : 'bg-white/6 text-white/80'}`}>
                              {u.role === 'admin' ? <Check className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              {u.role ?? 'user'}
                            </span>
                          </td>

                          <td className="p-3 w-48">{humanDate(u.created_at)}</td>

                          <td className="p-3 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => navigator.clipboard?.writeText(u.email)}
                                className="px-3 py-2 bg-white/6 rounded-md text-sm hover:bg-white/8"
                                title="Copy email"
                              >
                                Copy
                              </button>

                              <button
                                // delete action placeholder — implement server endpoint for actual deletion
                                onClick={() => alert('Delete action not implemented on frontend-only dashboard')}
                                className="px-3 py-2 bg-red-600/80 rounded-md text-sm hover:opacity-90 flex items-center gap-2"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-white/60">Page {page} / {pageCount}</div>

                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded-md bg-white/6 disabled:opacity-40"
                    >
                      Prev
                    </button>

                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: pageCount }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(pn => (
                        <button
                          key={pn}
                          onClick={() => setPage(pn)}
                          className={`px-3 py-1 rounded-md ${pn === page ? 'bg-indigo-600' : 'bg-white/6'}`}
                        >
                          {pn}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                      disabled={page === pageCount}
                      className="px-3 py-1 rounded-md bg-white/6 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="mt-8 text-center text-white/50">© {new Date().getFullYear()} Aichiow — internal dashboard</footer>
      </motion.div>
    </div>
  )
}
