import { useState } from "react"

type Message = {
  from: "user" | "bot"
  text: string
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { from: "user", text: input }
    setMessages((prev: Message[]) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/aichixia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      const data = await res.json()
      const botMessage: Message = { from: "bot", text: data.reply }
      setMessages((prev: Message[]) => [...prev, botMessage])
    } catch (err) {
      setMessages((prev: Message[]) => [
        ...prev,
        { from: "bot", text: "⚠️ AichixiA gagal merespons." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="h-64 overflow-y-auto bg-gray-800 text-white p-2 mb-2 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={msg.from === "user" ? "text-blue-400" : "text-green-400"}>
            <b>{msg.from === "user" ? "You:" : "AichixiA:"}</b> {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-400">Typing...</div>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-2 py-1 rounded"
          placeholder="Tanya AichixiA..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-1 rounded">
          Send
        </button>
      </div>
    </div>
  )
}
