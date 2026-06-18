import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  currency_preference: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string | null;
  color: string;
  type: 'expense' | 'income';
  user_id: string;
  is_default: boolean;
  created_at: string;
};

export type Expense = {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  category_id: string | null;
  user_id: string;
  notes: string | null;
  created_at: string;
  category?: Category;
};

export type Budget = {
  id: string;
  category_id: string | null;
  amount_limit: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  user_id: string;
  created_at: string;
  category?: Category;
};

export type SavingsGoal = {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  user_id: string;
  created_at: string;
};

export type RecurringExpense = {
  id: string;
  name: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_due_date: string;
  category_id: string | null;
  user_id: string;
  is_active: boolean;
  created_at: string;
  category?: Category;
};

export const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#ef4444', type: 'expense' as const },
  { name: 'Transport', icon: 'Car', color: '#f97316', type: 'expense' as const },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#eab308', type: 'expense' as const },
  { name: 'Entertainment', icon: 'Film', color: '#22c55e', type: 'expense' as const },
  { name: 'Bills & Utilities', icon: 'Receipt', color: '#06b6d4', type: 'expense' as const },
  { name: 'Healthcare', icon: 'Heart', color: '#ec4899', type: 'expense' as const },
  { name: 'Education', icon: 'GraduationCap', color: '#8b5cf6', type: 'expense' as const },
  { name: 'Rent/EMI', icon: 'Home', color: '#6366f1', type: 'expense' as const },
  { name: 'Subscriptions', icon: 'CreditCard', color: '#14b8a6', type: 'expense' as const },
  { name: 'Other Expense', icon: 'MoreHorizontal', color: '#64748b', type: 'expense' as const },
  { name: 'Salary', icon: 'Briefcase', color: '#22c55e', type: 'income' as const },
  { name: 'Freelance', icon: 'Laptop', color: '#3b82f6', type: 'income' as const },
  { name: 'Investments', icon: 'TrendingUp', color: '#8b5cf6', type: 'income' as const },
  { name: 'Other Income', icon: 'Plus', color: '#64748b', type: 'income' as const },
];
