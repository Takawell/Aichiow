'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaHashtag, FaPaperPlane, FaUserCircle, FaSearch, FaEllipsisV } from 'react-icons/fa'
import { IoMdAdd } from 'react-icons/io'

export default function CommunityPage() {
  const presetChannels = [
    { id: 'general', name: 'general', topic: 'General discussion about everything' },
    { id: 'anime', name: 'anime', topic: 'Talk about anime, seasons, and recommendations' },
    { id: 'manga', name: 'manga', topic: 'Manga releases, scans, and chapters' },
    { id: 'manhwa', name: 'manhwa', topic: 'Korean webtoons and manhwa discussions' },
    { id: 'light-novel', name: 'light-novel', topic: 'Light novels, summaries, and translations' }
  ]

  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeChannelId, setActiveChannelId] = useState<string>('general')
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [user, setUser] = useState<any>(null)
  const [servers, setServers] = useState<any[]>([])
  const [selectedServer, setSelectedServer] = useState<any>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [channelListOpen, setChannelListOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    fetchServers()
  }, [])

  useEffect(() => {
    if (!selectedServer && servers.length > 0) {
      setSelectedServer(servers[0])
    }
  }, [servers])

  useEffect(() => {
    const initialChannel = presetChannels.find(c => c.id === activeChannelId) || presetChannels[0]
    setActiveChannelId(initialChannel.id)
  }, [])

  useEffect(() => {
    fetchMessages()
    const channel = supabase
      .channel(`public:messages:channel_id=eq.${activeChannelId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${activeChannelId}` }, payload => {
        setMessages(prev => [...prev, payload.new])
        scrollToBottom()
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `channel_id=eq.${activeChannelId}` }, payload => {
        setMessages(prev => prev.map(m => (m.id === payload.new.id ? payload.new : m)))
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeChannelId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function fetchServers() {
    const { data } = await supabase.from('servers').select('*').order('created_at', { ascending: true })
    if (data && data.length > 0) {
      setServers(data)
      setSelectedServer(data[0])
    } else {
      const { data: created } = await supabase.from('servers').insert([{ name: 'Aichiow Community', owner_id: (await supabase.auth.getUser()).data.user?.id }]).select().single()
      if (created) {
        setServers([created])
        setSelectedServer(created)
      }
    }
  }

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*, profiles(username, avatar_url)')
      .eq('channel_id', activeChannelId)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    })
  }

  async function handleSend(e?: any) {
    if (e) e.preventDefault()
    if (!input.trim() || !user) return
    setIsSending(true)
    await supabase.from('messages').insert([
      { content: input.trim(), channel_id: activeChannelId, user_id: user.id }
    ])
    setInput('')
    setIsSending(false)
  }

  useEffect(() => {
    const presence = supabase.channel('presence-multi')
      .on('presence', { event: 'join' }, () => {})
      .subscribe()
    return () => {
      supabase.removeChannel(presence)
    }
  }, [])

  function sampleAvatar(name: string) {
    return `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,ffd5dc`
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-[#07070a] to-[#0f1113] text-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded-md hover:bg-white/5" onClick={() => setMobileOpen(true)}>
            <FaBars className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7C4 5.34315 5.34315 4 7 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7Z" fill="white" fillOpacity="0.08"/>
                <path d="M7 8H17" stroke="white" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M7 12H13" stroke="white" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold">Aichiow Community</div>
              <div className="text-xs text-gray-400">Chat, share, and discuss</div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search channels or messages" className="bg-[#121214] text-sm px-3 py-2 rounded-lg outline-none w-72" />
            <div className="absolute right-2 top-1.5 text-gray-400">
              <FaSearch />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 bg-[#0f1417] px-3 py-1 rounded-lg">
                <Image src={user.user_metadata?.avatar_url || sampleAvatar(user.email || 'user')} alt="me" width={28} height={28} className="rounded-full" />
                <div className="text-xs">{user.user_metadata?.username || user.email}</div>
              </div>
            ) : (
              <button onClick={async () => await supabase.auth.signInWithOAuth({ provider: 'github' })} className="bg-sky-600 px-3 py-1 rounded-lg text-sm">Sign in</button>
            )}
          </div>
        </div>

        <div className="md:hidden">
          <AnimatePresence>
            {mobileOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40">
                <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
                <motion.nav initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: 'spring', stiffness: 300 }} className="relative z-50 w-80 h-full bg-[#0e0f11] p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-sm font-bold">A</div>
                      <div className="text-sm font-semibold">Aichiow</div>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md hover:bg-white/5"><FaTimes /></button>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-2">Channels</div>
                    <div className="space-y-2">
                      {presetChannels.map(ch => (
                        <button key={ch.id} onClick={() => { setActiveChannelId(ch.id); setMobileOpen(false) }} className={`w-full text-left px-3 py-2 rounded-md ${activeChannelId === ch.id ? 'bg-sky-600/20 text-sky-400' : 'hover:bg-white/5 text-gray-300'}`}>
                          <div className="flex items-center gap-2">
                            <FaHashtag />
                            <div className="text-sm">{ch.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="text-xs text-gray-400 mb-2">Servers</div>
                    <div className="flex gap-2">
                      {servers.length > 0 ? servers.map(s => (
                        <div key={s.id} onClick={() => setSelectedServer(s)} className="w-12 h-12 rounded-lg bg-[#111214] flex items-center justify-center hover:ring-2 hover:ring-sky-500 cursor-pointer">
                          {s.icon_url ? <Image src={s.icon_url} alt={s.name} width={40} height={40} className="rounded-md" /> : <div className="text-sm font-semibold">{s.name.charAt(0)}</div>}
                        </div>
                      )) : <div className="w-12 h-12 rounded-lg bg-[#111214] flex items-center justify-center"><IoMdAdd /></div>}
                    </div>
                  </div>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside className={`hidden md:flex md:flex-col w-72 bg-[#0e0f11] border-r border-white/6 transition-all ${channelListOpen ? 'md:w-72' : 'md:w-20'}`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-sm font-bold">A</div>
              <div className="hidden lg:block">
                <div className="text-sm font-semibold">Aichiow</div>
                <div className="text-xs text-gray-400">Community</div>
              </div>
            </div>
            <button onClick={() => setChannelListOpen(!channelListOpen)} className="p-2 rounded-md hover:bg-white/3">
              <FaEllipsisV />
            </button>
          </div>

          <div className="px-3 py-2">
            <div className="text-xs text-gray-400 mb-2">Channels</div>
            <div className="flex flex-col gap-1">
              {presetChannels.map(ch => (
                <button key={ch.id} onClick={() => setActiveChannelId(ch.id)} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${activeChannelId === ch.id ? 'bg-sky-600/20 text-sky-300' : 'hover:bg-white/5 text-gray-300'}`}>
                  <FaHashtag className="w-4 h-4" />
                  <div className="truncate">{ch.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto px-3 py-4 border-t border-white/6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#111214] flex items-center justify-center">
                <IoMdAdd />
              </div>
              <div className="text-sm">Create Channel</div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 bg-gradient-to-b from-transparent to-black/20">
            <div className="flex items-center gap-3">
              <div className="rounded-md px-2 py-1 bg-[#0f1417] text-xs text-gray-300">#{activeChannelId}</div>
              <div className="text-sm text-gray-300 hidden sm:block">{presetChannels.find(c => c.id === activeChannelId)?.topic}</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowInfo(!showInfo)} className="p-2 rounded-md hover:bg-white/5 hidden sm:inline">Info</button>
              <div className="flex items-center gap-2">
                {user ? <Image src={user.user_metadata?.avatar_url || sampleAvatar(user.email || 'me')} alt="me" width={36} height={36} className="rounded-full" /> : <FaUserCircle className="w-8 h-8 text-gray-400" />}
              </div>
            </div>
          </div>

          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div>Welcome to #{activeChannelId}</div>
              <div>{messages.length} messages</div>
            </div>

            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  No messages here. Say hi!
                </div>
              )}

              {messages.map((m, i) => {
                const isMe = user && m.user_id === user.id
                return (
                  <div key={m.id || i} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <div className="flex-shrink-0">
                        <Image src={m.profiles?.avatar_url || sampleAvatar(m.profiles?.username || m.user_id)} alt="avatar" width={40} height={40} className="rounded-full" />
                      </div>
                    )}

                    <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                      {!isMe && <div className="text-xs text-sky-400 font-semibold">{m.profiles?.username || (m.user_id || '').slice(0, 6)}</div>}
                      <div className={`inline-block px-4 py-3 rounded-2xl break-words ${isMe ? 'bg-sky-600/80 text-white' : 'bg-white/5 text-gray-200'}`}>
                        {m.content}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">{new Date(m.created_at).toLocaleString()}</div>
                    </div>

                    {isMe && (
                      <div className="flex-shrink-0">
                        <Image src={user.user_metadata?.avatar_url || sampleAvatar(user.email || 'me')} alt="me" width={40} height={40} className="rounded-full" />
                      </div>
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSend} className="px-4 py-3 border-t border-white/6 bg-[#060608]">
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <button type="button" className="p-2 rounded-md hover:bg-white/5">
                  <FaHashtag />
                </button>
              </div>
              <div className="flex-1">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder={`Message #${activeChannelId}`} className="w-full bg-[#0b0b0d] px-4 py-3 rounded-2xl outline-none text-sm" />
              </div>
              <div>
                <button disabled={!input.trim() || isSending} type="submit" className="flex items-center gap-2 bg-sky-600 px-3 py-2 rounded-2xl hover:scale-105 transition">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </form>
        </main>

        <aside className="hidden lg:flex lg:flex-col w-80 bg-[#0e0f11] border-l border-white/6">
          <div className="px-4 py-3 border-b border-white/6">
            <div className="text-sm font-semibold">About #{activeChannelId}</div>
            <div className="text-xs text-gray-400 mt-1">{presetChannels.find(c => c.id === activeChannelId)?.topic}</div>
          </div>

          <div className="px-4 py-3">
            <div className="text-xs text-gray-400 mb-2">Online Members</div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {servers && servers.length > 0 ? (
                servers.slice(0, 12).map((s, idx) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#111214] flex items-center justify-center">
                      <div className="text-xs font-semibold">{(s.name || 'S').charAt(0)}</div>
                    </div>
                    <div className="text-sm">{s.name}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No members online</div>
              )}
            </div>
          </div>

          <div className="mt-auto px-4 py-4 border-t border-white/6">
            <div className="text-xs text-gray-400 mb-2">You</div>
            <div className="flex items-center gap-3">
              {user ? <Image src={user.user_metadata?.avatar_url || sampleAvatar(user.email || 'me')} alt="me" width={40} height={40} className="rounded-full" /> : <FaUserCircle className="w-10 h-10 text-gray-400" />}
              <div className="flex-1">
                <div className="text-sm">{user?.user_metadata?.username || user?.email || 'Guest'}</div>
                <div className="text-xs text-gray-400">Member</div>
              </div>
              <div>
                <button onClick={async () => { if (user) await supabase.auth.signOut(); else await supabase.auth.signInWithOAuth({ provider: 'github' }) }} className="text-xs px-3 py-1 rounded-md bg-white/5">
                  {user ? 'Sign out' : 'Sign in'}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
