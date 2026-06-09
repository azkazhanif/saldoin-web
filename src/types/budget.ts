export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number; // limit nominal
  period: "daily" | "monthly" | "yearly";
  month: number; // 1-12
  year: number;
  alert_at: number; // threshold persen, default 80
  is_recurring: boolean; // ulangi setiap bulan
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  spent?: number;
  percentage?: number;
}
