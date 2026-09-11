// src/components/BalanceCard.jsx
import React from "react";
import { Card, CardContent } from "./ui/card";

function CardIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="shrink-0"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth={1.5} />
      <path d="M2 10h20" strokeWidth={1.5} />
    </svg>
  );
}

const CARD_BACKGROUNDS = [
  "bg-[#171717] text-white",
  "bg-[#262626] text-white",
  "bg-[#404040] text-white",
  "bg-[#737373] text-white",
  "bg-[#A3A3A3] text-white",
];

/**
 * Рассчитывает реальный баланс банка:
 * initialBalance + доходы − расходы
 */
function calculateBalance(account, transactions) {
  const initial = Number(account.initialBalance) || 0;
  const related = transactions.filter((tx) => tx.bank === account.bank);

  const income = related
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const expenses = related
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  return initial + income - expenses;
}

export function BalanceCard({ accounts = [], transactions = [], onAddClick, onEditClick, currency = "₽" }) {
  return (
    <div className="space-y-2">
      {accounts.map((account, index) => {
        const realBalance = calculateBalance(account, transactions);

        return (
          <Card
            key={account.id}
            className={`group rounded-3xl border-0 shadow-sm cursor-pointer relative ${CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length]}`}
            onClick={() => onEditClick && onEditClick(account)}
          >
            <CardContent className="flex items-center justify-between px-4 py-2 gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <CardIcon />
                <span className="text-xs font-semibold truncate">
                  {account.bank} · {account.last4}
                </span>
              </div>
              <span className="text-base font-semibold whitespace-nowrap">
                {realBalance.toLocaleString()} {currency}
              </span>
            </CardContent>
          </Card>
        );
      })}

      {onAddClick && (
        <button
          onClick={onAddClick}
          className="w-full rounded-3xl border-2 border-dashed border-neutral-300 py-3 text-sm font-medium text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition"
        >
          + Добавить банк
        </button>
      )}
    </div>
  );
}