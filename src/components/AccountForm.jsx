// src/components/AccountForm.jsx
import React, { useState, useEffect } from 'react';

const BANKS = ['Т-Банк', 'Альфа-Банк', 'Сбер', 'Яндекс', 'РСХБ', 'ВТБ', 'Открытие', 'Другой'];

export function AccountForm({ isOpen, onClose, onSave, onDelete, account = null }) {
  const [formData, setFormData] = useState({
    bank: BANKS[0],
    last4: '',
    initialBalance: '',
  });

  const isEditing = !!account;

  useEffect(() => {
    if (account && isOpen) {
      setFormData({
        bank: account.bank || BANKS[0],
        last4: account.last4 || '',
        initialBalance: account.initialBalance?.toString() || '',
      });
    } else if (!isOpen) {
      setFormData({ bank: BANKS[0], last4: '', initialBalance: '' });
    }
  }, [account, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const initialBalance = parseFloat(formData.initialBalance);
    if (isNaN(initialBalance)) {
      alert('Введите корректный баланс');
      return;
    }
    if (formData.last4.length !== 4 || isNaN(formData.last4)) {
      alert('Введите 4 последние цифры карты');
      return;
    }

    onSave({
      bank: formData.bank,
      last4: formData.last4,
      initialBalance: initialBalance,
    });
    onClose();
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Удалить банк «${formData.bank} · ${formData.last4}»? Все транзакции этого банка останутся, но перестанут быть привязанными.`
      )
    ) {
      onDelete(account.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Редактирование банка' : 'Новый банк'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Банк */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Банк
            </label>
            <select
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
            >
              {BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Последние 4 цифры */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Последние 4 цифры карты
            </label>
            <input
              type="text"
              name="last4"
              value={formData.last4}
              onChange={handleChange}
              placeholder="9089"
              maxLength={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Баланс */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Начальный баланс
            </label>
            <input
              type="number"
              name="initialBalance"
              value={formData.initialBalance}
              onChange={handleChange}
              placeholder="100000"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Кнопки Сохранить/Отмена */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {isEditing ? 'Сохранить' : 'Добавить'}
            </button>
          </div>

          {/* Кнопка удаления — только при редактировании */}
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full mt-3 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              Удалить банк
            </button>
          )}
        </form>
      </div>
    </div>
  );
}