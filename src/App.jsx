// src/App.jsx
import React, { useState } from 'react';
import { BalanceCard } from './components/BalanceCard';
import { TransactionForm } from './components/TransactionForm';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HistoryPage } from './pages/HistoryPage';
import { AssistantPage } from './pages/AssistantPage';
import { BottomNav } from './components/BottomNav';
import { ProfileMenu } from './components/ProfileMenu';
import { AccountForm } from './components/AccountForm';
import { CategoriesManager } from './components/CategoriesManager';
import { DataManager } from './components/DataManager';
import { prepareCategoryData, prepareDailyData } from './utils/chartDataHelpers';
import { useTransactions } from './context/TransactionContext';
import { useAccounts } from './context/AccountsContext';
import { Card, CardContent } from './components/ui/card';
import { IconChevronRight } from '@tabler/icons-react';

const MONTHS_ACCUSATIVE = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
];

function getPeriodLabel(filterPeriod, customStart, customEnd) {
  const now = new Date();
  if (filterPeriod === 'month') return `за ${MONTHS_ACCUSATIVE[now.getMonth()]}`;
  if (filterPeriod === 'prevMonth') {
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return `за ${MONTHS_ACCUSATIVE[prev.getMonth()]}`;
  }
  if (filterPeriod === 'all') return 'за всё время';
  if (filterPeriod === 'custom' && customStart && customEnd) {
    return `${customStart} — ${customEnd}`;
  }
  return 'за период';
}

function App() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDataOpen, setIsDataOpen] = useState(false);

  // Фильтры (для страницы истории)
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [filterBank, setFilterBank] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

  const getPeriodRange = () => {
    const now = new Date();
    if (filterPeriod === 'month') {
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      };
    }
    if (filterPeriod === 'prevMonth') {
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
      };
    }
    if (filterPeriod === 'custom' && customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      end.setHours(23, 59, 59);
      return { start, end };
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

  const lastFiveTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="text-base font-semibold text-black"
          >
            Златник
          </button>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
          />
        </div>

        {/* === СТРАНИЦА: ЗЛАТНИК (дашборд) === */}
        {currentPage === 'dashboard' && (
          <>
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

            <div className="grid grid-cols-2 gap-3 mt-3">
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

            {/* Последние 5 операций */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3 px-1">
                <h2 className="text-sm font-medium text-neutral-500">
                  Последние операции
                </h2>
                <button
                  onClick={() => setCurrentPage('history')}
                  className="flex items-center gap-0.5 text-sm font-medium text-blue-500 hover:text-blue-600 transition"
                >
                  Все операции
                  <IconChevronRight size={14} stroke={2} />
                </button>
              </div>

              <div className="space-y-1">
                {lastFiveTransactions.length === 0 ? (
                  <p className="text-center text-neutral-400 py-4 text-sm">
                    Нет операций
                  </p>
                ) : (
                  lastFiveTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 rounded-2xl p-2.5"
                    >
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
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* === СТРАНИЦА: АНАЛИТИКА === */}
        {currentPage === 'analytics' && (
          <AnalyticsPage
            transactions={filteredTransactions}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            categoryData={prepareCategoryData(filteredTransactions, 'expense')}
            dailyData={prepareDailyData(filteredTransactions, 30)}
          />
        )}

        {/* === СТРАНИЦА: ИСТОРИЯ === */}
        {currentPage === 'history' && (
          <HistoryPage
            transactions={filteredTransactions}
            accounts={accounts}
            onAddTransaction={() => setIsFormOpen(true)}
            onEditTransaction={handleEdit}
            onDeleteTransaction={deleteTransaction}
            filters={{
              filterPeriod, setFilterPeriod,
              filterBank, setFilterBank,
              filterType, setFilterType,
              customStart, setCustomStart,
              customEnd, setCustomEnd,
              openDropdown, setOpenDropdown,
            }}
          />
        )}

        {/* === СТРАНИЦА: АССИСТЕНТ === */}
        {currentPage === 'assistant' && <AssistantPage />}
      </div>

      {/* Нижняя навигация */}
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Модальные окна */}
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
          if (editingAccount) updateAccount(editingAccount.id, data);
          else addAccount(data);
        }}
        onDelete={(id) => deleteAccount(id)}
        account={editingAccount}
      />

      <CategoriesManager
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
      />

      <ProfileMenu
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenAccounts={() => {
          setEditingAccount(null);
          setIsAccountFormOpen(true);
        }}
        onOpenCategories={() => setIsCategoriesOpen(true)}
        onOpenData={() => setIsDataOpen(true)}
      />

      {/* Модалка данных — открывается из профиля */}
      {isDataOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsDataOpen(false)}
        >
          <div
            className="w-full max-w-md mx-4 rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Синхронизация</h2>
              <button
                onClick={() => setIsDataOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <DataManager onImportSuccess={() => window.location.reload()} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;