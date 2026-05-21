import Link from 'next/link';
import { AuthForm } from '../../components/auth-form';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <AuthForm mode="signup" />
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link href="/login" className="text-brand-300 underline underline-offset-4">Sign in</Link>
        </p>
      </div>
    </main>
  );
}