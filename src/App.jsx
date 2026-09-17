// src/App.jsx
import React, { useState } from 'react';
import { BalanceCard } from './components/BalanceCard';
import { TransactionForm } from './components/TransactionForm';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { prepareCategoryData, prepareDailyData } from './utils/chartDataHelpers';
import { useTransactions } from './context/TransactionContext';
import { useAccounts } from './context/AccountsContext';
import { AccountForm } from './components/AccountForm';
import { CategoriesManager } from './components/CategoriesManager';
import { Card, CardContent } from './components/ui/card';
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
} from './components/ui/alert-dialog';
import { DataManager } from './components/DataManager';

// Названия месяцев в винительном падеже (для «за сентябрь»)
const MONTHS_ACCUSATIVE = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
];

// Названия месяцев в именительном падеже (для кнопки фильтра)
const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

function getPeriodLabel(filterPeriod, customStart, customEnd) {
  const now = new Date();

  if (filterPeriod === 'month') {
    return `за ${MONTHS_ACCUSATIVE[now.getMonth()]}`;
  }
  if (filterPeriod === 'prevMonth') {
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return `за ${MONTHS_ACCUSATIVE[prev.getMonth()]}`;
  }
  if (filterPeriod === 'all') {
    return 'за всё время';
  }
  if (filterPeriod === 'custom' && customStart && customEnd) {
    return `${customStart} — ${customEnd}`;
  }
  return 'за период';
}

const CATEGORY_ICONS = {
  "Супермаркеты": "🛒",
  "Кафе": "☕",
  "Транспорт": "🚕",
  "Развлечения": "🎬",
  "Маркетплейсы": "📦",
  "Аренда": "🏠",
  "Кредит": "💳",
  "Спорт": "🏋️",
  "Услуги": "🛠️",
  "Другое": "📌",
  "Зарплата": "💰",
  "% по вкладам": "📈",
  "Переводы": "💸",
};

const getCategoryIcon = (category) => CATEGORY_ICONS[category] || "📌";

function App() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  // Фильтры
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [filterBank, setFilterBank] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

  // === ФИЛЬТРАЦИЯ ===

  const getPeriodRange = () => {
    const now = new Date();

    if (filterPeriod === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      return { start, end };
    }

    if (filterPeriod === 'prevMonth') {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      return { start, end };
    }

    if (filterPeriod === 'custom') {
      if (customStart && customEnd) {
        const start = new Date(customStart);
        const end = new Date(customEnd);
        end.setHours(23, 59, 59);
        return { start, end };
      }
      return null;
    }

    return null;
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (filterBank !== 'all' && tx.bank !== filterBank) return false;

    const range = getPeriodRange();
    if (range) {
      const txDate = new Date(tx.date);
      if (txDate < range.start || txDate > range.end) return false;
    }

    return true;
  });

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const handleEdit = (tx) => {
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleCustomPeriodClick = () => {
    setFilterPeriod('custom');
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setCustomStart(firstDay.toISOString().split('T')[0]);
    setCustomEnd(lastDay.toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-md mx-auto space-y-3">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-base font-semibold text-black">Златник</span>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`text-sm transition ${
                currentPage === 'dashboard'
                  ? 'text-black font-medium'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => setCurrentPage('analytics')}
              className={`text-sm transition ${
                currentPage === 'analytics'
                  ? 'text-black font-medium'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              Аналитика
            </button>
            <button
              onClick={() => setIsCategoriesOpen(true)}
              className="text-sm text-neutral-400 hover:text-black transition"
            >
              Категории
            </button>
          </div>

          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
        </div>

        {currentPage === 'dashboard' ? (
          <>
            {/* Карточки банков */}
            <BalanceCard
              accounts={accounts}
              transactions={transactions}
              onAddClick={() => {
                setEditingAccount(null);
                setIsAccountFormOpen(true);
              }}
              onEditClick={(account) => {
                setEditingAccount(account);
                setIsAccountFormOpen(true);
              }}
            />

            {/* Доходы / Расходы */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
                <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-neutral-500 mb-1">Доходы</p>
                  <p className="text-xl font-bold text-black">
                    {totalIncome.toLocaleString()} ₽
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {getPeriodLabel(filterPeriod, customStart, customEnd)}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
                <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-neutral-500 mb-1">Расходы</p>
                  <p className="text-xl font-bold text-black">
                    {totalExpenses.toLocaleString()} ₽
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {getPeriodLabel(filterPeriod, customStart, customEnd)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Фильтры — три выпадашки */}
            <div className="flex gap-2 pt-2 relative">
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

              {/* ТИП ОПЕРАЦИИ */}
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

                        {/* Экспорт/Импорт данных */}
            <div className="mt-4">
              <details className="group">
                <summary className="cursor-pointer text-xs text-neutral-500 hover:text-black transition flex items-center gap-1 list-none">
                  <svg className="h-3 w-3 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Резервное копирование данных
                </summary>
                <div className="mt-2">
                  <DataManager onImportSuccess={() => window.location.reload()} />
                </div>
              </details>
            </div>

            {/* Поля выбора дат для кастомного периода */}
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
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3 px-1">
                <h2 className="text-sm font-medium text-neutral-500">Список операций</h2>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600 transition"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Добавить
                </button>
              </div>

              <div className="space-y-2">
                {filteredTransactions.length === 0 ? (
                  <p className="text-center text-neutral-400 py-4">
                    Нет операций по выбранным фильтрам
                  </p>
                ) : (
                  filteredTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="group relative flex items-center gap-3 rounded-2xl bg-white hover:bg-neutral-50 p-2.5 transition-all"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-base">
                        {getCategoryIcon(tx.category)}
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
                          onClick={() => handleEdit(tx)}
                          className="p-1.5 text-neutral-400 hover:text-blue-500 transition"
                          title="Редактировать"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="p-1.5 text-neutral-400 hover:text-red-500 transition"
                              title="Удалить"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
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
                              <AlertDialogAction onClick={() => deleteTransaction(tx.id)}>
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <AnalyticsPage 
            transactions={filteredTransactions}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            categoryData={prepareCategoryData(filteredTransactions, 'expense')}
            dailyData={prepareDailyData(filteredTransactions, 30)}
          />
        )}

        <TransactionForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onAdd={addTransaction}
          onUpdate={updateTransaction}
          accounts={accounts}
          transaction={editingTransaction}
        />

        <AccountForm
          isOpen={isAccountFormOpen}
          onClose={() => {
            setIsAccountFormOpen(false);
            setEditingAccount(null);
          }}
          onSave={(data) => {
            if (editingAccount) {
              updateAccount(editingAccount.id, data);
            } else {
              addAccount(data);
            }
          }}
          onDelete={(id) => {
            deleteAccount(id);
          }}
          account={editingAccount}
        />

        <CategoriesManager
          isOpen={isCategoriesOpen}
          onClose={() => setIsCategoriesOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;