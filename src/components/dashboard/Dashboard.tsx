import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../contexts/CategoriesContext';
import { supabase, Expense, Budget } from '../../lib/supabase';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

export function Dashboard() {
  const { user } = useAuth();
  const { categories, getCategoryById } = useCategories();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month'>('month');

  useEffect(() => {
    if (user && categories.length > 0) {
      fetchData();
    }
  }, [user, categories]);

  async function fetchData() {
    if (!user) return;

    try {
      const now = new Date();
      const startDate = dateRange === 'week'
        ? subDays(now, 7)
        : startOfMonth(now);
      const endDate = dateRange === 'week'
        ? now
        : endOfMonth(now);

      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('*, category:categories(*)')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: false });

      if (expenseError) throw expenseError;

      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false });

      if (budgetError) throw budgetError;

      setExpenses(expenseData || []);
      setBudgets(budgetData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const expensesByCategory = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const catExpenses = expenses.filter(e => e.category_id === cat.id);
      const total = catExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      return {
        name: cat.name,
        value: total,
        color: cat.color,
        id: cat.id,
      };
    })
    .filter(c => c.value > 0)
    .sort((a, b) => b.value - a.value);

  const recentExpenses = expenses.slice(0, 5);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: now });

  const dailySpending = days.map(day => {
    const dayExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    const total = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    return {
      date: format(day, 'd MMM'),
      amount: total,
    };
  });

  const topCategories = expensesByCategory.slice(0, 4);
  const otherTotal = expensesByCategory.slice(4).reduce((sum, c) => sum + c.value, 0);
  const pieData = [...topCategories];
  if (otherTotal > 0) {
    pieData.push({ name: 'Other', value: otherTotal, color: '#94a3b8', id: 'other' });
  }

  const budgetAlerts = budgets.map(budget => {
    const catExpenses = expenses.filter(e => e.category_id === budget.category_id);
    const spent = catExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const percentage = (spent / Number(budget.amount_limit)) * 100;
    return {
      ...budget,
      spent,
      percentage,
      status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'ok',
    };
  }).filter(b => b.status !== 'ok');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your spending and stay on budget</p>
        </div>
        <Link
          to="/expenses?add=true"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </Link>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { setDateRange('week'); fetchData(); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            dateRange === 'week'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => { setDateRange('month'); fetchData(); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            dateRange === 'month'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          This Month
        </button>
      </div>

      {budgetAlerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300">Budget Alerts</h3>
              <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-400">
                {budgetAlerts.map(budget => (
                  <li key={budget.id}>
                    {budget.category?.name}: {formatCurrency(budget.spent)} of {formatCurrency(Number(budget.amount_limit))}
                    {budget.status === 'exceeded' && ' (Exceeded!)'}
                    {budget.status === 'warning' && ' (80% used)'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Transactions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{expenses.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Avg. Daily</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalExpenses / Math.max(1, dateRange === 'week' ? 7 : days.length))}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Active Budgets</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{budgets.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h2>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No expenses recorded yet
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Spending</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySpending}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `Rs.${value}`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Expenses</h2>
          <Link
            to="/expenses"
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
          >
            View all
          </Link>
        </div>
        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map(expense => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${expense.category?.color}20` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: expense.category?.color }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {expense.description || expense.category?.name || 'Expense'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(expense.date), 'd MMM yyyy')}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(Number(expense.amount))}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No recent expenses
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget Progress</h2>
        {budgets.length > 0 ? (
          <div className="space-y-4">
            {budgets.map(budget => {
              const catExpenses = expenses.filter(e => e.category_id === budget.category_id);
              const spent = catExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
              const percentage = Math.min((spent / Number(budget.amount_limit)) * 100, 100);
              const isOverBudget = spent > Number(budget.amount_limit);

              return (
                <div key={budget.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: budget.category?.color }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {budget.category?.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(spent)} / {formatCurrency(Number(budget.amount_limit))}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverBudget ? 'bg-red-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No budgets set up yet</p>
            <Link
              to="/budgets"
              className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              Create your first budget
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
