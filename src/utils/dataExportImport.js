// src/utils/dataExportImport.js

/**
 * Экспортирует все данные из localStorage в JSON-файл
 */
export function exportData() {
  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    accounts: JSON.parse(localStorage.getItem('accounts') || '[]'),
    transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
    expenseCategories: JSON.parse(localStorage.getItem('expenseCategories') || '[]'),
    incomeCategories: JSON.parse(localStorage.getItem('incomeCategories') || '[]'),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const date = new Date().toISOString().split('T')[0];
  link.download = `zlатник-backup-${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Импортирует данные из JSON-файла в localStorage
 * @param {File} file - файл от input[type="file"]
 * @returns {Promise<Object>} — статистика импорта
 */
export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Проверка формата
        if (!data.version || !Array.isArray(data.transactions)) {
          reject(new Error('Неверный формат файла. Ожидается бэкап от «Златника».'));
          return;
        }

        // Сохраняем всё в localStorage
        if (data.accounts) {
          localStorage.setItem('accounts', JSON.stringify(data.accounts));
        }
        if (data.transactions) {
          localStorage.setItem('transactions', JSON.stringify(data.transactions));
        }
        if (data.expenseCategories) {
          localStorage.setItem('expenseCategories', JSON.stringify(data.expenseCategories));
        }
        if (data.incomeCategories) {
          localStorage.setItem('incomeCategories', JSON.stringify(data.incomeCategories));
        }

        resolve({
          accounts: data.accounts?.length || 0,
          transactions: data.transactions?.length || 0,
          expenseCategories: data.expenseCategories?.length || 0,
          incomeCategories: data.incomeCategories?.length || 0,
        });
      } catch (err) {
        reject(new Error('Не удалось прочитать файл: ' + err.message));
      }
    };

    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsText(file);
  });
}