'use client';

import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/admin/ToastProvider';

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-primary-light focus:bg-white/10';
const labelClass = 'mb-1.5 block text-sm font-medium text-white/70';

/**
 * Minimal şifre değiştirme formu. Kullanıcı adı sabittir (değiştirilemez).
 * Yalnızca mevcut şifre ve yeni şifre alanları vardır; ikisi de boş gelir.
 */
export function AccountSettings() {
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        toast('Şifre güncellendi.');
        setCurrentPassword('');
        setNewPassword('');
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
    <section className="max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white">Şifre Değiştir</h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className={labelClass} htmlFor="cur-pw">
            Mevcut Şifre
          </label>
          <input
            id="cur-pw"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="new-pw">
            Yeni Şifre
          </label>
          <input
            id="new-pw"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-ice px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Şifreyi Güncelle
        </button>
      </form>
    </section>
  );
}
