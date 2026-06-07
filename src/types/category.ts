export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  user_id: string | null;  // null = default system category
  name: string;
  icon: string;            // nama icon Lucide (or mapped standard name)
  color: string;           // hex color, e.g. "#F59E0B"
  type: CategoryType;
  is_default: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  transaction_count?: number;  // di-join dari transactions
}
