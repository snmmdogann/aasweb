'use client';

import { useState } from 'react';
import { HamburgerButton } from './HamburgerButton';
import { OffCanvasMenu } from './OffCanvasMenu';

/**
 * Hamburger düğmesi ile off-canvas menünün açık/kapalı durumunu yöneten sarmalayıcı.
 * Kök layout'ta render edilir.
 */
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <HamburgerButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
      <OffCanvasMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
