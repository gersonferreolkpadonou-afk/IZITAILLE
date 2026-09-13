'use client';

import * as React from 'react';
import { useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Calendar, Sparkles } from 'lucide-react';

export function CapacityGaugeShowcase() {
  const [selectedScenario, setSelectedScenario] = useState<'vert' | 'orange' | 'rouge'>('vert');

  const scenarios = {
    vert: {
      date: '14 Mars (Dans 10 jours)',
      titre: 'Tu peux tenir le 14 mars.',
      charge: '45%',
      couleurBg: 'bg-jauge-vert-bg',
      couleurBorder: 'border-jauge-vert',
      couleurText: 'text-jauge-vert',
      couleurBarre: 'bg-jauge-vert',
      icon: CheckCircle2,
      explication:
        'Ton atelier a 4 confections prévues pour une capacité de 10 unités. Tu peux accepter ce pagne en toute sérénité.',
      badge: 'VERT • Capacité disponible',
    },
    orange: {
      date: '18 Mars (Veille de fête)',
      titre: "C'est très juste, 95 % de ta capacité.",
      charge: '95%',
      couleurBg: 'bg-jauge-orange-bg',
      couleurBorder: 'border-jauge-orange',
      couleurText: 'text-jauge-orange',
      couleurBarre: 'bg-jauge-orange',
      icon: AlertTriangle,
      explication:
        'Tu es quasiment plein. Si un fil manque, une coupure d’électricité survient ou un couturier tombe malade, tu seras en retard.',
      badge: 'ORANGE • Tension maximale',
    },
    rouge: {
      date: '12 Mars (Demande express)',
      titre: 'Impossible. Première date réaliste : le 22 mars.',
      charge: '140%',
      couleurBg: 'bg-jauge-rouge-bg',
      couleurBorder: 'border-jauge-rouge',
      couleurText: 'text-jauge-rouge',
      couleurBarre: 'bg-jauge-rouge',
      icon: AlertOctagon,
      explication:
        'Tu as déjà 18 boubous engagés. Dire oui ici, c’est mentir au client et finir au poste de police le jour de la fête. Propose le 22 mars.',
      badge: 'ROUGE • Surcharge critique',
    },
  };

  const current = scenarios[selectedScenario];
  const IconComponent = current.icon;

  return (
    <div className="rounded-3xl bg-primary-950 p-6 sm:p-10 text-white shadow-2xl border border-primary-800">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-xs uppercase font-extrabold tracking-widest text-terracotta-400 block mb-2">
          Le coeur d&apos;IZITAILLE
        </span>
        <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          La jauge qui te dit la vérité avant d&apos;accepter un pagne.
        </h3>
        <p className="mt-2 text-sm sm:text-base text-coton-300">
          Clique sur une date promise pour voir la jauge réagir instantanément :
        </p>

        {/* Boutons sélecteurs de scénario */}
        <div className="mt-6 grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-primary-900 border border-primary-800">
          <button
            type="button"
            onClick={() => setSelectedScenario('vert')}
            className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedScenario === 'vert'
                ? 'bg-jauge-vert text-white shadow-md'
                : 'text-coton-400 hover:text-white'
            }`}
          >
            14 Mars (Vert)
          </button>
          <button
            type="button"
            onClick={() => setSelectedScenario('orange')}
            className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedScenario === 'orange'
                ? 'bg-jauge-orange text-white shadow-md'
                : 'text-coton-400 hover:text-white'
            }`}
          >
            18 Mars (Orange)
          </button>
          <button
            type="button"
            onClick={() => setSelectedScenario('rouge')}
            className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedScenario === 'rouge'
                ? 'bg-jauge-rouge text-white shadow-md'
                : 'text-coton-400 hover:text-white'
            }`}
          >
            12 Mars (Rouge)
          </button>
        </div>

        {/* Carte de simulation dynamique */}
        <div
          className={`mt-6 p-6 rounded-2xl border-2 text-left transition-all duration-300 ${current.couleurBg} ${current.couleurBorder}`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-black/10">
            <div className="flex items-center gap-2">
              <Calendar className={`w-5 h-5 ${current.couleurText}`} />
              <span className="text-xs font-bold text-coton-900">
                Date promise demandée : <strong>{current.date}</strong>
              </span>
            </div>
            <span
              className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${current.couleurText} bg-white shadow-xs`}
            >
              {current.badge}
            </span>
          </div>

          <div className="mt-4 flex items-start gap-3.5">
            <IconComponent className={`w-8 h-8 shrink-0 ${current.couleurText} mt-0.5`} />
            <div className="flex-1">
              <h4 className={`text-lg sm:text-xl font-extrabold ${current.couleurText}`}>
                {current.titre}
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-coton-800 leading-relaxed font-medium">
                {current.explication}
              </p>
            </div>
          </div>

          {/* Barre de progression visuelle */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs font-extrabold text-coton-900">
              <span>Niveau d&apos;engagement</span>
              <span className={current.couleurText}>{current.charge}</span>
            </div>
            <div className="w-full h-3.5 bg-black/10 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${current.couleurBarre}`}
                style={{ width: `${Math.min(parseInt(current.charge, 10), 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
