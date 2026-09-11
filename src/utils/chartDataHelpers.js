// src/utils/chartDataHelpers.js

/**
 * Группирует транзакции по категориям для круговой диаграммы
 * @param {Array} transactions - массив транзакций
 * @param {string} type - 'expense' или 'income'
 * @returns {Array} - [{ category, amount }, ...]
 */
export function prepareCategoryData(transactions, type = 'expense') {
  const filtered = transactions.filter((tx) => tx.type === type);

  const grouped = filtered.reduce((acc, tx) => {
    const category = tx.category || 'Другое';
    acc[category] = (acc[category] || 0) + Number(tx.amount);
    return acc;
  }, {});

  return Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount,
  }));
}

/**
 * Группирует транзакции по дням для столбчатой диаграммы
 * @param {Array} transactions - массив транзакций
 * @param {number} days - количество дней для отображения (по умолчанию 30)
 * @returns {Array} - [{ date, income, expenses }, ...]
 */
export function prepareDailyData(transactions, days = 30) {
  const result = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const shortDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;

    const dayTx = transactions.filter((tx) => tx.date === dateStr);

    const income = dayTx
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const expenses = dayTx
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    result.push({ date: shortDate, income, expenses });
  }

  return result;
}