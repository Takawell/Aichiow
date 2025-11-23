import { useState, useEffect } from 'react'
import { X, Bell, Info, Github } from 'lucide-react'
import { SiTiktok } from 'react-icons/si'

export default function UpdateModal() {
  const [step, setStep] = useState(null)
  const [lang, setLang] = useState('en')
  const VERSION = '1.2.0'

  useEffect(() => {
    const seenVersion = typeof window !== 'undefined' ? localStorage.getItem('updateModalSeen') : null
    if (seenVersion !== VERSION) {
      setStep('notice')
      if (typeof window !== 'undefined') {
        localStorage.setItem('updateModalSeen', VERSION)
      }
    }
  }, [])

  const handleClose = () => setStep(null)
  const handleNext = () => setStep(step === 'notice' ? 'update' : null)

  const t = {
    en: {
      update: {
        title: 'Updates',
        updates: [
          'Integration of Aichixia into the community.',
          'Profile UI redesigned to be more modern and responsive.',
          'New feature: Anime Scanning powered by smart technology.',
        ],
        close: 'Close',
      },
      notice: {
        title: 'Announcements',
        notices: [
          'Some features are still in beta testing.',
          'If you find any issues, report them via social media below.',
          'Thank you for using Aichiow.',
        ],
        next: 'View Updates',
      },
    },
    id: {
      update: {
        title: 'Pembaruan',
        updates: [
          'Integrasi Aichixia ke komunitas.',
          'Pembaruan tampilan profil menjadi lebih modern dan responsif.',
          'Fitur baru: Anime Scanning dengan teknologi cerdas.',
        ],
        close: 'Tutup',
      },
      notice: {
        title: 'Pemberitahuan',
        notices: [
          'Beberapa fitur masih dalam tahap pengujian beta.',
          'Jika menemukan bug, laporkan melalui media sosial di bawah.',
          'Terima kasih telah menggunakan Aichiow.',
        ],
        next: 'Lihat Pembaruan',
      },
    },
  }

  if (!step) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      {step === 'notice' && (
        <div
          className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-500/20 rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/20 text-white overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent)]" />
          
          <div className="relative flex justify-between items-center p-4 sm:p-6 border-b border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-transparent">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {t[lang].notice.title}
              </span>
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-blue-500/20 rounded-full transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-blue-300 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>

          <div className="relative flex justify-center mt-6">
            <div
              className="relative flex items-center bg-slate-800/50 rounded-full p-1 cursor-pointer border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
              onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
            >
              <div
                className={`absolute w-16 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out ${
                  lang === 'en' ? 'left-1' : 'left-[calc(50%+0.25rem)]'
                }`}
              />
              <span
                className={`relative z-10 w-16 text-center text-sm font-bold transition-all duration-200 ${
                  lang === 'en' ? 'text-white' : 'text-slate-400'
                }`}
              >
                EN
              </span>
              <span
                className={`relative z-10 w-16 text-center text-sm font-bold transition-all duration-200 ${
                  lang === 'id' ? 'text-white' : 'text-slate-400'
                }`}
              >
                ID
              </span>
            </div>
          </div>

          <div className="relative p-4 sm:p-6 space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent">
            <ul className="space-y-3">
              {t[lang].notice.notices.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm sm:text-base text-slate-300 p-3 rounded-lg bg-slate-800/30 border border-blue-500/10 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-200"
                >
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative p-4 sm:p-6 border-t border-blue-500/20 flex items-center justify-between bg-gradient-to-r from-transparent to-blue-600/5">
            <div className="flex gap-3 sm:gap-4 items-center">
              <a
                href="https://github.com/Takawell/Aichiow"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-blue-500/20 rounded-full transition-all duration-200 border border-transparent hover:border-blue-500/30"
              >
                <Github className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://www.tiktok.com/@putrawangyyy"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-blue-500/20 rounded-full transition-all duration-200 border border-transparent hover:border-blue-500/30"
              >
                <SiTiktok className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 text-sm sm:text-base"
            >
              {t[lang].notice.next}
            </button>
          </div>
        </div>
      )}

      {step === 'update' && (
        <div
          className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-500/20 rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/20 text-white overflow-hidden animate-in zoom-in-95 duration-500"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent)]" />
          
          <div className="relative flex justify-between items-center p-4 sm:p-6 border-b border-blue-500/20 bg-gradient-to-r from-blue-600/10 to-transparent">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {t[lang].update.title}
              </span>
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-blue-500/20 rounded-full transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-blue-300 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>

          <div className="relative p-4 sm:p-6 space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent">
            <ul className="space-y-3">
              {t[lang].update.updates.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm sm:text-base text-slate-300 p-3 rounded-lg bg-slate-800/30 border border-blue-500/10 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all duration-200"
                >
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative p-4 sm:p-6 border-t border-blue-500/20 flex justify-end bg-gradient-to-r from-transparent to-blue-600/5">
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 text-sm sm:text-base"
            >
              {t[lang].update.close}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
