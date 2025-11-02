'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { FaHashtag, FaPaperPlane, FaUserCircle, FaServer } from 'react-icons/fa'
import { IoMdAdd } from 'react-icons/io'
import Image from 'next/image'

export default function CommunityPage() {
  const [servers, setServers] = useState<any[]>([])
  const [channels, setChannels] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [selectedServer, setSelectedServer] = useState<any>(null)
  const [selectedChannel, setSelectedChannel] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchServers = async () => {
      const { data } = await supabase.from('servers').select('*').order('created_at', { ascending: true })
      setServers(data || [])
      if (data && data.length > 0) setSelectedServer(data[0])
    }
    fetchServers()
  }, [])

  useEffect(() => {
    if (!selectedServer) return
    const fetchChannels = async () => {
      const { data } = await supabase.from('channels').select('*').eq('server_id', selectedServer.id).order('created_at')
      setChannels(data || [])
      if (data && data.length > 0) setSelectedChannel(data[0])
    }
    fetchChannels()
  }, [selectedServer])

  useEffect(() => {
    if (!selectedChannel) return
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, profiles(username, avatar_url)')
        .eq('channel_id', selectedChannel.id)
        .order('created_at')
      setMessages(data || [])
    }
    fetchMessages()

    const channel = supabase
      .channel('realtime:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        if (payload.new.channel_id === selectedChannel.id) {
          setMessages(prev => [...prev, payload.new])
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedChannel])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: any) => {
    e.preventDefault()
    if (!message.trim() || !selectedChannel || !user) return
    await supabase.from('messages').insert([
      { content: message, channel_id: selectedChannel.id, user_id: user.id }
    ])
    setMessage('')
  }

  return (
    <div className="flex h-screen bg-[#0e0e10] text-white overflow-hidden">
      <aside className="w-16 bg-[#1e1f22] flex flex-col items-center py-4 gap-3 border-r border-white/10">
        {servers.map((s: any) => (
          <motion.button
            key={s.id}
            whileHover={{ scale: 1.1 }}
            onClick={() => setSelectedServer(s)}
            className={`w-12 h-12 rounded-2xl overflow-hidden bg-gray-700 hover:bg-sky-500 transition ${
              selectedServer?.id === s.id ? 'ring-2 ring-sky-500' : ''
            }`}
          >
            {s.icon_url ? (
              <Image src={s.icon_url} alt={s.name} width={48} height={48} />
            ) : (
              <FaServer className="w-full h-full p-3" />
            )}
          </motion.button>
        ))}
        <motion.button whileHover={{ scale: 1.1 }} className="mt-auto w-12 h-12 flex items-center justify-center bg-sky-600 rounded-2xl">
          <IoMdAdd className="w-6 h-6" />
        </motion.button>
      </aside>

      <aside className="w-64 bg-[#2b2d31] flex flex-col border-r border-white/10">
        <div className="px-4 py-3 font-semibold text-lg border-b border-white/10 truncate">{selectedServer?.name || 'Select Server'}</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {channels.map((c: any) => (
            <button
              key={c.id}
              onClick={() => setSelectedChannel(c)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                selectedChannel?.id === c.id ? 'bg-sky-600/20 text-sky-400' : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <FaHashtag /> {c.name}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-[#313338]">
        <header className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
          <FaHashtag className="text-gray-400" />
          <span className="font-semibold">{selectedChannel?.name || 'Select Channel'}</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m: any) => (
            <div key={m.id} className="flex items-start gap-3">
              {m.profiles?.avatar_url ? (
                <Image src={m.profiles.avatar_url} alt="avatar" width={40} height={40} className="rounded-full" />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-500" />
              )}
              <div>
                <div className="text-sm font-semibold">{m.profiles?.username || m.user_id.slice(0, 8)}</div>
                <div className="text-gray-300 text-sm break-words">{m.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="px-4 py-3 border-t border-white/10">
          <div className="flex items-center gap-3 bg-[#383a40] rounded-lg px-3 py-2">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`Message #${selectedChannel?.name || ''}`}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button type="submit" className="text-sky-400 hover:text-sky-300">
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </main>

      <aside className="hidden lg:flex w-64 bg-[#2b2d31] flex-col border-l border-white/10">
        <div className="px-4 py-3 border-b border-white/10 font-semibold">User</div>
        <div className="flex items-center gap-3 px-4 py-4">
          {user?.user_metadata?.avatar_url ? (
            <Image src={user.user_metadata.avatar_url} alt="user" width={40} height={40} className="rounded-full" />
          ) : (
            <FaUserCircle className="w-10 h-10 text-gray-500" />
          )}
          <div className="text-sm font-medium break-all">{user?.user_metadata?.username || user?.email}</div>
        </div>
      </aside>
    </div>
  )
}
