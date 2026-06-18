import { useState, useEffect } from 'react';
import { useCategories } from '../../contexts/CategoriesContext';
import { supabase, Expense } from '../../lib/supabase';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval, startOfYear } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
} from 'lucide-react';

export function ReportsPage() {
  const { categories } = useCategories();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'3months' | '6months' | 'year'>('3months');

  useEffect(() => {
    fetchExpenses();
  }, [selectedPeriod]);

  function getPeriodRange() {
    const now = new Date();
    switch (selectedPeriod) {
      case '3months':
        return { start: subMonths(startOfMonth(now), 2), end: endOfMonth(now) };
      case '6months':
        return { start: subMonths(startOfMonth(now), 5), end: endOfMonth(now) };
      case 'year':
        return { start: startOfYear(now), end: endOfMonth(now) };
    }
  }

  async function fetchExpenses() {
    const { start, end } = getPeriodRange();

    const { data, error } = await supabase
      .from('expenses')
      .select('*, category:categories(*)')
      .gte('date', format(start, 'yyyy-MM-dd'))
      .lte('date', format(end, 'yyyy-MM-dd'))
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching expenses:', error);
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const { start, end } = getPeriodRange();
  const months = eachMonthOfInterval({ start, end });
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const monthlyExpenses = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date >= monthStart && date <= monthEnd;
    });

    const byCategory: Record<string, number> = {};
    expenseCategories.forEach(cat => {
      const catExpenses = monthExpenses.filter(e => e.category_id === cat.id);
      byCategory[cat.name] = catExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    });

    return {
      name: format(month, 'MMM'),
      total: monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
      ...byCategory,
    };
  });

  const totalByCategory = expenseCategories.map(cat => {
    const catExpenses = expenses.filter(e => e.category_id === cat.id);
    const total = catExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    return {
      name: cat.name,
      total,
      color: cat.color,
    };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const avgMonthly = totalExpenses / months.length;

  const currentMonth = monthlyExpenses[monthlyExpenses.length - 1]?.total || 0;
  const previousMonth = monthlyExpenses[monthlyExpenses.length - 2]?.total || 0;
  const monthChange = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

  const handleExport = () => {
    const csvRows = [
      ['Date', 'Description', 'Category', 'Amount', 'Notes'],
      ...expenses.map(e => [
        e.date,
        e.description || '',
        e.category?.name || '',
        e.amount,
        e.notes || '',
      ]),
    ];

    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Analyze your spending patterns
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSelectedPeriod('3months')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedPeriod === '3months'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          3 Months
        </button>
        <button
          onClick={() => setSelectedPeriod('6months')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedPeriod === '6months'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          6 Months
        </button>
        <button
          onClick={() => setSelectedPeriod('year')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedPeriod === 'year'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          This Year
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalExpenses)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Avg. Monthly</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(avgMonthly)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              monthChange < 0
                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {monthChange < 0 ? (
                <TrendingDown className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">vs Last Month</p>
          <p className={`text-2xl font-bold ${
            monthChange < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {monthChange >= 0 ? '+' : ''}{monthChange.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `Rs.${value}`} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Breakdown</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyExpenses} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis type="number" stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `Rs.${value}`} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={50} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                }}
              />
              <Legend />
              {expenseCategories.slice(0, 5).map((cat, index) => (
                <Bar
                  key={cat.id}
                  dataKey={cat.name}
                  fill={cat.color}
                  stackId="a"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Spending Categories</h2>
        <div className="space-y-3">
          {totalByCategory.map((cat, index) => (
            <div key={cat.name} className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-6">{index + 1}.</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(cat.total)}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(cat.total / totalByCategory[0].total) * 100}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
