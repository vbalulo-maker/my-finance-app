// src/pages/AssistantPage.jsx
import React from 'react';
import { IconSparkles } from '@tabler/icons-react';

export function AssistantPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
        <IconSparkles size={28} className="text-white" stroke={1.5} />
      </div>

      <h2 className="text-lg font-semibold text-black mb-2">
        AI-ассистент
      </h2>

      <p className="text-sm text-neutral-500 mb-6 max-w-xs">
        Скоро здесь появится умный помощник. Он будет анализировать ваши
        финансы, отвечать на вопросы и давать персональные советы.
      </p>

      <div className="w-full max-w-xs space-y-2">
        <div className="rounded-2xl border border-dashed border-neutral-200 px-4 py-3 text-left">
          <p className="text-xs font-medium text-neutral-400 mb-0.5">Будет доступно</p>
          <p className="text-sm text-neutral-600">💬 Чат по вашим финансам</p>
        </div>
        <div className="rounded-2xl border border-dashed border-neutral-200 px-4 py-3 text-left">
          <p className="text-xs font-medium text-neutral-400 mb-0.5">Будет доступно</p>
          <p className="text-sm text-neutral-600">📊 Метрики CFO: Runway, Savings Rate</p>
        </div>
        <div className="rounded-2xl border border-dashed border-neutral-200 px-4 py-3 text-left">
          <p className="text-xs font-medium text-neutral-400 mb-0.5">Будет доступно</p>
          <p className="text-sm text-neutral-600">💡 Персональные рекомендации</p>
        </div>
      </div>
    </div>
  );
}