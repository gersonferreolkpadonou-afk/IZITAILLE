'use client';

import * as React from 'react';
import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA Service Worker enregistré:', reg.scope))
        .catch((err) => console.warn('Échec enregistrement Service Worker:', err));
    }
  }, []);

  return null;
}
