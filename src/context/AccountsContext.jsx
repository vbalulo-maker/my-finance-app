// src/context/AccountsContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AccountsContext = createContext();

// Банки по умолчанию
const DEFAULT_ACCOUNTS = [
  { id: 1, bank: 'Т-Банк', last4: '9089', initialBalance: 135000 },
  { id: 2, bank: 'Альфа-Банк', last4: '1234', initialBalance: 52000 },
  { id: 3, bank: 'Сбер', last4: '5678', initialBalance: 78000 },
  { id: 4, bank: 'Яндекс', last4: '4321', initialBalance: 15000 },
  { id: 5, bank: 'РСХБ', last4: '8765', initialBalance: 23000 },
];

export function AccountsProvider({ children }) {
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('accounts');
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  });

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  const addAccount = (account) => {
    setAccounts((prev) => [
      ...prev,
      { id: Date.now(), ...account },
    ]);
  };

  const updateAccount = (id, updatedData) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...updatedData } : acc))
    );
  };

  const deleteAccount = (id) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const value = {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };

  return (
    <AccountsContext.Provider value={value}>
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccounts() {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountsProvider');
  }
  return context;
}