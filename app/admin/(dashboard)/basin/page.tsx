'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ExternalLink,
  ImageOff,
} from 'lucide-react';
import type { AdminPressItem, PressTur } from '@/lib/admin-types';
import { useToast } from '@/components/admin/ToastProvider';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { PressModal, type PressFormValues } from '@/components/admin/PressModal';
import { cn } from '@/lib/utils';

const filters: { value: 'tumu' | PressTur; label: string }[] = [
  { value: 'tumu', label: 'Tümü' },
  { value: 'medya', label: 'Medya Görseli' },
  { value: 'haber', label: 'Haber' },
];

export default function BasinPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<AdminPressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'tumu' | PressTur>('tumu');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPressItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminPressItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFilter !== 'tumu') params.set('tur', activeFilter);
      const res = await fetch(`/api/admin/press?${params.toString()}`);
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch {
      toast('Basın öğeleri yüklenemedi', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, toast]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(item: AdminPressItem) {
    setEditing(item);
    setModalOpen(true);
  }

  async function handleSubmit(values: PressFormValues) {
    setSaving(true);
    try {
      const url = editing
        ? `/api/admin/press/${editing.id}`
        : '/api/admin/press';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast(editing ? 'Öğe güncellendi' : 'Öğe eklendi');
      setModalOpen(false);
      setEditing(null);
      await load();
    } catch {
      toast('Kaydetme başarısız', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/press/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast('Öğe silindi');
      setDeleteTarget(null);
      await load();
    } catch {
      toast('Silme başarısız', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Basın & Medya</h1>
          <p className="mt-1 text-sm text-white/50">Toplam {items.length} öğe</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-ice px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Yeni Öğe Ekle
        </button>
      </header>

      {/* Tür filtresi */}
      <div className="flex gap-1.5 rounded-lg border border-white/10 bg-white/5 p-1 sm:w-fit">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeFilter === f.value
                ? 'bg-white/15 text-white'
                : 'text-white/50 hover:text-white',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 p-12 text-white/50">
          <Loader2 className="h-5 w-5 animate-spin" /> Yükleniyor...
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center text-sm text-white/40">
          Kayıt bulunamadı.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative aspect-video overflow-hidden bg-black/30">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.baslik ?? 'Basın görseli'}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/30">
                    <ImageOff className="h-8 w-8" />
                  </div>
                )}
                <span
                  className={cn(
                    'absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-semibold',
                    item.tur === 'haber'
                      ? 'bg-red-500/90 text-white'
                      : 'bg-sky-500/90 text-white',
                  )}
                >
                  {item.tur === 'haber' ? 'Haber' : 'Medya'}
                </span>
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-medium text-white/85">
                  {item.baslik || (
                    <span className="text-white/30">Başlıksız</span>
                  )}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  {item.tur === 'haber' && item.haberUrl ? (
                    <a
                      href={item.haberUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary-light hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" /> Habere git
                    </a>
                  ) : (
                    <span />
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      aria-label="Düzenle"
                      className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      aria-label="Sil"
                      className="rounded-lg p-1.5 text-red-300/70 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PressModal
        open={modalOpen}
        initial={editing}
        saving={saving}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Öğeyi Sil"
        message="Bu öğeyi silmek istediğinizden emin misiniz? Yüklenmiş görsel de kaldırılacaktır."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
