import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const PASSCODE = 'claire unlock';

export default function VerifyPage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (document.cookie.includes('verified=1')) {
      router.replace('/');
    }
  }, []);

  const handleSubmit = () => {
    const isCorrect = input.toLowerCase().trim() === PASSCODE;

    if (isCorrect) {
      document.cookie = 'verified=1; max-age=21600; path=/'; // 6 jam
      setLoading(true);
      setTimeout(() => router.push('/'), 1000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(`❌ Incorrect incantation. Attempt ${newAttempts}/3`);
      setInput('');

      if (newAttempts >= 3) {
        router.push('/403');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white font-mono relative">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 glow">CLAIRE SHIELD</h1>
      <p className="mb-6 text-purple-300 text-center">
        🌀 The Portal to the Isekai Realm is protected.<br />
        Type the correct incantation to gain passage.
      </p>

      <div className="bg-gray-900 bg-opacity-40 border border-blue-800 px-6 py-8 rounded-xl w-[90%] max-w-md text-center shadow-xl">
        <p className="text-sm text-gray-400 mb-4">
          Speak the phrase of access:
        </p>
        <code className="block mb-4 text-blue-300 text-lg font-bold tracking-widest">
          claire unlock
        </code>

        <input
          type="text"
          placeholder="Enter incantation..."
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
          {loading ? 'Opening Portal...' : 'Unlock'}
        </button>
      </div>

      <div className="absolute bottom-4 text-xs text-gray-500 text-center px-4">
        🛡️ CLAIRE SHIELD by !TAKA<br />
        This gate stands between you and the anime realm.
      </div>

      <style jsx>{`
        .glow {
          text-shadow: 0 0 8px #4fc3f7, 0 0 16px #7e57c2, 0 0 24px #9575cd;
        }
      `}</style>
    </div>
  );
}
