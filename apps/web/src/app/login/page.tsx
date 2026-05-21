import Link from 'next/link';
import { AuthForm } from '../../components/auth-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <AuthForm mode="login" />
        <p className="mt-6 text-center text-sm text-slate-400">
          New here? <Link href="/signup" className="text-brand-300 underline underline-offset-4">Create an account</Link>
        </p>
      </div>
    </main>
  );
}