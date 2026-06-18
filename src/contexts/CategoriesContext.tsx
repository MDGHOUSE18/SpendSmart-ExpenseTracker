import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase, Category, DEFAULT_CATEGORIES } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  addCategory: (category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'is_default'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  refreshCategories: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCategories = useCallback(async () => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    try {
      // Explicitly filter by user_id for extra safety
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length === 0) {
        await createDefaultCategories();
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createDefaultCategories = async () => {
    if (!user) return;

    try {
      const categoriesToInsert = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        user_id: user.id,
        is_default: true,
      }));

      const { data, error } = await supabase
        .from('categories')
        .insert(categoriesToInsert)
        .select();

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error creating default categories:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchCategories();
    } else {
      setCategories([]);
      setLoading(false);
    }
  }, [user, fetchCategories]);

  const addCategory = async (category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'is_default'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, user_id: user.id, is_default: false })
      .select()
      .single();

    if (error) throw error;
    setCategories(prev => [data, ...prev]);
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    if (!user) return;

    // Only update if this category belongs to the user
    const { error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat));
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;

    // Only delete if this category belongs to the user
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        refreshCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}
