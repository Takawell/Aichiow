export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono relative">
      {/* Cyber background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-purple-900 to-blue-900 opacity-40 pointer-events-none" />

      {/* Title */}
      <h1 className="text-6xl font-bold text-red-500 drop-shadow-lg glow mb-4 z-10">
        403 FORBIDDEN
      </h1>

      <p className="text-purple-300 mb-6 z-10 text-center px-4">
        🚫 Access blocked by CLAIRE SHIELD<br />
        Your connection was flagged as suspicious or hostile.
      </p>

      <a
        href="/"
        className="z-10 px-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-700 hover:from-blue-600 hover:to-purple-800 font-bold transition-all shadow-lg"
      >
        🔙 Return to Home
      </a>

      {/* Footer */}
      <div className="absolute bottom-4 text-xs text-gray-600 text-center z-10">
        CLAIRE SHIELD by !TAKA — Gate Status: BLOCKED
      </div>

      <style jsx>{`
        .glow {
          text-shadow: 0 0 10px #f87171, 0 0 20px #ef4444, 0 0 30px #dc2626;
        }
      `}</style>
    </div>
  );
}
