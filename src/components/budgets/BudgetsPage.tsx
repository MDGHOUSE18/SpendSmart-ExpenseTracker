import { useState, useEffect } from 'react';
import { useCategories } from '../../contexts/CategoriesContext';
import { supabase, Budget, Expense } from '../../lib/supabase';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Target,
} from 'lucide-react';

export function BudgetsPage() {
  const { categories } = useCategories();
  const [budgets, setBudgets] = useState<(Budget & { spent: number; percentage: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);

  const [formData, setFormData] = useState({
    category_id: '',
    amount_limit: '',
    period: 'monthly' as 'monthly' | 'yearly',
    start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, [categories]);

  async function fetchBudgets() {
    try {
      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false });

      if (budgetError) throw budgetError;

      const now = new Date();
      const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');

      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('amount, category_id, date')
        .gte('date', monthStart)
        .lte('date', monthEnd);

      if (expenseError) throw expenseError;

      const budgetsWithSpending = (budgetData || []).map(budget => {
        const catExpenses = (expenseData || []).filter(e => e.category_id === budget.category_id);
        const spent = catExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const percentage = budget.amount_limit > 0 ? (spent / Number(budget.amount_limit)) * 100 : 0;
        return {
          ...budget,
          spent,
          percentage,
        };
      });

      setBudgets(budgetsWithSpending);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingBudget(null);
    const expenseCategories = categories.filter(c => c.type === 'expense');
    const existingBudgetCategories = budgets.map(b => b.category_id);
    const availableCategories = expenseCategories.filter(c => !existingBudgetCategories.includes(c.id));

    setFormData({
      category_id: availableCategories[0]?.id || '',
      amount_limit: '',
      period: 'monthly',
      start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    });
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(budget: Budget) {
    setEditingBudget(budget);
    setFormData({
      category_id: budget.category_id || '',
      amount_limit: String(budget.amount_limit),
      period: budget.period,
      start_date: budget.start_date,
    });
    setFormError(null);
    setModalOpen(true);
  }

  function openDeleteModal(budget: Budget) {
    setDeletingBudget(budget);
    setDeleteModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!formData.category_id) {
      setFormError('Please select a category');
      return;
    }

    if (!formData.amount_limit || Number(formData.amount_limit) <= 0) {
      setFormError('Please enter a valid amount limit');
      return;
    }

    setSaving(true);

    try {
      if (editingBudget) {
        const { error } = await supabase
          .from('budgets')
          .update({
            category_id: formData.category_id,
            amount_limit: Number(formData.amount_limit),
            period: formData.period,
            start_date: formData.start_date,
          })
          .eq('id', editingBudget.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('budgets')
          .insert({
            category_id: formData.category_id,
            amount_limit: Number(formData.amount_limit),
            period: formData.period,
            start_date: formData.start_date,
          });

        if (error) throw error;
      }

      setModalOpen(false);
      fetchBudgets();
    } catch (error: any) {
      if (error.code === '23505') {
        setFormError('A budget for this category already exists');
      } else {
        setFormError('Failed to save budget. Please try again.');
      }
      console.error('Error saving budget:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingBudget) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', deletingBudget.id);

      if (error) throw error;
      setDeleteModalOpen(false);
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount_limit), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const exceededBudgets = budgets.filter(b => b.percentage >= 100);
  const warningBudgets = budgets.filter(b => b.percentage >= 80 && b.percentage < 100);
  const goodBudgets = budgets.filter(b => b.percentage < 80);

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Set spending limits for each category
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" />
          Add Budget
        </button>
      </div>

      {budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalBudget)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalSpent)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                overallPercentage >= 100 ? 'bg-red-100 dark:bg-red-900/30' :
                overallPercentage >= 80 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
              }`}>
                {overallPercentage >= 100 ? (
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                ) : overallPercentage >= 80 ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Budget Used</p>
            <p className={`text-2xl font-bold ${
              overallPercentage >= 100 ? 'text-red-600 dark:text-red-400' :
              overallPercentage >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {overallPercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {exceededBudgets.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-300">Budgets Exceeded</h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {exceededBudgets.map(b => b.category?.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {budgets.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No budgets set</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create budgets to track your spending limits
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create your first budget
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {[...exceededBudgets, ...warningBudgets, ...goodBudgets].map((budget) => (
            <div
              key={budget.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${budget.category?.color}20` }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: budget.category?.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {budget.category?.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} budget
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(budget)}
                    className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(budget)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(budget.spent)} of {formatCurrency(Number(budget.amount_limit))}
                  </span>
                  <span className={`text-sm font-medium ${
                    budget.percentage >= 100 ? 'text-red-600 dark:text-red-400' :
                    budget.percentage >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {budget.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      budget.percentage >= 100 ? 'bg-red-500' :
                      budget.percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingBudget ? 'Edit Budget' : 'Add Budget'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={!!editingBudget}
                >
                  <option value="">Select a category</option>
                  {expenseCategories
                    .filter(cat => !editingBudget ? !budgets.some(b => b.category_id === cat.id) : true)
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget Amount (INR)
                </label>
                <input
                  type="number"
                  step="100"
                  value={formData.amount_limit}
                  onChange={(e) => setFormData({ ...formData, amount_limit: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter budget limit"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Period
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, period: 'monthly' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      formData.period === 'monthly'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, period: 'yearly' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      formData.period === 'yearly'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition-all"
                >
                  {saving ? 'Saving...' : editingBudget ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteModalOpen(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Delete Budget
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to delete this budget?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 px-4 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
