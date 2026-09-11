// src/components/CategoriesManager.jsx
import React, { useState } from 'react';
import { useCategories } from '../context/CategoriesContext';

export function CategoriesManager({ isOpen, onClose }) {
  const {
    expenseCategories,
    incomeCategories,
    addCategory,
    deleteCategory,
    renameCategory,
  } = useCategories();

  const [activeTab, setActiveTab] = useState('expense');
  const [newName, setNewName] = useState('');
  const [editingName, setEditingName] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  if (!isOpen) return null;

  const currentCategories =
    activeTab === 'expense' ? expenseCategories : incomeCategories;

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory(activeTab, newName);
    setNewName('');
  };

  const handleDelete = (name) => {
    if (window.confirm(`Удалить категорию «${name}»?`)) {
      deleteCategory(activeTab, name);
    }
  };

  const handleStartEdit = (name) => {
    setEditingName(name);
    setEditingValue(name);
  };

  const handleSaveEdit = () => {
    if (editingName && editingValue.trim()) {
      renameCategory(activeTab, editingName, editingValue);
      setEditingName(null);
      setEditingValue('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Категории</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Табы */}
        <div className="flex gap-1 bg-neutral-100 rounded-2xl p-1 mb-4">
          <button
            onClick={() => { setActiveTab('expense'); setEditingName(null); }}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium transition ${
              activeTab === 'expense' ? 'bg-white text-black shadow-sm' : 'text-neutral-500'
            }`}
          >
            Расходы
          </button>
          <button
            onClick={() => { setActiveTab('income'); setEditingName(null); }}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium transition ${
              activeTab === 'income' ? 'bg-white text-black shadow-sm' : 'text-neutral-500'
            }`}
          >
            Доходы
          </button>
        </div>

        {/* Добавление новой категории */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Новая категория"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAdd}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            +
          </button>
        </div>

        {/* Список категорий */}
        <div className="space-y-1">
          {currentCategories.map((name) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-neutral-50"
            >
              {editingName === name ? (
                <>
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    className="flex-1 rounded border border-blue-400 px-2 py-1 text-sm outline-none"
                    autoFocus
                  />
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={handleSaveEdit}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setEditingName(null)}
                      className="text-xs text-neutral-400 hover:text-neutral-600"
                    >
                      Отмена
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-900">{name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleStartEdit(name)}
                      className="p-1 text-neutral-400 hover:text-blue-500"
                      title="Переименовать"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(name)}
                      className="p-1 text-neutral-400 hover:text-red-500"
                      title="Удалить"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}