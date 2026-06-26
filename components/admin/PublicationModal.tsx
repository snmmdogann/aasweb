'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import type { AdminPublication, PublicationTur } from '@/lib/admin-types';

export interface PublicationFormValues {
  baslik: string;
  yazarlar: string;
  dergiVeyaKonferans: string;
  yil: number;
  tur: PublicationTur;
  doiUrl: string;
}

interface PublicationModalProps {
  open: boolean;
  initial?: AdminPublication | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: PublicationFormValues) => void;
}

const emptyForm: PublicationFormValues = {
  baslik: '',
  yazarlar: '',
  dergiVeyaKonferans: '',
  yil: new Date().getFullYear(),
  tur: 'makale',
  doiUrl: '',
};

// Türe göre "dergiVeyaKonferans" alanının etiketi değişir.
const kaynakLabel: Record<PublicationTur, string | null> = {
  makale: 'Dergi / Konferans Adı',
  bildiri: 'Konferans Adı ve Yeri',
  kitap: 'Yayınevi / Yayıncı',
};

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-primary-light focus:bg-white/10';

export function PublicationModal({
  open,
  initial,
  saving,
  onClose,
  onSubmit,
}: PublicationModalProps) {
  const [form, setForm] = useState<PublicationFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(
        initial
          ? {
              baslik: initial.baslik,
              yazarlar: initial.yazarlar,
              dergiVeyaKonferans: initial.dergiVeyaKonferans,
              yil: initial.yil,
              tur: initial.tur,
              doiUrl: initial.doiUrl ?? '',
            }
          : emptyForm,
      );
    }
  }, [open, initial]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.baslik.trim()) e.baslik = 'Başlık zorunludur';
    if (!form.yazarlar.trim()) e.yazarlar = 'Yazarlar zorunludur';
    if (!form.yil || form.yil < 1900 || form.yil > 2100)
      e.yil = 'Geçerli bir yıl girin';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0f1730] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {initial ? 'Yayını Düzenle' : 'Yeni Yayın Ekle'}
              </h3>
              <button
                onClick={onClose}
                aria-label="Kapat"
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tür */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Tür
                </label>
                <select
                  value={form.tur}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      tur: e.target.value as PublicationTur,
                    }))
                  }
                  className={`${inputClass} [color-scheme:dark]`}
                >
                  <option value="makale" className="bg-[#0f1730] text-white">
                    Makale
                  </option>
                  <option value="bildiri" className="bg-[#0f1730] text-white">
                    Bildiri
                  </option>
                  <option value="kitap" className="bg-[#0f1730] text-white">
                    Kitap
                  </option>
                </select>
              </div>

              {/* Başlık */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Başlık
                </label>
                <textarea
                  value={form.baslik}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, baslik: e.target.value }))
                  }
                  rows={3}
                  className={inputClass}
                  placeholder="Yayın başlığı"
                />
                {errors.baslik && (
                  <p className="mt-1 text-xs text-red-400">{errors.baslik}</p>
                )}
              </div>

              {/* Yazarlar */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Yazarlar
                </label>
                <input
                  value={form.yazarlar}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, yazarlar: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="SÜZEN A. A., ..."
                />
                {errors.yazarlar && (
                  <p className="mt-1 text-xs text-red-400">{errors.yazarlar}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Yıl */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Yıl
                  </label>
                  <input
                    type="number"
                    value={form.yil}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        yil: Number(e.target.value),
                      }))
                    }
                    className={inputClass}
                  />
                  {errors.yil && (
                    <p className="mt-1 text-xs text-red-400">{errors.yil}</p>
                  )}
                </div>
              </div>

              {/* Türe özel kaynak alanı */}
              {kaynakLabel[form.tur] && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    {kaynakLabel[form.tur]}
                  </label>
                  <input
                    value={form.dergiVeyaKonferans}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        dergiVeyaKonferans: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
              )}

              {/* DOI / Erişim linki (opsiyonel) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  DOI veya Erişim Linki{' '}
                  <span className="text-white/30">(opsiyonel)</span>
                </label>
                <input
                  value={form.doiUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, doiUrl: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="https://doi.org/..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-ice px-5 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Kaydet
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
