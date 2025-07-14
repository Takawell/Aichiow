// pages/auth/verify.tsx
import Head from "next/head";
import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <>
      <Head>
        <title>Verify Your Email | Aichiow</title>
      </Head>
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0f0f0f] px-6 text-white">
        <div className="max-w-md w-full bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl shadow-[0_0_30px_rgba(0,153,255,0.15)]">
          <div className="flex justify-center mb-4">
            <MailCheck className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-center text-blue-400 mb-2">Check Your Email</h1>
          <p className="text-center text-gray-400 mb-6">
            We’ve sent a verification link to your email. Please verify to continue using Aichiow.
          </p>
          <Link
            href="/auth/login"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 transition-all py-2 rounded-md font-semibold"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </>
  );
}
