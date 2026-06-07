-- ========================================================================
-- SALDOIN DATABASE SCHEMA FOR SUPABASE
-- Location: public schema (PostgreSQL)
-- Security: Row Level Security (RLS) enabled on all tables
-- ========================================================================

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create a profile after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'name', 'User Saldoin'), 
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Wallets Table
create table public.wallets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('bank', 'ewallet', 'cash')),
  provider text not null, -- e.g. BCA, GoPay, Cash
  account_number text,
  initial_balance numeric(15, 2) default 0.00 not null,
  color text,
  icon text,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Categories Table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade, -- Nullable for default system categories
  name text not null,
  icon text,
  color text,
  type text not null check (type in ('income', 'outcome', 'expense')),
  is_default boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Transactions Table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  wallet_id uuid references public.wallets(id) on delete cascade not null,
  type text not null check (type in ('income', 'outcome', 'expense', 'transfer')),
  amount numeric(15, 2) not null check (amount >= 0),
  category_id uuid references public.categories(id) on delete set null,
  note text,
  date date default current_date not null,
  transfer_pair_id uuid references public.transactions(id) on delete set null, -- Link paired transaction for transfers
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Budgets Table (Phase 2)
create table public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  amount numeric(15, 2) not null check (amount >= 0),
  period text default 'monthly' not null,
  month integer not null check (month between 1 and 12),
  year integer not null check (year >= 2026),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, category_id, month, year)
);

-- 6. Saving Goals Table (Phase 2)
create table public.saving_goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  target_amount numeric(15, 2) not null check (target_amount > 0),
  current_amount numeric(15, 2) default 0.00 not null check (current_amount >= 0),
  deadline date,
  wallet_id uuid references public.wallets(id) on delete set null, -- physical location home wallet
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Subscriptions / Recurring Payments Table (Phase 2)
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  amount numeric(15, 2) not null check (amount > 0),
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly', 'yearly')),
  next_due_date date not null,
  wallet_id uuid references public.wallets(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.saving_goals enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles 
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles 
  for update using (auth.uid() = id);

-- Wallets Policies
create policy "Users can manage own wallets" on public.wallets 
  for all using (auth.uid() = user_id);

-- Categories Policies (Users can read defaults where user_id is null OR their own custom categories)
create policy "Users can view default or own categories" on public.categories 
  for select using (user_id is null or auth.uid() = user_id);
create policy "Users can manage own categories" on public.categories 
  for all using (auth.uid() = user_id);

-- Transactions Policies
create policy "Users can manage own transactions" on public.transactions 
  for all using (auth.uid() = user_id);

-- Budgets Policies
create policy "Users can manage own budgets" on public.budgets 
  for all using (auth.uid() = user_id);

-- Saving Goals Policies
create policy "Users can manage own saving_goals" on public.saving_goals 
  for all using (auth.uid() = user_id);

-- Subscriptions Policies
create policy "Users can manage own subscriptions" on public.subscriptions 
  for all using (auth.uid() = user_id);

-- ========================================================================
-- SEED DEFAULT SYSTEM CATEGORIES (Available to all users)
-- ========================================================================

insert into public.categories (name, icon, color, type, is_default) values
  ('Makan & Minum', 'IoFastFoodOutline', 'bg-amber-500', 'outcome', true),
  ('Transport', 'IoCarOutline', 'bg-blue', 'outcome', true),
  ('Hiburan', 'IoGameControllerOutline', 'bg-purple-500', 'outcome', true),
  ('Kesehatan', 'IoHeartOutline', 'bg-red-500', 'outcome', true),
  ('Belanja', 'IoCartOutline', 'bg-blue-600', 'outcome', true),
  ('Tagihan', 'IoBulbOutline', 'bg-orange-500', 'outcome', true),
  ('Pendidikan', 'IoBookOutline', 'bg-teal-600', 'outcome', true),
  ('Sosial', 'IoPeopleOutline', 'bg-rose-500', 'outcome', true),
  ('Investasi', 'IoTrendingUpOutline', 'bg-indigo-600', 'outcome', true),
  ('Lain-lain', 'IoCashOutline', 'bg-gray-500', 'outcome', true),
  ('Gaji', 'IoBriefcaseOutline', 'bg-green-600', 'income', true),
  ('Freelance', 'IoReceiptOutline', 'bg-emerald-600', 'income', true),
  ('Bisnis', 'IoStorefrontOutline', 'bg-green-700', 'income', true),
  ('Transfer Masuk', 'IoRepeatOutline', 'bg-sky-600', 'income', true),
  ('Lain-lain (Income)', 'IoCashOutline', 'bg-gray-500', 'income', true);
