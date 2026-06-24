'use client';

import { useState } from 'react';
import { HamburgerButton } from './HamburgerButton';
import { OffCanvasMenu } from './OffCanvasMenu';
import { Header } from './Header';

/**
 * Hamburger düğmesi ile off-canvas menünün açık/kapalı durumunu yöneten sarmalayıcı.
 * Ayrıca masaüstü için Header (Üst Menü Çubuğu) bileşenini de içerir.
 * Kök layout'ta render edilir.
 */
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Header />
      <HamburgerButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
      <OffCanvasMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
