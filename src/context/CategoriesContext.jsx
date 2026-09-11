// src/context/CategoriesContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const CategoriesContext = createContext();

// Категории по умолчанию
const DEFAULT_EXPENSE_CATEGORIES = [
  'Супермаркеты',
  'Кафе',
  'Транспорт',
  'Развлечения',
  'Маркетплейсы',
  'Аренда',
  'Кредит',
  'Спорт',
  'Услуги',
  'Другое',
];

const DEFAULT_INCOME_CATEGORIES = [
  'Зарплата',
  '% по вкладам',
  'Переводы',
];

export function CategoriesProvider({ children }) {
  const [expenseCategories, setExpenseCategories] = useState(() => {
    const saved = localStorage.getItem('expenseCategories');
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSE_CATEGORIES;
  });

  const [incomeCategories, setIncomeCategories] = useState(() => {
    const saved = localStorage.getItem('incomeCategories');
    return saved ? JSON.parse(saved) : DEFAULT_INCOME_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories));
  }, [expenseCategories]);

  useEffect(() => {
    localStorage.setItem('incomeCategories', JSON.stringify(incomeCategories));
  }, [incomeCategories]);

  // Добавить категорию
  const addCategory = (type, name) => {
    if (!name.trim()) return;
    if (type === 'expense') {
      setExpenseCategories((prev) => [...prev, name.trim()]);
    } else {
      setIncomeCategories((prev) => [...prev, name.trim()]);
    }
  };

  // Удалить категорию
  const deleteCategory = (type, name) => {
    if (type === 'expense') {
      setExpenseCategories((prev) => prev.filter((c) => c !== name));
    } else {
      setIncomeCategories((prev) => prev.filter((c) => c !== name));
    }
  };

  // Переименовать категорию
  const renameCategory = (type, oldName, newName) => {
    if (!newName.trim()) return;
    if (type === 'expense') {
      setExpenseCategories((prev) =>
        prev.map((c) => (c === oldName ? newName.trim() : c))
      );
    } else {
      setIncomeCategories((prev) =>
        prev.map((c) => (c === oldName ? newName.trim() : c))
      );
    }
  };

  const value = {
    expenseCategories,
    incomeCategories,
    addCategory,
    deleteCategory,
    renameCategory,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}