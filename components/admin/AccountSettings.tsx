'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, User, Lock, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/admin/ToastProvider';

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-white placeholder-white/30 outline-none transition-colors focus:border-primary-light focus:bg-white/10';
const labelClass = 'mb-1.5 block text-sm font-medium text-white/70';

/**
 * Yönetici giriş bilgilerini (kullanıcı adı + şifre) güncelleme formu.
 * Mevcut şifre doğrulanmadan değişiklik yapılamaz. Mobil uyumlu (tek sütun).
 */
export function AccountSettings() {
  const { toast } = useToast();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Mevcut kullanıcı adını çekip alanı ön-doldur.
  useEffect(() => {
    fetch('/api/admin/credentials')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.username) setNewUsername(d.username);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor');
      return;
    }
    if (newPassword.length < 4) {
      setError('Yeni şifre en az 4 karakter olmalı');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newUsername, newPassword }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        toast('Giriş bilgileri güncellendi. Bir sonraki girişte yeni bilgileri kullanın.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        router.refresh();
      } else {
        setError(data?.error ?? 'Güncelleme başarısız');
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary-light">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-white">
            Yönetici Giriş Bilgileri
          </h2>
          <p className="text-xs text-white/40">
            Kullanıcı adı ve şifrenizi buradan güncelleyebilirsiniz.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mevcut şifre */}
        <div>
          <label className={labelClass} htmlFor="cur-pw">
            Mevcut Şifre
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="cur-pw"
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="Mevcut şifreniz"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? 'Şifreyi gizle' : 'Şifreyi göster'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/40 hover:text-white"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Yeni kullanıcı adı */}
          <div>
            <label className={labelClass} htmlFor="new-user">
              Yeni Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                id="new-user"
                type="text"
                autoComplete="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                className={inputClass}
                placeholder="Kullanıcı adı"
              />
            </div>
          </div>

          {/* Yeni şifre */}
          <div>
            <label className={labelClass} htmlFor="new-pw">
              Yeni Şifre
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                id="new-pw"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={inputClass}
                placeholder="En az 4 karakter"
              />
            </div>
          </div>
        </div>

        {/* Yeni şifre tekrar */}
        <div>
          <label className={labelClass} htmlFor="confirm-pw">
            Yeni Şifre (Tekrar)
          </label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="confirm-pw"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="Yeni şifreyi tekrar girin"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-ice px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Bilgileri Güncelle
          </button>
        </div>
      </form>
    </section>
  );
}
