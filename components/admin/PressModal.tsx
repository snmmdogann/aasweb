'use client';

import { useEffect, useRef, useState, type DragEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X, Upload, Image as ImageIcon, Newspaper } from 'lucide-react';
import type { AdminPressItem, PressTur } from '@/lib/admin-types';
import { useToast } from '@/components/admin/ToastProvider';
import { cn } from '@/lib/utils';

export interface PressFormValues {
  tur: PressTur;
  baslik: string;
  aciklama: string;
  imageUrl: string;
  haberUrl: string;
}

interface PressModalProps {
  open: boolean;
  initial?: AdminPressItem | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: PressFormValues) => void;
}

const empty: PressFormValues = {
  tur: 'medya',
  baslik: '',
  aciklama: '',
  imageUrl: '',
  haberUrl: '',
};

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-primary-light focus:bg-white/10';

export function PressModal({
  open,
  initial,
  saving,
  onClose,
  onSubmit,
}: PressModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<PressFormValues>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(
        initial
          ? {
              tur: initial.tur,
              baslik: initial.baslik ?? '',
              aciklama: initial.aciklama ?? '',
              imageUrl: initial.imageUrl ?? '',
              haberUrl: initial.haberUrl ?? '',
            }
          : empty,
      );
    }
  }, [open, initial]);

  async function uploadFile(file: File) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast('Yalnızca JPG, PNG veya WEBP yükleyebilirsiniz', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast('Dosya boyutu 10MB sınırını aşıyor', 'error');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error();
      const data: { url: string } = await res.json();
      setForm((f) => ({ ...f, imageUrl: data.url }));
      toast('Görsel yüklendi');
    } catch {
      toast('Yükleme başarısız', 'error');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (form.tur === 'haber') {
      if (!form.baslik.trim()) e.baslik = 'Haber başlığı zorunludur';
      if (!form.haberUrl.trim()) e.haberUrl = 'Haber URL’i zorunludur';
    } else {
      if (!form.imageUrl.trim()) e.imageUrl = 'Lütfen bir görsel yükleyin';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit(form);
  }

  const isHaber = form.tur === 'haber';

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
                {initial ? 'Öğeyi Düzenle' : 'Yeni Öğe Ekle'}
              </h3>
              <button
                onClick={onClose}
                aria-label="Kapat"
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tür seçimi (toggle) */}
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, tur: 'medya' }))}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors',
                  !isHaber
                    ? 'bg-white/15 text-white'
                    : 'text-white/50 hover:text-white',
                )}
              >
                <ImageIcon className="h-4 w-4" /> Medya Görseli
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, tur: 'haber' }))}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors',
                  isHaber
                    ? 'bg-white/15 text-white'
                    : 'text-white/50 hover:text-white',
                )}
              >
                <Newspaper className="h-4 w-4" /> Haber
              </button>
            </div>

            <div className="space-y-4">
              {/* Başlık */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Başlık{' '}
                  {!isHaber && (
                    <span className="text-white/30">(opsiyonel)</span>
                  )}
                </label>
                <input
                  value={form.baslik}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, baslik: e.target.value }))
                  }
                  className={inputClass}
                  placeholder={isHaber ? 'Haber başlığı' : 'Görsel başlığı'}
                />
                {errors.baslik && (
                  <p className="mt-1 text-xs text-red-400">{errors.baslik}</p>
                )}
              </div>

              {isHaber ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Haber URL’i
                    </label>
                    <input
                      value={form.haberUrl}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, haberUrl: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="https://haber-sitesi.com/..."
                    />
                    {errors.haberUrl && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.haberUrl}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-white/70">
                      Kapak Görseli URL’i{' '}
                      <span className="text-white/30">(opsiyonel)</span>
                    </label>
                    <input
                      value={form.imageUrl}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, imageUrl: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="https://... veya aşağıdan dosya yükleyin"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Açıklama <span className="text-white/30">(opsiyonel)</span>
                  </label>
                  <textarea
                    value={form.aciklama}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, aciklama: e.target.value }))
                    }
                    rows={2}
                    className={inputClass}
                  />
                </div>
              )}

              {/* Görsel yükleme alanı */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  {isHaber ? 'Kapak Görseli Yükle' : 'Görsel'}
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors',
                    dragOver
                      ? 'border-primary-light bg-primary/10'
                      : 'border-white/15 bg-white/[0.02] hover:border-white/30',
                  )}
                >
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-white/60" />
                  ) : form.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.imageUrl}
                      alt="Önizleme"
                      className="max-h-40 rounded-lg object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-white/40" />
                      <p className="text-sm text-white/50">
                        Sürükleyip bırakın veya{' '}
                        <span className="text-primary-light">seçin</span>
                      </p>
                      <p className="text-xs text-white/30">
                        JPG, PNG, WEBP · maks. 10MB
                      </p>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadFile(file);
                      e.target.value = '';
                    }}
                  />
                </div>
                {errors.imageUrl && (
                  <p className="mt-1 text-xs text-red-400">{errors.imageUrl}</p>
                )}
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
                disabled={saving || uploading}
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
