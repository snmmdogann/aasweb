'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  User,
  UserCheck,
  LogOut,
  LayoutDashboard,
  Lock,
  Loader2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Navbar'daki yönetici düğmesi. Mount olunca /api/admin/session ile oturum
 * durumunu kontrol eder:
 *  - Giriş yapılmışsa: ikon vurgulanır, tıklayınca "Admin Panel" + "Çıkış Yap"
 *    dropdown'ı açılır.
 *  - Giriş yapılmamışsa: tıklayınca "Yönetici Girişi" modalı açılır.
 */
export function AdminMenu() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Giriş formu durumu
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/session')
      .then((res) => {
        if (active) setAuthed(res.ok);
      })
      .catch(() => {
        if (active) setAuthed(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Dropdown dışına tıklayınca kapat.
  useEffect(() => {
    if (!dropdownOpen) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [dropdownOpen]);

  function handleClick() {
    if (authed) {
      setDropdownOpen((o) => !o);
    } else {
      setError('');
      setModalOpen(true);
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setModalOpen(false);
        setAuthed(true);
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? 'Giriş başarısız');
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setAuthed(false);
    setDropdownOpen(false);
    router.refresh();
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={handleClick}
        aria-label={authed ? 'Yönetici menüsü' : 'Yönetici girişi'}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg border border-transparent transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:border-white/10',
          authed ? 'text-emerald-300' : 'text-white/80',
        )}
      >
        {authed ? (
          <UserCheck className="h-5 w-5" />
        ) : (
          <User className="h-5 w-5" />
        )}
      </button>

      {/* Giriş yapılmışsa dropdown */}
      <AnimatePresence>
        {authed && dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-white/10 bg-primary-dark/95 shadow-2xl backdrop-blur-md"
          >
            <Link
              href="/admin"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-white/85 transition-colors hover:bg-white/10"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Panel
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 border-t border-white/10 px-4 py-3 text-sm text-red-300 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Giriş modalı */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-start justify-center bg-black/70 p-4 pt-24 backdrop-blur-sm sm:items-center sm:pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-primary-dark/95 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Lock className="h-5 w-5 text-primary-light" />
                  Yönetici Girişi
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  aria-label="Kapat"
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-username"
                    className="mb-1.5 block text-sm font-medium text-white/70"
                  >
                    Kullanıcı Adı
                  </label>
                  <input
                    id="admin-username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-primary-light focus:bg-white/10"
                  />
                </div>
                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-1.5 block text-sm font-medium text-white/70"
                  >
                    Şifre
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-primary-light focus:bg-white/10"
                  />
                </div>

                {error && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-ice py-2.5 font-semibold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
