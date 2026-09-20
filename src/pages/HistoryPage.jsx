// src/pages/HistoryPage.jsx
import React from 'react';
import {
  IconPlus,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { getCategoryIcon } from '../utils/categoryIcons';

const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export function HistoryPage({
  transactions,
  accounts,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  filters,
  setFilters,
}) {
  const {
    filterPeriod,
    setFilterPeriod,
    filterBank,
    setFilterBank,
    filterType,
    setFilterType,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    openDropdown,
    setOpenDropdown,
  } = filters;

  const handleCustomPeriodClick = () => {
    setFilterPeriod('custom');
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setCustomStart(firstDay.toISOString().split('T')[0]);
    setCustomEnd(lastDay.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-3">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-lg font-semibold text-black">История</h1>
        <button
          onClick={onAddTransaction}
          className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600 transition"
        >
          <IconPlus size={16} stroke={2} />
          Добавить
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2 relative">
        {/* ПЕРИОД */}
        <div className="flex-1 relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'period' ? null : 'period')}
            className={`w-full rounded-2xl px-3 py-2.5 text-xs font-medium text-left flex items-center justify-between transition ${
              filterPeriod !== 'month' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            <span className="truncate">
              {filterPeriod === 'month'
                ? MONTHS_NOMINATIVE[new Date().getMonth()]
                : filterPeriod === 'prevMonth'
                  ? MONTHS_NOMINATIVE[new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getMonth()]
                  : filterPeriod === 'all'
                    ? 'Всё время'
                    : 'Свой период'}
            </span>
            <svg className="h-3 w-3 shrink-0 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === 'period' && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-2xl shadow-lg border border-neutral-200 p-1 z-20">
              <button
                onClick={() => { setFilterPeriod('month'); setOpenDropdown(null); }}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl transition ${
                  filterPeriod === 'month' ? 'bg-black text-white' : 'hover:bg-neutral-100'
                }`}
              >
                {MONTHS_NOMINATIVE[new Date().getMonth()]}
              </button>
              <button
                onClick={() => { setFilterPeriod('prevMonth'); setOpenDropdown(null); }}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl transition ${
                  filterPeriod === 'prevMonth' ? 'bg-black text-white' : 'hover:bg-neutral-100'
                }`}
              >
                {MONTHS_NOMINATIVE[new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getMonth()]}
              </button>
              <button
                onClick={() => { setFilterPeriod('all'); setOpenDropdown(null); }}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl transition ${
                  filterPeriod === 'all' ? 'bg-black text-white' : 'hover:bg-neutral-100'
                }`}
              >
                Всё время
              </button>
              <button
                onClick={() => { handleCustomPeriodClick(); setOpenDropdown(null); }}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl transition ${
                  filterPeriod === 'custom' ? 'bg-black text-white' : 'hover:bg-neutral-100'
                }`}
              >
                Свой период
              </button>
            </div>
          )}
        </div>

        {/* БАНКИ */}
        <div className="flex-1 relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'bank' ? null : 'bank')}
            className={`w-full rounded-2xl px-3 py-2.5 text-xs font-medium text-left flex items-center justify-between transition ${
              filterBank !== 'all' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            <span className="truncate">
              {filterBank === 'all' ? 'Все банки' : filterBank}
            </span>
            <svg className="h-3 w-3 shrink-0 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === 'bank' && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-2xl shadow-lg border border-neutral-200 p-1 z-20">
              {['all', ...accounts.map((a) => a.bank)].map((bank, idx) => (
                <button
                  key={`${bank}-${idx}`}
                  onClick={() => { setFilterBank(bank); setOpenDropdown(null); }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition ${
                    filterBank === bank ? 'bg-black text-white' : 'hover:bg-neutral-100'
                  }`}
                >
                  {bank === 'all' ? 'Все банки' : bank}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ТИП */}
        <div className="flex-1 relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
            className={`w-full rounded-2xl px-3 py-2.5 text-xs font-medium text-left flex items-center justify-between transition ${
              filterType !== 'all' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            <span className="truncate">
              {filterType === 'all' ? 'Все' :
               filterType === 'income' ? 'Доходы' :
               'Расходы'}
            </span>
            <svg className="h-3 w-3 shrink-0 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown === 'type' && (
            <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-2xl shadow-lg border border-neutral-200 p-1 z-20">
              {[
                { value: 'all', label: 'Все операции' },
                { value: 'income', label: 'Доходы' },
                { value: 'expense', label: 'Расходы' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setFilterType(opt.value); setOpenDropdown(null); }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl transition ${
                    filterType === opt.value ? 'bg-black text-white' : 'hover:bg-neutral-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Поля для кастомного периода */}
      {filterPeriod === 'custom' && (
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-black outline-none focus:border-blue-500"
          />
          <span className="text-xs text-neutral-400">—</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-black outline-none focus:border-blue-500"
          />
        </div>
      )}

      {/* Список операций */}
      <div className="space-y-2 pt-2">
        {transactions.length === 0 ? (
          <p className="text-center text-neutral-400 py-8 text-sm">
            Нет операций по выбранным фильтрам
          </p>
        ) : (
          transactions.map((tx) => {
            const CategoryIcon = getCategoryIcon(tx.category);
            return (
              <div
                key={tx.id}
                className="group relative flex items-center gap-3 rounded-2xl bg-white hover:bg-neutral-50 p-2.5 transition-all"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                  <CategoryIcon size={18} className="text-neutral-700" stroke={1.5} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-black truncate">
                    {tx.category}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {tx.bank && <span className="mr-2">{tx.bank}</span>}
                    {tx.date}
                  </p>
                </div>

                <span
                  className={`text-sm font-semibold whitespace-nowrap ${
                    tx.type === 'income' ? 'text-emerald-600' : 'text-black'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '−'}
                  {Number(tx.amount).toLocaleString()} ₽
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <button
                    onClick={() => onEditTransaction(tx)}
                    className="p-1.5 text-neutral-400 hover:text-blue-500 transition"
                    title="Редактировать"
                  >
                    <IconPencil size={16} stroke={1.5} />
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="p-1.5 text-neutral-400 hover:text-red-500 transition"
                        title="Удалить"
                      >
                        <IconTrash size={16} stroke={1.5} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Транзакция будет удалена навсегда.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteTransaction(tx.id)}>
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}