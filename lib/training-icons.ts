import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Lock,
  FileLock2,
  KeyRound,
  Fingerprint,
  Code2,
  Terminal,
  Binary,
  Bug,
  Network,
  Wifi,
  Server,
  Database,
  Cloud,
  Cpu,
  Globe,
  Radar,
  ScanLine,
  Eye,
  Siren,
  Search,
  BadgeCheck,
  GraduationCap,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';

/**
 * Eğitim kartlarında kullanılabilecek ikonların tek kaynağı.
 * Hem herkese açık EgitimKart bileşeni (render) hem admin paneli (seçim listesi)
 * bu kaydı kullanır; böylece listede sunulan her ikon sitede gerçekten görünür.
 */
export const TRAINING_ICON_MAP: Record<string, LucideIcon> = {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Lock,
  FileLock2,
  KeyRound,
  Fingerprint,
  Code2,
  Terminal,
  Binary,
  Bug,
  Network,
  Wifi,
  Server,
  Database,
  Cloud,
  Cpu,
  Globe,
  Radar,
  ScanLine,
  Eye,
  Siren,
  Search,
  BadgeCheck,
  GraduationCap,
  BookOpen,
};

// Açılır listede gösterilecek, anlaşılır Türkçe etiketler.
export const TRAINING_ICON_LABELS: Record<string, string> = {
  ShieldAlert: 'Kalkan (Uyarı)',
  ShieldCheck: 'Kalkan (Onaylı)',
  Shield: 'Kalkan',
  Lock: 'Kilit',
  FileLock2: 'Kilitli Dosya',
  KeyRound: 'Anahtar',
  Fingerprint: 'Parmak İzi',
  Code2: 'Kod',
  Terminal: 'Terminal',
  Binary: 'İkili Kod',
  Bug: 'Zararlı / Böcek',
  Network: 'Ağ',
  Wifi: 'Kablosuz Ağ',
  Server: 'Sunucu',
  Database: 'Veritabanı',
  Cloud: 'Bulut',
  Cpu: 'İşlemci',
  Globe: 'Küre / İnternet',
  Radar: 'Radar',
  ScanLine: 'Tarama',
  Eye: 'Gözetim',
  Siren: 'Alarm',
  Search: 'Arama / Keşif',
  BadgeCheck: 'Sertifika',
  GraduationCap: 'Akademik',
  BookOpen: 'Eğitim / Kitap',
};

export const TRAINING_ICON_NAMES = Object.keys(TRAINING_ICON_MAP);

export const DEFAULT_TRAINING_ICON = 'ShieldAlert';

/** İkon adını gerçek Lucide bileşenine çevirir; tanınmıyorsa varsayılana düşer. */
export function getTrainingIcon(name: string): LucideIcon {
  return TRAINING_ICON_MAP[name] ?? TRAINING_ICON_MAP[DEFAULT_TRAINING_ICON];
}
