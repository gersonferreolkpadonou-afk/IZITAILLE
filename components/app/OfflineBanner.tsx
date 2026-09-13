'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { synchroniserFileAttente, getNombreMutationsEnAttente } from '@/lib/db/sync';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const checkPending = async () => {
      const count = await getNombreMutationsEnAttente();
      setPendingCount(count);
    };

    checkPending();

    const handleOnline = async () => {
      setIsOnline(true);
      setIsSyncing(true);
      await synchroniserFileAttente();
      await checkPending();
      setIsSyncing(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !isSyncing && pendingCount === 0) {
    return null;
  }

  if (!isOnline) {
    return (
      <div className="bg-primary-950 text-terracotta-300 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 border-b border-primary-900 shadow-sm animate-in fade-in">
        <WifiOff className="w-4 h-4 text-terracotta-400 shrink-0" />
        <span>
          Mode hors ligne actif • Tes créations sont enregistrées sur ton téléphone et
          se synchroniseront dès le retour du réseau.
        </span>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="bg-jauge-vert-bg text-jauge-vert px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 border-b border-jauge-vert/30 shadow-sm animate-in fade-in">
        <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
        <span>Connexion rétablie • Synchronisation de tes données en cours...</span>
      </div>
    );
  }

  return null;
}
