// src/components/BottomNav.jsx
import React from 'react';
import {
  IconWallet,
  IconChartHistogram,
  IconReceipt,
  IconSparkles,
} from '@tabler/icons-react';

const TABS = [
  { id: 'dashboard', label: 'Златник', icon: IconWallet },
  { id: 'analytics', label: 'Аналитика', icon: IconChartHistogram },
  { id: 'history', label: 'История', icon: IconReceipt },
  { id: 'assistant', label: 'Ассистент', icon: IconSparkles },
];

export function BottomNav({ currentPage, onPageChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 pb-safe">
      <div className="max-w-md mx-auto flex justify-around items-center py-2">
        {TABS.map((tab) => {
          const isActive = currentPage === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onPageChange(tab.id)}
              className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition"
            >
              <Icon
                size={22}
                stroke={1.5}
                className={`transition ${
                  isActive
                    ? 'text-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]'
                    : 'text-neutral-400'
                }`}
              />
              <span
                className={`text-[10px] transition ${
                  isActive ? 'text-black font-medium' : 'text-neutral-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}