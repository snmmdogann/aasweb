import { PageTransition } from '@/components/layout/PageTransition';

// template.tsx, layout'tan farklı olarak her gezinmede yeniden mount edilir;
// bu yüzden sayfa geçiş animasyonu için ideal yerdir.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
