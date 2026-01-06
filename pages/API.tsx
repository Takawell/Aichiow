import { useState, useMemo, useEffect } from 'react'
import { FaCircle, FaCopy, FaCheck, FaSearch, FaTimes, FaCode, FaServer, FaRobot, FaBrain, FaPlay, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaStar, FaBolt, FaLightbulb } from 'react-icons/fa'
import { HiDocumentText } from 'react-icons/hi'
import { BiSearchAlt } from 'react-icons/bi'
import { SiOpenai, SiAnthropic, SiMeta, SiAlibabacloud, SiDigikeyelectronics, SiXiaomi, SiMaze, SiMatternet, SiGooglegemini, SiFlux } from "react-icons/si"
import { GiSpermWhale, GiPowerLightning, GiBlackHoleBolas, GiClover, GiPaintBrush } from "react-icons/gi"
import { TbSquareLetterZ, TbLetterM } from "react-icons/tb"
import Link from 'next/link'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'

type CodeLanguage = 'javascript' | 'python' | 'bash' | 'php'

type Endpoint = {
  name: string
  method: 'GET' | 'POST'
  path: string
  desc: string
  status: 'online' | 'maintenance'
  category: 'Media' | 'AI Chat' | 'AI Image'
  icon?: any
  modelInfo?: {
    speed: number
    quality: number
    useCase: string
    contextWindow?: string
  }
  note?: string
}

const SpeedIndicator = ({ level }: { level: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(4)].map((_, i) => (
        <FaBolt
          key={i}
          className={`${i < level ? 'text-sky-400' : 'text-slate-600'}`}
          size={10}
        />
      ))}
    </div>
  )
}

const QualityIndicator = ({ level }: { level: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`${i < level ? 'text-sky-400' : 'text-slate-600'}`}
          size={10}
        />
      ))}
    </div>
  )
}

const Modal = ({ 
  isOpen, 
  onClose, 
  path, 
  desc, 
  method,
  note,
  modelInfo
}: { 
  isOpen: boolean
  onClose: () => void
  path: string
  desc: string
  method: string
  note?: string
  modelInfo?: {
    speed: number
    quality: number
    useCase: string
    contextWindow?: string
  }
}) => {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'examples'>('overview')
  const [activeLanguage, setActiveLanguage] = useState<CodeLanguage>('javascript')
  const [isDark] = useState(true)
  
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      document.body.style.overflow = 'hidden'
    } else {
      const timer = setTimeout(() => setMounted(false), 300)
      document.body.style.overflow = 'unset'
      return () => clearTimeout(timer)
    }
  }, [isOpen])
  
  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateCodeExample = (lang: CodeLanguage) => {
    const isPost = method === 'POST'
    
    if (lang === 'javascript') {
      if (isPost) {
        return `const response = await fetch('${path}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Your message here',
    persona: 'tsundere'
  })
})

const data = await response.json()
console.log(data.reply)`
      } else {
        return `const response = await fetch('${path}')
const data = await response.json()
console.log(data)`
      }
    } else if (lang === 'python') {
      if (isPost) {
        return `import requests

response = requests.post('${path}', 
  json={
    'message': 'Your message here',
    'persona': 'tsundere'
  }
)

data = response.json()
print(data['reply'])`
      } else {
        return `import requests

response = requests.get('${path}')
data = response.json()
print(data)`
      }
    } else if (lang === 'bash') {
      if (isPost) {
        return `curl -X POST '${path}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "message": "Your message here",
    "persona": "tsundere"
  }'`
      } else {
        return `curl '${path}'`
      }
    } else if (lang === 'php') {
      if (isPost) {
        return `<?php
$ch = curl_init('${path}')
curl_setopt($ch, CURLOPT_POST, 1)
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'message' => 'Your message here',
  'persona' => 'tsundere'
]))
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json'
])
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true)

$response = curl_exec($ch)
$data = json_decode($response)
echo $data->reply`
      } else {
        return `<?php
$response = file_get_contents('${path}')
$data = json_decode($response)
print_r($data)`
      }
    }
    return ''
  }

  if (!mounted && !isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className={`absolute inset-0 bg-black/90 backdrop-blur-md transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose} 
      />
      <div className={`relative bg-slate-950 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden transition-all duration-500 border border-slate-800 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 p-4 sm:p-6 border-b border-sky-400/20">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-sky-400 to-sky-500 rounded-lg shadow-lg shadow-sky-400/20">
                <FaCode className="text-white" size={18} />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white">Endpoint Details</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <FaTimes className="text-white" size={18} />
            </button>
          </div>

          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow-lg shadow-sky-400/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 ${
                activeTab === 'examples'
                  ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow-lg shadow-sky-400/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Examples
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-180px)] bg-slate-950">
          {activeTab === 'overview' ? (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <FaServer className="text-sky-400" size={14} />
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Method</h4>
                </div>
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-lg font-bold text-xs sm:text-sm shadow-lg shadow-sky-400/30">
                  {method}
                </span>
              </div>

              <div className="border-t border-slate-800" />

              <div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <FaInfoCircle className="text-sky-400" size={14} />
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</h4>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{desc}</p>
              </div>

              {modelInfo && (
                <>
                  <div className="border-t border-slate-800" />
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 border border-slate-800">
                      <div className="text-xs font-semibold text-slate-400 mb-1.5">Speed</div>
                      <SpeedIndicator level={modelInfo.speed} />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 border border-slate-800">
                      <div className="text-xs font-semibold text-slate-400 mb-1.5">Quality</div>
                      <QualityIndicator level={modelInfo.quality} />
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 border border-slate-800 col-span-2">
                      <div className="text-xs font-semibold text-slate-400 mb-1">Use Case</div>
                      <div className="text-xs sm:text-sm font-medium text-white">{modelInfo.useCase}</div>
                    </div>
                    {modelInfo.contextWindow && (
                      <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 border border-slate-800 col-span-2">
                        <div className="text-xs font-semibold text-slate-400 mb-1">Context Window</div>
                        <div className="text-xs sm:text-sm font-medium text-white">{modelInfo.contextWindow}</div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="border-t border-slate-800" />

              <div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <FaCode className="text-sky-400" size={14} />
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Endpoint URL</h4>
                </div>
                <div className="bg-black rounded-lg p-3 sm:p-4 mb-2 sm:mb-3 border border-slate-800">
                  <code className="text-sky-400 text-[10px] sm:text-xs break-all font-mono">{path}</code>
                </div>
                <button
                  onClick={() => copy(path)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-sky-400/30"
                >
                  {copied ? (
                    <>
                      <FaCheckCircle size={14} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FaCopy size={14} />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>

              {note && (
                <>
                  <div className="border-t border-slate-800" />
                  <div className="bg-sky-950/20 border-l-4 border-sky-500 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <FaLightbulb className="text-sky-400 mt-0.5 flex-shrink-0" size={16} />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-sky-400 mb-1">Note</h4>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{note}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {(['javascript', 'python', 'bash', 'php'] as CodeLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLanguage(lang)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-semibold text-[10px] sm:text-xs transition-all duration-200 ${
                      activeLanguage === lang
                        ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow-lg shadow-sky-400/30'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>

              <div className="relative">
                <button
                  onClick={() => copy(generateCodeExample(activeLanguage))}
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] sm:text-xs font-semibold transition-all duration-200 flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <FaCheckCircle size={10} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FaCopy size={10} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <SyntaxHighlighter
                  language={activeLanguage === 'bash' ? 'bash' : activeLanguage}
                  style={oneDark}
                  customStyle={{
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    fontSize: '0.75rem',
                    border: '1px solid #1e293b',
                  }}
                  showLineNumbers
                >
                  {generateCodeExample(activeLanguage)}
                </SyntaxHighlighter>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <FaInfoCircle className="text-sky-400" size={12} />
                  <h4 className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Expected Response</h4>
                </div>
                <SyntaxHighlighter
                  language="json"
                  style={oneDark}
                  customStyle={{
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    fontSize: '0.65rem',
                    margin: 0,
                  }}
                >
                  {method === 'POST' 
                    ? `{
  "reply": "Response text here",
  "provider": "model-name"
}`
                    : `{
  "data": [...],
  "count": 10
}`}
                </SyntaxHighlighter>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const endpoints: Endpoint[] = [
  { name: 'Search Anime', method: 'GET', path: '/api/aichixia?category=anime&action=search&query={text}', desc: 'Search anime by title', status: 'online', category: 'Media' },
  { name: 'Search Manga', method: 'GET', path: '/api/aichixia?category=manga&action=search&query={text}', desc: 'Search manga by title', status: 'online', category: 'Media' },
  { name: 'Search Manhwa', method: 'GET', path: '/api/aichixia?category=manhwa&action=search&query={text}', desc: 'Search manhwa by title', status: 'online', category: 'Media' },
  { name: 'Light Novel Search', method: 'GET', path: '/api/aichixia?category=ln&action=search&query={text}', desc: 'Search light novels', status: 'online', category: 'Media' },
  { name: 'Media Detail', method: 'GET', path: '/api/aichixia?category=anime&action=detail&id={value}', desc: 'Get media detail by ID', status: 'online', category: 'Media' },
  { name: 'Trending', method: 'GET', path: '/api/aichixia?action=trending', desc: 'Trending anime & manga', status: 'online', category: 'Media' },
  { name: 'Seasonal Anime', method: 'GET', path: '/api/aichixia?category=anime&action=seasonal', desc: 'Current seasonal anime', status: 'online', category: 'Media' },
  { name: 'Airing Anime', method: 'GET', path: '/api/aichixia?action=airing', desc: 'Currently airing anime', status: 'online', category: 'Media' },
  { name: 'Recommendations', method: 'GET', path: '/api/aichixia?category=anime&action=recommendations&id={value}', desc: 'Get recommendations by ID', status: 'online', category: 'Media' },
  { name: 'Top Genre Manhwa', method: 'GET', path: '/api/aichixia?category=manhwa&action=top-genre&genre={name}', desc: 'Top genre manhwa', status: 'online', category: 'Media' },
  { name: 'Character Detail', method: 'GET', path: '/api/aichixia?action=character&id={value}', desc: 'Character detail by ID', status: 'online', category: 'Media' },
  { name: 'Staff Detail', method: 'GET', path: '/api/aichixia?action=staff&id={value}', desc: 'Staff detail by ID', status: 'maintenance', category: 'Media' },

  { name: 'Aichixia Auto', method: 'POST', path: '/api/chat', desc: 'Auto-routing multi-AI chat', status: 'online', category: 'AI Chat', icon: GiBlackHoleBolas, modelInfo: { speed: 4, quality: 5, useCase: 'Intelligent auto-switching between multiple AI providers' } },
  { name: 'Kimi K2', method: 'POST', path: '/api/models/kimi', desc: '1T params, 32B active', status: 'online', category: 'AI Chat', icon: SiDigikeyelectronics, modelInfo: { speed: 3, quality: 5, useCase: 'Superior tool calling and complex reasoning' } },
  { name: 'GLM 4.6', method: 'POST', path: '/api/models/glm', desc: '355B params with search', status: 'online', category: 'AI Chat', icon: TbSquareLetterZ, modelInfo: { speed: 3, quality: 4, useCase: 'Multilingual excellence with strong reasoning' } },
  { name: 'Mistral 3.1', method: 'POST', path: '/api/models/mistral', desc: '24B params Cloudflare', status: 'online', category: 'AI Chat', icon: TbLetterM, modelInfo: { speed: 4, quality: 4, useCase: 'Fast inference with European focus' } },
  { name: 'GPT-4 Mini', method: 'POST', path: '/api/models/openai', desc: '8B params OpenAI', status: 'online', category: 'AI Chat', icon: SiOpenai, modelInfo: { speed: 3, quality: 4, useCase: 'Balanced performance for general tasks' } },
  { name: 'Qwen3 235B', method: 'POST', path: '/api/models/qwen3', desc: '235B params, 22B active', status: 'online', category: 'AI Chat', icon: SiMatternet, modelInfo: { speed: 3, quality: 4, useCase: 'High-quality multilingual responses' } },
  { name: 'MiniMax M2.1', method: 'POST', path: '/api/models/minimax', desc: '230B params, 10B active', status: 'online', category: 'AI Chat', icon: SiMaze, modelInfo: { speed: 3, quality: 4, useCase: 'Efficient MoE architecture' } },
  { name: 'Llama 3.3 70B', method: 'POST', path: '/api/models/llama', desc: '70B params with search', status: 'online', category: 'AI Chat', icon: SiMeta, modelInfo: { speed: 4, quality: 4, useCase: 'Efficient open-source powerhouse' } },
  { name: 'GPT-OSS 120B', method: 'POST', path: '/api/models/gptoss', desc: '120B params, 5.1B active', status: 'online', category: 'AI Chat', icon: SiOpenai, modelInfo: { speed: 3, quality: 4, useCase: 'Large open-source with browser search' } },
  { name: 'Gemini 3 Flash', method: 'POST', path: '/api/models/gemini', desc: '1.2T params, 5-30B active', status: 'online', category: 'AI Chat', icon: SiGooglegemini, modelInfo: { speed: 4, quality: 5, useCase: 'Multimodal understanding and accuracy' } },
  { name: 'MiMo V2 Flash', method: 'POST', path: '/api/models/mimo', desc: '309B params, 15B active', status: 'online', category: 'AI Chat', icon: SiXiaomi, modelInfo: { speed: 3, quality: 4, useCase: 'Efficient multi-modal processing' } },
  { name: 'DeepSeek V3.1', method: 'POST', path: '/api/models/deepseek-v', desc: '671B params, 37B active', status: 'online', category: 'AI Chat', icon: GiSpermWhale, modelInfo: { speed: 3, quality: 5, useCase: 'Deep reasoning and code generation' } },
  { name: 'DeepSeek V3.2', method: 'POST', path: '/api/models/deepseek', desc: '671B params, 37B active', status: 'online', category: 'AI Chat', icon: GiSpermWhale, modelInfo: { speed: 3, quality: 5, useCase: 'Deep reasoning and code generation' } },
  { name: 'Groq Compound', method: 'POST', path: '/api/models/compound', desc: 'Multi-model compound AI', status: 'online', category: 'AI Chat', icon: GiPowerLightning, modelInfo: { speed: 4, quality: 5, useCase: 'Multi-model agentic system with tools' } },
  { name: 'Claude Haiku 4.5', method: 'POST', path: '/api/models/claude', desc: '~130B params Anthropic', status: 'online', category: 'AI Chat', icon: SiAnthropic, modelInfo: { speed: 4, quality: 4, useCase: 'Fast, capable, and balanced Anthropic model' } },
  { name: 'Qwen3 Coder 480B', method: 'POST', path: '/api/models/qwen', desc: '480B params, 35B active', status: 'online', category: 'AI Chat', icon: SiAlibabacloud, modelInfo: { speed: 3, quality: 5, useCase: 'Specialized in coding and Asian languages' } },
  { name: 'Cohere Command A', method: 'POST', path: '/api/models/cohere', desc: 'Enterprise-grade tool use', status: 'online', category: 'AI Chat', icon: GiClover, modelInfo: { speed: 3, quality: 4, useCase: 'Enterprise-grade with excellent tool use' } },
  
  { name: 'Flux 2', method: 'POST', path: '/api/models/flux', desc: 'Advanced image generation', status: 'online', category: 'AI Image', icon: SiFlux, modelInfo: { speed: 4, quality: 5, useCase: 'Text-to-image generation with photorealistic results' } },
  { name: 'Phoenix 1.0', method: 'POST', path: '/api/models/phoenix', desc: 'Photorealistic image AI', status: 'online', category: 'AI Image', icon: GiPowerLightning, modelInfo: { speed: 3, quality: 5, useCase: 'Ultra-realistic image generation' } },
  { name: 'Lucid Origin', method: 'POST', path: '/api/models/lucid', desc: 'Anime-style image generation', status: 'online', category: 'AI Image', icon: GiPaintBrush, modelInfo: { speed: 4, quality: 5, useCase: 'Anime and illustration style generation' } },
]

export default function ApiPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Media' | 'AI Chat' | 'AI Image'>('All')
  const [showNotice, setShowNotice] = useState<boolean>(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null)

  const categories: ('All' | 'Media' | 'AI Chat' | 'AI Image')[] = ['All', 'Media', 'AI Chat', 'AI Image']

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter(ep => {
      const matchesSearch =
        ep.name.toLowerCase().includes(search.toLowerCase()) ||
        ep.method.toLowerCase().includes(search.toLowerCase()) ||
        ep.desc.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || ep.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  const handleCopy = (path: string) => {
    const fullPath = path.startsWith('/') ? `https://aichixia.vercel.app${path}` : path
    navigator.clipboard.writeText(fullPath)
    setCopied(path)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCardClick = (ep: Endpoint) => {
    setSelectedEndpoint(ep)
    setShowModal(true)
  }

  const stats = {
    total: endpoints.length,
    online: endpoints.filter(e => e.status === 'online').length,
    totalParams: '5.2T',
    models: endpoints.filter(e => e.category === 'AI Chat').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMjUsMjExLDI1MiwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
      
      {showNotice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-sky-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-500/20 transform">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-sky-500/20 to-sky-500/20 border border-sky-400/30 mb-2">
                <FaServer className="w-8 h-8 text-sky-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent">
                Access Limited
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-300">
                <p className="leading-relaxed">
                  URLs are protected for API security. Full access available at:
                </p>
                <div className="bg-black/40 rounded-xl p-4 border border-sky-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-sky-300">
                    <FaCode className="w-4 h-4 shrink-0" />
                    <a href="https://github.com/Takawell/Aichixia" target="_blank" rel="noopener noreferrer" className="hover:text-sky-200 transition-colors break-all font-mono text-xs sm:text-sm">
                      OFFICIAL REPOSITORY
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sky-300">
                    <FaServer className="w-4 h-4 shrink-0" />
                    <a href="https://aichixia.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-sky-200 transition-colors break-all font-mono text-xs sm:text-sm">
                      OFFICIAL WEBSITE
                    </a>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowNotice(false)}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-600 hover:from-sky-500 hover:to-sky-500 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/50"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 space-y-4">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="relative">
                  <FaServer className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400 animate-pulse" />
                  <div className="absolute inset-0 blur-xl bg-sky-400/50 animate-pulse"></div>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-sky-400 via-sky-400 to-sky-400 bg-clip-text text-transparent">
                  API Endpoints
                </h1>
              </div>
              <div className="h-1.5 bg-gradient-to-r from-sky-500 via-sky-500 to-sky-500 rounded-full"></div>
            </div>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              Explore {stats.total} endpoints powered by {stats.totalParams} parameters across {stats.models} AI models
            </p>
            
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-sky-600 to-sky-600 hover:from-sky-500 hover:to-sky-500 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/50 text-sm sm:text-base"
            >
              <FaPlay className="w-4 h-4" />
              <span>Try Playground</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 max-w-4xl mx-auto">
            {[
              { label: 'Total Endpoints', value: stats.total, icon: FaServer, color: 'from-sky-500 to-sky-500' },
              { label: 'Online', value: stats.online, icon: FaCircle, color: 'from-green-500 to-emerald-500' },
              { label: 'AI Models', value: stats.models, icon: FaBrain, color: 'from-sky-500 to-sky-500' },
              { label: 'Parameters', value: stats.totalParams, icon: FaRobot, color: 'from-sky-500 to-sky-500' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 hover:scale-105 transition-transform duration-300 hover:border-sky-500/50 group"
              >
                <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} mb-2 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="max-w-5xl mx-auto mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search endpoints, methods, or descriptions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-slate-900/80 backdrop-blur-xl border-2 border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all duration-300 text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-sky-500 to-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105'
                      : 'bg-slate-800/80 text-gray-300 hover:bg-slate-700/80 border border-slate-700/50'
                  }`}
                >
                  {cat}
                  <span className="ml-2 text-xs opacity-75">
                    ({cat === 'All' ? endpoints.length : endpoints.filter(e => e.category === cat).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {selectedCategory === 'AI Chat' && (
            <div className="mb-6 bg-sky-950/20 border border-sky-900 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-sky-400 mt-0.5" size={16} />
                <p className="text-slate-300 text-sm">
                  Target specific AI models for consistent responses from a particular provider. All models support web search capabilities.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {filteredEndpoints.map((ep, i) => {
              const Icon = ep.icon || FaCode
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleCardClick(ep)}
                  className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-sky-500/20 hover:border-sky-500/50 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-600/0 to-sky-600/0 group-hover:from-sky-600/5 group-hover:to-sky-600/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {ep.category !== 'Media' && (
                          <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-500/20 border border-sky-500/30 shrink-0">
                            <Icon className="w-4 h-4 text-sky-400" />
                          </div>
                        )}
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-tight">
                          {ep.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <FaCircle className={`w-2 h-2 ${ep.status === 'online' ? 'text-green-400 animate-pulse' : 'text-yellow-400'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${ep.status === 'online' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {ep.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mb-3 leading-relaxed">{ep.desc}</p>

                    {ep.modelInfo && (
                      <div className="mb-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <FaBolt className="text-sky-400" size={10} />
                            <span className="text-slate-400">Speed:</span>
                            <SpeedIndicator level={ep.modelInfo.speed} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FaStar className="text-sky-400" size={10} />
                            <span className="text-slate-400">Quality:</span>
                            <QualityIndicator level={ep.modelInfo.quality} />
                          </div>
                        </div>
                        <p className="text-[10px] text-sky-400/80">{ep.modelInfo.useCase}</p>
                      </div>
                    )}

                    <div className="bg-black/40 rounded-lg p-3 mb-3 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
                      <code className="text-[10px] sm:text-xs text-sky-300 break-all block leading-relaxed font-mono blur-sm select-none">
                        {hoveredCard === i ? ep.path : (ep.path.length > 45 ? ep.path.slice(0, 45) + '...' : ep.path)}
                      </code>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-sky-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-sky-500/30">
                          URL Protected
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          ep.method === 'GET' 
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30' 
                            : 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                        }`}>
                          {ep.method}
                        </span>
                        <span className="px-2.5 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-[10px] font-medium">
                          {ep.category}
                        </span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopy(ep.path)
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-sky-600 hover:from-sky-500 hover:to-sky-500 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/50 flex items-center gap-1.5 shrink-0"
                      >
                        {copied === ep.path ? (
                          <>
                            <FaCheck className="w-3 h-3" />
                            <span className="hidden sm:inline">Copied</span>
                          </>
                        ) : (
                          <>
                            <FaCopy className="w-3 h-3" />
                            <span className="hidden sm:inline">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredEndpoints.length === 0 && (
            <div className="text-center py-16">
              <BiSearchAlt className="w-20 h-20 sm:w-24 sm:h-24 text-gray-600 mx-auto mb-4" />
              <p className="text-lg sm:text-xl text-gray-400 font-semibold">No endpoints found</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search or category filter</p>
            </div>
          )}

          <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <HiDocumentText className="w-6 h-6 text-sky-400" />
              <h2 className="text-xl sm:text-2xl font-bold">API Documentation</h2>
            </div>
            <div className="space-y-4 text-sm sm:text-base">
              <div>
                <span className="font-semibold text-sky-300 block mb-2">Base URL:</span>
                <div className="bg-black/40 px-4 py-2.5 rounded-lg border border-slate-700/50 relative overflow-hidden">
                  <code className="block text-sky-300 blur-sm select-none">
                    https://aichixia.vercel.app
                  </code>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-sky-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-sky-500/30">
                      Protected URL
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span className="font-semibold text-sky-300 block mb-2">Required Parameters:</span>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2 bg-slate-800/50 p-3 rounded-lg">
                    <FaCode className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span><code className="bg-slate-900/50 px-2 py-1 rounded text-sky-300">query</code> — Search term for search endpoints</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-800/50 p-3 rounded-lg">
                    <FaCode className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span><code className="bg-slate-900/50 px-2 py-1 rounded text-sky-300">id</code> — Media/Character/Staff ID for detail endpoints</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-800/50 p-3 rounded-lg">
                    <FaCode className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span><code className="bg-slate-900/50 px-2 py-1 rounded text-sky-300">genre</code> — Genre name for top-genre endpoint</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3 mt-12">
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              All endpoints are monitored in real-time with 99.9% uptime. Total capacity: 5.2T parameters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs text-gray-500">
              <span>© {new Date().getFullYear()} Aichiow Plus All Right Reserved</span>
            </div>
          </div>
        </div>
      </div>

      {selectedEndpoint && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedEndpoint(null)
          }}
          path={`https://aichixia.vercel.app${selectedEndpoint.path}`}
          desc={selectedEndpoint.desc}
          method={selectedEndpoint.method}
          note={selectedEndpoint.note}
          modelInfo={selectedEndpoint.modelInfo}
        />
      )}
    </div>
  )
}
