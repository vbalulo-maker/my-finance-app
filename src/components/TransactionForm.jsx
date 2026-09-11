// src/components/TransactionForm.jsx
import * as React from "react";
import { useState, useEffect } from "react";
import { useCategories } from "../context/CategoriesContext";

export function TransactionForm({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  accounts = [],
  transaction = null,
}) {
  const { expenseCategories, incomeCategories } = useCategories();

  // Список банков берём из аккаунтов, fallback — дефолтный список
  const availableBanks = accounts.length > 0
    ? accounts.map((a) => a.bank)
    : ["Т-Банк", "Альфа-Банк", "Сбер", "Яндекс", "РСХБ"];

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: expenseCategories[0] || "Другое",
    bank: availableBanks[0],
    date: new Date().toISOString().split("T")[0],
  });

  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction && isOpen) {
      const txType = transaction.type || "expense";
      const categories = txType === "income" ? incomeCategories : expenseCategories;
      setFormData({
        type: txType,
        amount: transaction.amount?.toString() || "",
        category: transaction.category || categories[0] || "Другое",
        bank: transaction.bank || availableBanks[0],
        date: transaction.date || new Date().toISOString().split("T")[0],
      });
    } else if (!isOpen) {
      setFormData({
        type: "expense",
        amount: "",
        category: expenseCategories[0] || "Другое",
        bank: availableBanks[0],
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [transaction, isOpen, expenseCategories, incomeCategories, availableBanks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (newType) => {
    const categories = newType === "income" ? incomeCategories : expenseCategories;
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: categories[0] || "Другое",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Пожалуйста, введите корректную сумму");
      return;
    }

    const transactionData = {
      type: formData.type,
      amount: amount,
      category: formData.category,
      bank: formData.bank,
      date: formData.date,
    };

    if (isEditing && transaction.id) {
      onUpdate(transaction.id, transactionData);
    } else {
      onAdd(transactionData);
    }
    onClose();
  };

  if (!isOpen) return null;

  const currentCategories = formData.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Редактирование транзакции" : "Новая транзакция"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Тип транзакции */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Тип
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  formData.type === "expense"
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Расход
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  formData.type === "income"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Доход
              </button>
            </div>
          </div>

          {/* Сумма */}
          <div className="mb-4">
            <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-gray-700">
              Сумма
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Введите сумму"
              min="0.01"
              step="0.01"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
              autoFocus
            />
          </div>

          {/* Категория — зависит от типа */}
          <div className="mb-4">
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700">
              Категория
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Банк — берём из аккаунтов пользователя */}
          <div className="mb-4">
            <label htmlFor="bank" className="mb-1.5 block text-sm font-medium text-gray-700">
              Банк
            </label>
            <select
              id="bank"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {availableBanks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          {/* Дата */}
          <div className="mb-6">
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-gray-700">
              Дата
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Отмена
            </button>

            <button
              type="submit"
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition ${
                isEditing
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isEditing ? "Редактировать" : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}