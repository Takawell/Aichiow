import { useState, useMemo } from 'react'
import { FaCircle, FaCopy, FaCheck, FaSearch, FaTimes, FaCode, FaServer } from 'react-icons/fa'
import { HiDocumentText } from 'react-icons/hi'
import { BiSearchAlt } from 'react-icons/bi'

const endpoints = [
  { name: 'Search Anime', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=anime&action=search&query={text}', desc: 'Search anime', status: 'online' },
  { name: 'Search Manga', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=manga&action=search&query={text}', desc: 'Search manga', status: 'online' },
  { name: 'Search Manhwa', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=manhwa&action=search&query={text}', desc: 'Search manhwa', status: 'online' },
  { name: 'Light Novel Search', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=ln&action=search&query={text}', desc: 'Search light novels', status: 'online' },
  { name: 'Media Detail', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=anime&action=detail&id={value}', desc: 'Get media detail by ID', status: 'online' },
  { name: 'Trending', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?action=trending', desc: 'Trending anime & manga', status: 'online' },
  { name: 'Seasonal Anime', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=anime&action=seasonal', desc: 'Seasonal anime', status: 'online' },
  { name: 'Airing Anime', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?action=airing', desc: 'Currently airing anime', status: 'online' },
  { name: 'Recommendations', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=anime&action=recommendations&id={value}', desc: 'Get recommendations by ID', status: 'online' },
  { name: 'Top Genre Manhwa', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?category=manhwa&action=top-genre&genre={name}', desc: 'Top genre manhwa', status: 'online' },
  { name: 'Character Detail', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?action=character&id={value}', desc: 'Character detail by ID', status: 'online' },
  { name: 'Staff Detail', method: 'GET', path: 'https://aichixia.vercel.app/api/aichixia?action=staff&id={value}', desc: 'Staff detail by ID', status: 'maintenance' },
  { name: 'AI Chat', method: 'POST', path: 'https://aichixia.vercel.app/api/chat', desc: 'AI-powered anime assistant', status: 'online' },
]

export default function ApiPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter(ep =>
      ep.name.toLowerCase().includes(search.toLowerCase()) ||
      ep.method.toLowerCase().includes(search.toLowerCase()) ||
      ep.status.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path)
    setCopied(path)
    setTimeout(() => setCopied(null), 2000)
  }

  const categories = ['anime', 'manga', 'manhwa', 'manhua', 'light novel']

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMjUsMjExLDI1MiwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      
      <div className="relative z-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                <FaServer className="w-6 h-6 sm:w-8 sm:h-8 text-sky-400 animate-pulse" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  API Endpoints
                </h1>
              </div>
              <div className="h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 rounded-full"></div>
            </div>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Explore all available API endpoints with live status and easy copy
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-6 sm:mb-8 bg-gradient-to-r from-sky-900/30 to-blue-900/30 backdrop-blur-xl border border-sky-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl shadow-sky-500/10">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <HiDocumentText className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
              <h2 className="text-lg sm:text-xl font-bold">Documentation Notes</h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm md:text-base">
              <div className="space-y-2">
                <span className="font-semibold text-sky-300 block">Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <span key={cat} className="px-2 sm:px-3 py-1 bg-sky-500/20 rounded-lg text-sky-200 font-medium border border-sky-400/30">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold text-blue-300 block mb-2">Required Parameters:</span>
                <ul className="ml-4 space-y-1 text-gray-300">
                  <li className="flex items-start gap-2">
                    <FaCode className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                    <span><code className="bg-slate-900/50 px-1.5 py-0.5 rounded text-cyan-300">id</code> → for detail, character, staff, recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCode className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                    <span><code className="bg-slate-900/50 px-1.5 py-0.5 rounded text-cyan-300">query</code> → for search</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCode className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                    <span><code className="bg-slate-900/50 px-1.5 py-0.5 rounded text-cyan-300">genre</code> → for top-genre</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="relative">
              <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search endpoints..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-slate-950/50 backdrop-blur-xl border-2 border-sky-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-12">
            {filteredEndpoints.map((ep, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-gradient-to-br from-slate-950/80 to-sky-950/20 backdrop-blur-xl border border-sky-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-sky-500/20 hover:border-sky-400/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-600/0 to-blue-600/0 group-hover:from-sky-600/10 group-hover:to-blue-600/10 rounded-xl sm:rounded-2xl transition-all duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors flex-1 leading-tight">
                      {ep.name}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <FaCircle className={`w-2 h-2 ${ep.status === 'online' ? 'text-green-400 animate-pulse' : 'text-yellow-400'}`} />
                      <span className={`text-xs font-semibold ${ep.status === 'online' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {ep.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{ep.desc}</p>

                  <div className="bg-black/50 rounded-lg p-2 mb-3 border border-slate-700/50">
                    <code className="text-[10px] sm:text-xs text-sky-300 break-all block leading-relaxed">
                      {ep.path.length > 50 && hoveredCard !== i ? ep.path.slice(0, 50) + '...' : ep.path}
                    </code>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold ${
                      ep.method === 'GET' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                        : 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                    }`}>
                      {ep.method}
                    </span>
                    
                    <button
                      onClick={() => handleCopy(ep.path)}
                      className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/50 flex items-center gap-1.5"
                    >
                      {copied === ep.path ? (
                        <>
                          <FaCheck className="w-3 h-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <FaCopy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEndpoints.length === 0 && (
            <div className="text-center py-12">
              <BiSearchAlt className="w-16 h-16 sm:w-20 sm:h-20 text-gray-600 mx-auto mb-3" />
              <p className="text-base sm:text-lg text-gray-400">No endpoints found matching your search</p>
            </div>
          )}

          <div className="text-center space-y-3 sm:space-y-4 mt-8 sm:mt-12">
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
              All endpoints are monitored in real-time. Use the search bar or documentation notes to quickly find what you need.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-xs text-gray-500">
              <span>© {new Date().getFullYear()} Aichiow Plus</span>
              <span className="hidden sm:inline">•</span>
              <span>All rights reserved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
