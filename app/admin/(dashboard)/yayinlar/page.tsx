'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Check,
  Minus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  PUBLICATION_TUR_LABELS,
  type AdminPublication,
  type PublicationTur,
} from '@/lib/admin-types';
import { useToast } from '@/components/admin/ToastProvider';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import {
  PublicationModal,
  type PublicationFormValues,
} from '@/components/admin/PublicationModal';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 20;

const filters: { value: 'tumu' | PublicationTur; label: string }[] = [
  { value: 'tumu', label: 'Tümü' },
  { value: 'makale', label: 'Makale' },
  { value: 'bildiri', label: 'Bildiri' },
  { value: 'kitap', label: 'Kitap' },
];

const turBadge: Record<PublicationTur, string> = {
  makale: 'bg-sky-500/15 text-sky-300',
  bildiri: 'bg-violet-500/15 text-violet-300',
  kitap: 'bg-amber-500/15 text-amber-300',
};

export default function YayinlarPage() {
  const { toast } = useToast();

  const [items, setItems] = useState<AdminPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'tumu' | PublicationTur>(
    'tumu',
  );
  const [page, setPage] = useState(1);

  // Modal durumu
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPublication | null>(null);
  const [saving, setSaving] = useState(false);

  // Silme durumu
  const [deleteTarget, setDeleteTarget] = useState<AdminPublication | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFilter !== 'tumu') params.set('tur', activeFilter);
      if (search.trim()) params.set('q', search.trim());
      const res = await fetch(`/api/admin/publications?${params.toString()}`);
      if (!res.ok) throw new Error();
      const data: AdminPublication[] = await res.json();
      setItems(data);
    } catch {
      toast('Yayınlar yüklenemedi', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search, toast]);

  // Filtre/arama değişince yeniden yükle (arama debounce'lu).
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load();
    }, 300);
    return () => clearTimeout(t);
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [items, page],
  );

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(p: AdminPublication) {
    setEditing(p);
    setModalOpen(true);
  }

  async function handleSubmit(values: PublicationFormValues) {
    setSaving(true);
    try {
      const url = editing
        ? `/api/admin/publications/${editing.id}`
        : '/api/admin/publications';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast(editing ? 'Yayın güncellendi' : 'Yayın eklendi');
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
      const res = await fetch(`/api/admin/publications/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast('Yayın silindi');
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
          <h1 className="text-2xl font-bold text-white">Yayın Yönetimi</h1>
          <p className="mt-1 text-sm text-white/50">
            Toplam {items.length} yayın
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-ice px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Yeni Yayın Ekle
        </button>
      </header>

      {/* Arama + filtre */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Başlık veya yazara göre ara..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-primary-light focus:bg-white/10"
          />
        </div>
        <div className="flex gap-1.5 rounded-lg border border-white/10 bg-white/5 p-1">
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
      </div>

      {/* Tablo */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-white/50">
            <Loader2 className="h-5 w-5 animate-spin" /> Yükleniyor...
          </div>
        ) : pageItems.length === 0 ? (
          <p className="p-12 text-center text-sm text-white/40">
            Kayıt bulunamadı.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Başlık</th>
                  <th className="px-4 py-3 font-medium">Yazarlar</th>
                  <th className="px-4 py-3 font-medium">Yıl</th>
                  <th className="px-4 py-3 font-medium">Tür</th>
                  <th className="px-4 py-3 font-medium">DOI</th>
                  <th className="px-4 py-3 text-right font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="max-w-[260px] px-4 py-3">
                      <span className="line-clamp-2 text-white/85">
                        {p.baslik}
                      </span>
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3 text-white/55">
                      {p.yazarlar}
                    </td>
                    <td className="px-4 py-3 text-white/60">{p.yil}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${turBadge[p.tur]}`}
                      >
                        {PUBLICATION_TUR_LABELS[p.tur]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.doiUrl ? (
                        <a
                          href={p.doiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                        >
                          <Check className="h-4 w-4" />
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <Minus className="h-4 w-4 text-white/25" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          aria-label="Düzenle"
                          className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          aria-label="Sil"
                          className="rounded-lg p-2 text-red-300/70 transition-colors hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sayfalama */}
      {!loading && items.length > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/40">
            Sayfa {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Önceki
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 disabled:opacity-40"
            >
              Sonraki <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <PublicationModal
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
        title="Yayını Sil"
        message={`"${deleteTarget?.baslik ?? ''}" başlıklı yayını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
