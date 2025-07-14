// pages/auth/register.tsx
import { RegisterForm } from "@/components/auth/RegisterForm";
import Head from "next/head";

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register | Aichiow</title>
        <meta name="description" content="Create your Aichiow account" />
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-500">Welcome to Aichiow</h1>
            <p className="text-gray-400 text-sm">Create your account to unlock more anime & manga!</p>
          </div>
          <RegisterForm />
        </div>
      </main>
    </>
  );
}
