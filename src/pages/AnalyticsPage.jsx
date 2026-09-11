// src/pages/AnalyticsPage.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#a855f7', '#ec4899'];

export function AnalyticsPage({
  transactions = [],       // уже отфильтрованные транзакции
  totalIncome = 0,
  totalExpenses = 0,
  categoryData = [],
  dailyData = [],
}) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-black">Аналитика</h1>
        <p className="text-xs text-neutral-400 mt-0.5">Обзор ваших финансов за период</p>
      </div>

      {/* Карточки P&L */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-3">
            <p className="text-xs text-neutral-500 mb-1">Доходы</p>
            <p className="text-xl font-bold text-emerald-600">
              +{totalIncome.toLocaleString()} ₽
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-3">
            <p className="text-xs text-neutral-500 mb-1">Расходы</p>
            <p className="text-xl font-bold text-red-600">
              −{totalExpenses.toLocaleString()} ₽
            </p>
          </CardContent>
        </Card>
      </div>

      {/* График динамики */}
      <Card className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold">График динамики</CardTitle>
          <CardDescription className="text-xs">Доходы и расходы по дням</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income" fill="#22c55e" name="Доходы" />
                <Bar dataKey="expenses" fill="#ef4444" name="Расходы" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Распределение по категориям */}
      <Card className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold">Распределение по категориям</CardTitle>
          <CardDescription className="text-xs">Структура расходов</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-64 w-full">
            {categoryData.length === 0 ? (
              <p className="text-center text-neutral-400 py-16 text-xs">
                Нет данных для отображения
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={{ fontSize: 10 }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}