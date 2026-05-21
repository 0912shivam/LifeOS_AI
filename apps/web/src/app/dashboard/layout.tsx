'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lifeos-token');

    if (!token) {
      // No token found, redirect to login
      router.push('/login');
      return;
    }

    // Token exists, allow access
    setIsAuthed(true);
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-brand-300" />
      </div>
    );
  }

  if (!isAuthed) {
    return null;
  }

  return <>{children}</>;
}
