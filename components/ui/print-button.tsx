'use client';

import * as React from 'react';
import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="px-5 py-2.5 rounded-xl bg-primary-950 text-white font-bold text-sm shadow-sm hover:bg-black cursor-pointer inline-flex items-center gap-2"
    >
      <Printer className="w-4 h-4" />
      <span>Imprimer ou Enregistrer en PDF (Ctrl+P)</span>
    </button>
  );
}
