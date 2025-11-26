import React, { useState, useEffect } from 'react';
import { Lock, Mail, AlertTriangle, Clock, Shield, XCircle, FileText, Sparkles } from 'lucide-react';

export default function ChainLockAnimation() {
  const [time, setTime] = useState(new Date());
  const [noteHover, setNoteHover] = useState(false);
  const [lockShake, setLockShake] = useState(false);
  const [glowPulse, setGlowPulse] = useState(0);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const shakeInterval = setInterval(() => {
      setLockShake(true);
      setTimeout(() => setLockShake(false), 500);
    }, 5000);
    return () => clearInterval(shakeInterval);
  }, []);

  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowPulse(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(glowInterval);
  }, []);

  const ChainLink = ({ rotation = 0, delay = '0s' }) => (
    <div 
      className="chain-link"
      style={{ 
        transform: `rotate(${rotation}deg)`,
        animationDelay: delay
      }}
    >
      <div className="chain-segment" />
    </div>
  );

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">   
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-sky-500 rounded-full animate-spin-very-slow" />
        <div className="absolute bottom-20 right-20 w-40 h-40 border-2 border-blue-500 rounded-full animate-spin-reverse" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-cyan-500 rounded-full animate-spin-slow" />
      </div>

      <div className="relative w-full max-w-4xl aspect-square max-h-[90vh]">
        
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 sm:w-12 md:w-16 h-1/2 flex flex-col items-center justify-start space-y-2 sm:space-y-3 md:space-y-4 pt-4 sm:pt-6 md:pt-8 animate-chain-vertical">
          {[...Array(8)].map((_, i) => (
            <ChainLink key={i} delay={`${i * 0.1}s`} />
          ))}
        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 sm:w-12 md:w-16 h-1/2 flex flex-col items-center justify-end space-y-2 sm:space-y-3 md:space-y-4 pb-4 sm:pb-6 md:pb-8 animate-chain-vertical" style={{ animationDelay: '1s' }}>
          {[...Array(8)].map((_, i) => (
            <ChainLink key={i} delay={`${i * 0.1}s`} />
          ))}
        </div>

        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-8 sm:h-12 md:h-16 w-1/2 flex items-center justify-start space-x-2 sm:space-x-3 md:space-x-4 pl-4 sm:pl-6 md:pl-8 animate-chain-horizontal">
          {[...Array(8)].map((_, i) => (
            <ChainLink key={i} rotation={90} delay={`${i * 0.1}s`} />
          ))}
        </div>

        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 sm:h-12 md:h-16 w-1/2 flex items-center justify-end space-x-2 sm:space-x-3 md:space-x-4 pr-4 sm:pr-6 md:pr-8 animate-chain-horizontal" style={{ animationDelay: '1s' }}>
          {[...Array(8)].map((_, i) => (
            <ChainLink key={i} rotation={90} delay={`${i * 0.1}s`} />
          ))}
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8">
          
          <div className={`relative ${lockShake ? 'animate-shake' : ''}`}>
            <div className={`absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full blur-2xl opacity-${glowPulse === 0 ? '60' : glowPulse === 1 ? '40' : '20'} transition-opacity duration-1000 scale-150`} />
            
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 sm:p-8 md:p-10 rounded-3xl border-4 border-sky-500 shadow-2xl animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-blue-500/20 rounded-3xl animate-pulse-slow" />
              
              <Lock className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 text-sky-400 relative z-10 drop-shadow-2xl animate-pulse-glow" />
              
              <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full animate-ping" />
              <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>

            <div className="absolute -top-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-spin-slow shadow-lg">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>

            <div className="absolute -bottom-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>

          <div className="text-center space-y-2 animate-slide-up px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-lg">
              Access Restricted
            </h2>
            <div className="flex items-center justify-center space-x-2 text-sky-300">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-spin-slow" />
              <p className="text-sm sm:text-base md:text-lg font-mono">
                {time.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 transform hover:scale-110 transition-all duration-300 cursor-pointer animate-slide-in-right"
          onMouseEnter={() => setNoteHover(true)}
          onMouseLeave={() => setNoteHover(false)}
        >
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl blur-xl ${noteHover ? 'opacity-60' : 'opacity-30'} transition-opacity duration-300`} />
            
            <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-4 sm:p-5 md:p-6 rounded-2xl shadow-2xl border-2 border-amber-300 transform rotate-3 hover:rotate-0 transition-all duration-300 w-48 sm:w-56 md:w-64">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 sm:w-14 h-6 sm:h-7 bg-amber-200 rounded-lg shadow-md border border-amber-300" />
              
              <div className="flex items-start space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 animate-bounce" />
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-amber-900">System Notice</h3>
              </div>
              
              <div className="space-y-2 text-xs sm:text-sm text-amber-800">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                  <p>Project temporarily locked</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                  <p>Maintenance in progress</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0" />
                  <p>Expected: 15-30 minutes</p>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-amber-300 border-dashed flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-amber-700 font-semibold">Contact Support</span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
              </div>

              <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-amber-400 rounded-full shadow-lg animate-pulse" />
            </div>

            {noteHover && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap animate-fade-in border border-sky-500/30 z-50">
                Click for more info
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 animate-slide-in-left">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-2xl border-2 border-sky-500/30 shadow-2xl hover:scale-105 transition-all duration-300 w-48 sm:w-56 md:w-64">
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-sky-300">Alert Status</h3>
                <p className="text-xs text-sky-400/70">System Locked</p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-sky-300/80">
                <span>Security Level:</span>
                <span className="font-bold text-red-400">MAXIMUM</span>
              </div>
              <div className="flex justify-between items-center text-sky-300/80">
                <span>Access Status:</span>
                <span className="font-bold text-red-400">DENIED</span>
              </div>
              <div className="flex justify-between items-center text-sky-300/80">
                <span>Auth Required:</span>
                <span className="font-bold text-yellow-400">YES</span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-sky-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <div className="w-2 h-2 bg-red-500 rounded-full absolute" />
                <span className="text-xs text-red-400 font-semibold ml-2">LOCKED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/4 left-8 w-3 h-3 sm:w-4 sm:h-4 bg-sky-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-12 w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-16 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-8 w-3 h-3 sm:w-4 sm:h-4 bg-sky-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
      </div>

      <style jsx>{`
        .chain-link {
          animation: chain-float 2s ease-in-out infinite;
        }
        
        .chain-segment {
          width: 24px;
          height: 32px;
          border: 4px solid;
          border-image: linear-gradient(135deg, #0ea5e9, #38bdf8) 1;
          border-radius: 12px;
          position: relative;
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.5),
                      inset 0 0 10px rgba(14, 165, 233, 0.3);
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(56, 189, 248, 0.1));
        }

        @media (min-width: 640px) {
          .chain-segment {
            width: 32px;
            height: 40px;
            border-width: 5px;
          }
        }

        @media (min-width: 768px) {
          .chain-segment {
            width: 40px;
            height: 48px;
            border-width: 6px;
          }
        }

        .chain-segment::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #38bdf8, transparent);
          animation: shine 2s ease-in-out infinite;
        }

        @keyframes chain-float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-5px) scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes chain-vertical {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes chain-horizontal {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-5px) rotate(-2deg); }
          75% { transform: translateX(5px) rotate(2deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(56, 189, 248, 0.8));
          }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-very-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px) rotate(10deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(3deg);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shine {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .animate-chain-vertical {
          animation: chain-vertical 3s ease-in-out infinite;
        }

        .animate-chain-horizontal {
          animation: chain-horizontal 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .animate-spin-very-slow {
          animation: spin-very-slow 20s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
