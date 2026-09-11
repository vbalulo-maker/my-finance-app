// src/context/TransactionContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Создаём сам контекст
const TransactionContext = createContext();

// 2. Создаём провайдер — компонент, который будет давать доступ к данным
export function TransactionProvider({ children }) {
  // 3. Загружаем сохранённые транзакции из localStorage при запуске
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // 4. Автоматически сохраняем в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // 5. Функция для добавления новой транзакции
  const addTransaction = (newTransaction) => {
    setTransactions((prev) => [
      {
        id: Date.now(), // уникальный ID
        ...newTransaction,
      },
      ...prev,
    ]);
  };
    // 5.1. Функция для обновления существующей транзакции
  const updateTransaction = (id, updatedData) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updatedData } : tx))
    );
  };

  // 6. Функция для удаления транзакции по ID
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  // 7. Значения и функции, которые будут доступны всем компонентам
  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

// 8. Кастомный хук для удобного использования контекста
export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}