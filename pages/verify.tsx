import { useState } from 'react';
import { useRouter } from 'next/router';

const PASSCODE = 'claire unlock'; // kamu bisa ubah ini sesuka hati

export default function VerifyPage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (input.toLowerCase().trim() === PASSCODE) {
      document.cookie = "verified=1; max-age=3600; path=/";
      setLoading(true);
      setTimeout(() => router.push('/'), 1000);
    } else {
      setError('Incorrect phrase. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono relative">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 glow">CLAIRE SHIELD</h1>
      <p className="mb-6 text-purple-300">Manual Verification Required</p>

      <div className="bg-gray-900 bg-opacity-40 border border-blue-800 px-6 py-8 rounded-xl w-[90%] max-w-md text-center">
        <p className="text-sm text-gray-400 mb-4">
          To proceed, type the following passphrase:
        </p>
        <code className="block mb-4 text-blue-300 text-lg font-bold tracking-widest">
          claire unlock
        </code>

        <input
          type="text"
          placeholder="Enter passphrase..."
          className="w-full px-4 py-2 mb-4 text-black rounded-md focus:outline-none"
          value={input}
          onChange={(e) => {
            setError('');
            setInput(e.target.value);
          }}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-700 py-2 rounded-md font-bold hover:from-blue-600 hover:to-purple-800 transition"
        >
          {loading ? 'Verifying...' : 'Submit'}
        </button>
      </div>

      <div className="absolute bottom-4 text-xs text-gray-500">
        🔐 CLAIRE SHIELD by !TAKA — Type Access Required
      </div>

      <style jsx>{`
        .glow {
          text-shadow: 0 0 8px #4fc3f7, 0 0 16px #7e57c2, 0 0 24px #9575cd;
        }
      `}</style>
    </div>
  );
}
