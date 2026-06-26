'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Save, X, Trash2, Mail } from 'lucide-react';
import { useToast } from '@/components/admin/ToastProvider';
import { CollapsibleCard } from '@/components/admin/CollapsibleCard';
import {
  getTrainingIcon,
  TRAINING_ICON_NAMES,
  TRAINING_ICON_LABELS,
} from '@/lib/training-icons';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}
interface Training {
  slug: string;
  baslik: string;
  aciklama: string;
  icon: string;
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 outline-none transition-colors focus:border-primary-light focus:bg-white/10';

const labelClass = 'mb-1.5 block text-sm font-medium text-white/70';

// Eğitim için benzersiz, URL dostu bir slug üretir (link ve React key olarak kullanılır).
function makeSlug(): string {
  return `egitim-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

// Seçili eğitim ikonunun canlı önizlemesi (sitedeki görünümle aynı ikon).
function IconPreview({ name }: { name: string }) {
  const Icon = getTrainingIcon(name);
  return <Icon className="h-5 w-5" aria-hidden="true" />;
}

function safeParse<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export default function SiteIcerigiPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [bio, setBio] = useState<string[]>(['', '', '']);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [stats, setStats] = useState<Stat[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [contactEmail, setContactEmail] = useState('');

  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/site-content');
        if (!res.ok) throw new Error();
        const data: Record<string, string> = await res.json();
        const parsedBio = safeParse<string[]>(data['about.bio'], ['', '', '']);
        setBio([0, 1, 2].map((i) => parsedBio[i] ?? ''));
        setExpertise(safeParse<string[]>(data['about.expertise'], []));
        setStats(safeParse<Stat[]>(data['stats'], []));
        setTrainings(safeParse<Training[]>(data['trainings'], []));
        setContactEmail(data['contact.email'] ?? '');
      } catch {
        toast('İçerik yüklenemedi', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  async function save(id: string, value: unknown, label: string) {
    setSavingKey(id);
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value: JSON.stringify(value) }),
      });
      if (!res.ok) throw new Error();
      toast(`${label} kaydedildi`);
    } catch {
      toast('Kaydetme başarısız', 'error');
    } finally {
      setSavingKey(null);
    }
  }

  // contact.email gibi düz metin (JSON olmayan) değerleri kaydeder.
  async function saveRaw(id: string, value: string, label: string) {
    setSavingKey(id);
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value }),
      });
      if (!res.ok) throw new Error();
      toast(`${label} kaydedildi`);
    } catch {
      toast('Kaydetme başarısız', 'error');
    } finally {
      setSavingKey(null);
    }
  }

  function addTag() {
    const t = newTag.trim();
    if (t && !expertise.includes(t)) {
      setExpertise((prev) => [...prev, t]);
      setNewTag('');
    }
  }

  function addTraining() {
    setTrainings((prev) => [
      ...prev,
      { slug: makeSlug(), baslik: '', aciklama: '', icon: TRAINING_ICON_NAMES[0] },
    ]);
  }

  function removeTraining(index: number) {
    setTrainings((prev) => prev.filter((_, idx) => idx !== index));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-12 text-white/50">
        <Loader2 className="h-5 w-5 animate-spin" /> Yükleniyor...
      </div>
    );
  }

  const SaveButton = ({
    onClick,
    busy,
  }: {
    onClick: () => void;
    busy: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-ice px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      Değişiklikleri Kaydet
    </button>
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Site İçeriği</h1>
        <p className="mt-1 text-sm text-white/50">
          Hakkında, istatistik, eğitim ve iletişim bilgilerini düzenleyin.
        </p>
      </header>

      {/* Hakkında */}
      <CollapsibleCard
        title="Hakkında"
        description="Biyografi paragrafları ve uzmanlık alanları"
        defaultOpen
      >
        <div className="space-y-5">
          <div className="space-y-3">
            {bio.map((p, i) => (
              <div key={i}>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Biyografi Paragrafı {i + 1}
                </label>
                <textarea
                  value={p}
                  onChange={(e) =>
                    setBio((prev) =>
                      prev.map((v, idx) => (idx === i ? e.target.value : v)),
                    )
                  }
                  rows={3}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">
              Uzmanlık Alanları
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {expertise.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-1 pl-3 pr-1.5 text-sm text-white/80"
                >
                  {tag}
                  <button
                    onClick={() =>
                      setExpertise((prev) => prev.filter((t) => t !== tag))
                    }
                    aria-label={`${tag} etiketini kaldır`}
                    className="rounded-full p-0.5 text-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
              {expertise.length === 0 && (
                <span className="text-sm text-white/30">Henüz alan yok.</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Yeni alan ekle ve Enter'a basın"
                className={inputClass}
              />
              <button
                onClick={addTag}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 px-3 text-sm text-white/80 hover:bg-white/5"
              >
                <Plus className="h-4 w-4" /> Ekle
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <SaveButton
              busy={savingKey === 'about'}
              onClick={async () => {
                setSavingKey('about');
                try {
                  await Promise.all([
                    fetch('/api/admin/site-content', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: 'about.bio',
                        value: JSON.stringify(bio),
                      }),
                    }),
                    fetch('/api/admin/site-content', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: 'about.expertise',
                        value: JSON.stringify(expertise),
                      }),
                    }),
                  ]);
                  toast('Hakkında bölümü kaydedildi');
                } catch {
                  toast('Kaydetme başarısız', 'error');
                } finally {
                  setSavingKey(null);
                }
              }}
            />
          </div>
        </div>
      </CollapsibleCard>

      {/* İstatistikler */}
      <CollapsibleCard
        title="İstatistikler"
        description="Ana sayfadaki sayaç kartları"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={i}
                className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={s.value}
                    onChange={(e) =>
                      setStats((prev) =>
                        prev.map((v, idx) =>
                          idx === i
                            ? { ...v, value: Number(e.target.value) }
                            : v,
                        ),
                      )
                    }
                    className={inputClass}
                    placeholder="Değer"
                  />
                  <input
                    value={s.suffix}
                    onChange={(e) =>
                      setStats((prev) =>
                        prev.map((v, idx) =>
                          idx === i ? { ...v, suffix: e.target.value } : v,
                        ),
                      )
                    }
                    className={`${inputClass} w-16`}
                    placeholder="+"
                  />
                </div>
                <input
                  value={s.label}
                  onChange={(e) =>
                    setStats((prev) =>
                      prev.map((v, idx) =>
                        idx === i ? { ...v, label: e.target.value } : v,
                      ),
                    )
                  }
                  className={inputClass}
                  placeholder="Etiket"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <SaveButton
              busy={savingKey === 'stats'}
              onClick={() => save('stats', stats, 'İstatistikler')}
            />
          </div>
        </div>
      </CollapsibleCard>

      {/* Eğitimler */}
      <CollapsibleCard
        title="Eğitimler"
        description="Ana sayfadaki “Kurumsal Eğitimler” kartları — ekleyin, düzenleyin veya silin"
      >
        <div className="space-y-4">
          <div className="space-y-4">
            {trainings.map((t, i) => (
              <div
                key={t.slug || i}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary-light">
                      <IconPreview name={t.icon} />
                    </span>
                    {i + 1}. Eğitim
                  </span>
                  <button
                    onClick={() => removeTraining(i)}
                    aria-label="Eğitimi sil"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-300/80 transition-colors hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Sil
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_240px]">
                  <div>
                    <label className={labelClass}>Başlık</label>
                    <input
                      value={t.baslik}
                      onChange={(e) =>
                        setTrainings((prev) =>
                          prev.map((v, idx) =>
                            idx === i ? { ...v, baslik: e.target.value } : v,
                          ),
                        )
                      }
                      className={inputClass}
                      placeholder="Örn. Etik Hackerlık ve Sızma Testi"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>İkon</label>
                    <select
                      value={
                        TRAINING_ICON_NAMES.includes(t.icon)
                          ? t.icon
                          : TRAINING_ICON_NAMES[0]
                      }
                      onChange={(e) =>
                        setTrainings((prev) =>
                          prev.map((v, idx) =>
                            idx === i ? { ...v, icon: e.target.value } : v,
                          ),
                        )
                      }
                      className={`${inputClass} [color-scheme:dark]`}
                      aria-label="İkon seç"
                    >
                      {TRAINING_ICON_NAMES.map((name) => (
                        <option
                          key={name}
                          value={name}
                          className="bg-[#0f1730] text-white"
                        >
                          {TRAINING_ICON_LABELS[name] ?? name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Açıklama</label>
                    <textarea
                      value={t.aciklama}
                      onChange={(e) =>
                        setTrainings((prev) =>
                          prev.map((v, idx) =>
                            idx === i ? { ...v, aciklama: e.target.value } : v,
                          ),
                        )
                      }
                      rows={2}
                      className={inputClass}
                      placeholder="Eğitimin kısa açıklaması"
                    />
                  </div>
                </div>
              </div>
            ))}
            {trainings.length === 0 && (
              <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/30">
                Henüz eğitim yok. Aşağıdan yeni bir eğitim ekleyebilirsiniz.
              </p>
            )}
          </div>

          {/* Ekle + Kaydet */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={addTraining}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Yeni Eğitim Ekle
            </button>
            <SaveButton
              busy={savingKey === 'trainings'}
              onClick={() => save('trainings', trainings, 'Eğitimler')}
            />
          </div>
          <p className="text-xs text-white/30">
            Not: Eklediğiniz veya sildiğiniz eğitimler, “Değişiklikleri Kaydet”e
            bastıktan sonra ana sayfada görünür.
          </p>
        </div>
      </CollapsibleCard>

      {/* İletişim */}
      <CollapsibleCard
        title="İletişim"
        description="İletişim sayfasında görünen e-posta adresi"
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>E-posta Adresi</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={`${inputClass} pl-10`}
                placeholder="ornek@isparta.edu.tr"
              />
            </div>
            <p className="mt-1.5 text-xs text-white/30">
              İletişim sayfasında bu adres gösterilir ve tıklanınca alıcı olarak
              kullanılır.
            </p>
          </div>
          <div className="flex justify-end">
            <SaveButton
              busy={savingKey === 'contact.email'}
              onClick={() =>
                saveRaw('contact.email', contactEmail.trim(), 'E-posta adresi')
              }
            />
          </div>
        </div>
      </CollapsibleCard>
    </div>
  );
}
