// src/components/DataManager.jsx
import React, { useRef, useState } from 'react';
import { exportData, importData } from '../utils/dataExportImport';

export function DataManager({ onImportSuccess }) {
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    exportData();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const stats = await importData(file);
      alert(
        `Импорт успешен!\n\n` +
        `Банков: ${stats.accounts}\n` +
        `Транзакций: ${stats.transactions}\n` +
        `Категорий расходов: ${stats.expenseCategories}\n` +
        `Категорий доходов: ${stats.incomeCategories}`
      );
      if (onImportSuccess) onImportSuccess();
    } catch (err) {
      alert('Ошибка импорта: ' + err.message);
    } finally {
      setIsImporting(false);
      // Сбрасываем input, чтобы можно было выбрать тот же файл повторно
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleExport}
        className="w-full rounded-2xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition flex items-center justify-center gap-2"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Экспорт данных
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="w-full rounded-2xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {isImporting ? 'Импорт...' : 'Импорт данных'}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}