import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaTiktok, FaRocket, FaCode, FaShieldAlt, FaStar, FaBolt, FaFire, FaGem, FaCrown, FaHeart, FaMagic, FaPlay } from 'react-icons/fa'

export default function ComingSoonPage() {
  const [lang, setLang] = useState('EN')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    
    const particleArray = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10
    }))
    setParticles(particleArray)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const content = {
    ID: {
      title: 'SEGERA HADIR',
      subtitle: 'Revolusi Streaming Anime Dimulai',
      hero: 'Pengalaman Menonton Yang Belum Pernah Ada',
      features: [
        {
          icon: <FaBolt />,
          title: 'Kecepatan Luar Biasa',
          desc: 'Teknologi streaming ultra-fast dengan zero buffering'
        },
        {
          icon: <FaShieldAlt />,
          title: '100% Legal & Aman',
          desc: 'Menghormati hak cipta kreator dan industri anime'
        },
        {
          icon: <FaGem />,
          title: 'Kualitas Premium',
          desc: 'Streaming 4K HDR dengan audio Dolby Atmos'
        },
        {
          icon: <FaMagic />,
          title: 'AI-Powered',
          desc: 'Rekomendasi cerdas berdasarkan preferensi Anda'
        }
      ],
      description: 'Aichiow menghadirkan platform streaming anime generasi berikutnya yang menggabungkan teknologi cutting-edge dengan pengalaman pengguna yang sempurna. Kami tidak hanya membangun platform streaming, tetapi menciptakan ekosistem lengkap untuk komunitas anime global.',
      vision: 'Menjadi rumah digital terbaik bagi pecinta anime di seluruh dunia',
      cta: 'Kembali ke Beranda'
    },
    EN: {
      title: 'COMING SOON',
      subtitle: 'The Anime Streaming Revolution Begins',
      hero: 'An Unprecedented Viewing Experience',
      features: [
        {
          icon: <FaBolt />,
          title: 'Lightning Fast',
          desc: 'Ultra-fast streaming technology with zero buffering'
        },
        {
          icon: <FaShieldAlt />,
          title: '100% Legal & Safe',
          desc: 'Respecting creators rights and anime industry'
        },
        {
          icon: <FaGem />,
          title: 'Premium Quality',
          desc: '4K HDR streaming with Dolby Atmos audio'
        },
        {
          icon: <FaMagic />,
          title: 'AI-Powered',
          desc: 'Smart recommendations based on your preferences'
        }
      ],
      description: 'Aichiow presents the next-generation anime streaming platform that combines cutting-edge technology with seamless user experience. We are not just building a streaming platform, but creating a complete ecosystem for the global anime community.',
      vision: 'To become the ultimate digital home for anime lovers worldwide',
      cta: 'Back to Home'
    }
  }

  const currentContent = content[lang]

  return (
    <div className="relative bg-black text-white min-h-screen overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(56,189,248,0.4), 0 0 40px rgba(56,189,248,0.2), inset 0 0 20px rgba(56,189,248,0.1); }
          50% { box-shadow: 0 0 40px rgba(56,189,248,0.6), 0 0 80px rgba(56,189,248,0.3), inset 0 0 30px rgba(56,189,248,0.2); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes border-dance {
          0% { border-color: rgba(56,189,248,0.5); }
          50% { border-color: rgba(14,165,233,0.8); }
          100% { border-color: rgba(56,189,248,0.5); }
        }
        @keyframes particle-float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .float-animation { animation: float 3s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .gradient-animate { 
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        .border-animate { animation: border-dance 2s ease-in-out infinite; }
        .particle { animation: particle-float linear infinite; }
        .rotate-slow { animation: rotate 20s linear infinite; }
        .text-shadow-glow {
          text-shadow: 0 0 10px rgba(56,189,248,0.8), 0 0 20px rgba(56,189,248,0.6), 0 0 30px rgba(56,189,248,0.4), 0 0 40px rgba(56,189,248,0.2);
        }
        .glass {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(56,189,248,0.2);
        }
        .glass-strong {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(56,189,248,0.3);
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle fixed w-1 h-1 bg-sky-400 rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(56,189,248,0.15), transparent 50%)`
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="glass fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div 
              className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 text-shadow-glow"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              AICHIOW
            </motion.div>
            
            <motion.div
              className="flex gap-2 sm:gap-3 bg-black/60 rounded-full px-2 py-1.5 border border-sky-500/30"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {['ID', 'EN'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLang(tab)}
                  className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold transition-all duration-300 text-xs sm:text-sm ${
                    lang === tab
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/50 scale-105'
                      : 'text-sky-300 hover:text-white hover:bg-sky-500/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>
          </div>
        </header>

        <main className="flex-1 pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="inline-block mb-6">
                <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 glass rounded-full border-animate">
                  <FaRocket className="text-sky-400 text-lg sm:text-xl animate-bounce" />
                  <span className="text-xs sm:text-sm text-sky-300 font-semibold">{currentContent.subtitle}</span>
                </div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6">
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 gradient-animate text-shadow-glow">
                  {currentContent.title}
                </span>
              </h1>
              
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-500 blur-xl opacity-50"></div>
                <p className="relative text-xl sm:text-2xl md:text-3xl text-sky-200 font-light px-4">
                  {currentContent.hero}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {currentContent.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="glass-strong rounded-2xl p-6 sm:p-8 hover:scale-105 transition-all duration-300 pulse-glow group cursor-pointer"
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                >
                  <div className="text-4xl sm:text-5xl text-sky-400 mb-4 group-hover:scale-110 transition-transform float-animation">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="glass-strong rounded-3xl p-8 sm:p-12 mb-12 sm:mb-16 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-500/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <FaFire className="text-3xl sm:text-4xl text-sky-400" />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    Why Aichiow?
                  </h2>
                </div>
                
                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                  {currentContent.description}
                </p>
                
                <div className="flex items-center gap-3 p-4 sm:p-6 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-2xl border border-sky-500/30">
                  <FaCrown className="text-2xl sm:text-3xl text-yellow-400 flex-shrink-0" />
                  <p className="text-sm sm:text-base md:text-lg text-sky-100 italic font-medium">
                    {currentContent.vision}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-sky-300 mb-6 sm:mb-8 flex items-center justify-center gap-3">
                <FaHeart className="text-red-400 animate-pulse" />
                Connect With Us
              </h3>
              
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 sm:mb-12">
                <motion.a
                  href="https://github.com/Takawell/aichiow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 sm:px-8 py-4 sm:py-5 glass-strong rounded-2xl hover:bg-sky-500/20 transition-all duration-300 group pulse-glow"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub className="text-3xl sm:text-4xl text-sky-400 group-hover:text-white transition-colors" />
                  <div className="text-left">
                    <div className="text-xs sm:text-sm text-gray-400">Follow us on</div>
                    <div className="text-base sm:text-lg font-bold text-white">GitHub</div>
                  </div>
                </motion.a>

                <motion.a
                  href="https://tiktok.com/@putrawangyyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 sm:px-8 py-4 sm:py-5 glass-strong rounded-2xl hover:bg-sky-500/20 transition-all duration-300 group pulse-glow"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTiktok className="text-3xl sm:text-4xl text-sky-400 group-hover:text-white transition-colors" />
                  <div className="text-left">
                    <div className="text-xs sm:text-sm text-gray-400">Watch us on</div>
                    <div className="text-base sm:text-lg font-bold text-white">TikTok</div>
                  </div>
                </motion.a>
              </div>

              <motion.a
                href="/"
                className="inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-2xl font-bold text-base sm:text-lg shadow-lg shadow-sky-500/50 transition-all duration-300 group relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <FaPlay className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <span className="relative z-10">{currentContent.cta}</span>
              </motion.a>
            </motion.div>

            <motion.div
              className="text-center text-gray-500 text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                <span>System Status: Building Amazing Things</span>
              </div>
              <p className="text-xs">© 2025 Aichiow Plus. All rights reserved.</p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
