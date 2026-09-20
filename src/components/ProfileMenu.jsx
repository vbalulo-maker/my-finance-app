// src/components/ProfileMenu.jsx
import React from 'react';
import {
  IconBuildingBank,
  IconTags,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';

export function ProfileMenu({
  isOpen,
  onClose,
  onOpenAccounts,
  onOpenCategories,
  onOpenData,
}) {
  if (!isOpen) return null;

  const items = [
    {
      id: 'accounts',
      label: 'Банки',
      description: 'Управление картами и счетами',
      icon: IconBuildingBank,
      action: onOpenAccounts,
    },
    {
      id: 'categories',
      label: 'Категории',
      description: 'Настройка категорий доходов и расходов',
      icon: IconTags,
      action: onOpenCategories,
    },
    {
      id: 'data',
      label: 'Синхронизация',
      description: 'Экспорт и импорт данных',
      icon: IconRefresh,
      action: onOpenData,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Профиль</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onClose();
                  item.action();
                }}
                className="w-full flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-neutral-50 transition text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                  <Icon size={20} className="text-neutral-700" stroke={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black">{item.label}</p>
                  <p className="text-xs text-neutral-400 truncate">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}