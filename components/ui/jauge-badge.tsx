import * as React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from './button';

export interface JaugeBadgeProps {
  pourcentage: number;
  dateEstimee?: string;
  className?: string;
}

export function JaugeBadge({
  pourcentage,
  dateEstimee,
  className,
}: JaugeBadgeProps) {
  if (pourcentage < 80) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3.5 py-2 rounded-xl bg-jauge-vert-bg border border-jauge-vert/30 text-jauge-vert font-semibold text-sm',
          className
        )}
      >
        <CheckCircle2 className="w-5 h-5 shrink-0 text-jauge-vert" />
        <div>
          <span>Tu peux tenir cette date.</span>
          <span className="text-xs opacity-80 block font-normal">
            Charge estimée : {pourcentage}% de la capacité
          </span>
        </div>
      </div>
    );
  }

  if (pourcentage <= 100) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3.5 py-2 rounded-xl bg-jauge-orange-bg border border-jauge-orange/30 text-jauge-orange font-semibold text-sm',
          className
        )}
      >
        <AlertTriangle className="w-5 h-5 shrink-0 text-jauge-orange" />
        <div>
          <span>C&apos;est très juste ({pourcentage}% de charge).</span>
          <span className="text-xs opacity-80 block font-normal">
            Atelier quasiment plein d&apos;ici cette date.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-jauge-rouge-bg border border-jauge-rouge/30 text-jauge-rouge font-semibold text-sm',
        className
      )}
    >
      <AlertOctagon className="w-5 h-5 shrink-0 text-jauge-rouge mt-0.5" />
      <div>
        <span className="block font-bold">Impossible. Surcharge détectée ({pourcentage}%).</span>
        <span className="text-xs opacity-90 block font-normal mt-0.5">
          {dateEstimee
            ? `Première date réaliste : ${dateEstimee}`
            : 'Trop de commandes engagées. Choisis une date ultérieure.'}
        </span>
      </div>
    </div>
  );
}
