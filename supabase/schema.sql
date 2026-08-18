create extension if not exists "pgcrypto";
create table if not exists periods (key text primary key, label text not null, month_date date not null unique);
create table if not exists payment_methods (id uuid primary key default gen_random_uuid(), name text not null, type text not null check (type in ('cash','transfer','credit_card')), issuer text, last_four text, credit_limit numeric, limit_currency text check (limit_currency in ('ARS','USD')));
alter table payment_methods add column if not exists background_color text;
create table if not exists card_periods (id uuid primary key default gen_random_uuid(), card_id uuid not null references payment_methods(id) on delete cascade, period_key text not null references periods(key), start_date date not null, closing_date date not null, due_date date, unique(card_id, period_key), check(start_date <= closing_date), check(closing_date <= due_date));
create table if not exists credit_limit_history (id uuid primary key default gen_random_uuid(), card_id uuid not null references payment_methods(id) on delete cascade, effective_date date not null, amount numeric not null, currency text not null check (currency in ('ARS','USD')));
create table if not exists budgets (id uuid primary key default gen_random_uuid(), name text not null, base_amount numeric not null, currency text not null check (currency in ('ARS','USD')));
alter table budgets add column if not exists background_color text;
create table if not exists budget_period_assignments (budget_id uuid references budgets(id) on delete cascade, period_key text references periods(key), amount numeric not null, primary key (budget_id, period_key));
create table if not exists budget_rules (id uuid primary key default gen_random_uuid(), budget_id uuid references budgets(id) on delete cascade, payment_method_id uuid references payment_methods(id) on delete set null, currency text, min_amount numeric, max_amount numeric);
create table if not exists transactions (id uuid primary key default gen_random_uuid(), title text not null, description text, date date not null, time time, amount numeric not null, currency text not null check (currency in ('ARS','USD')), direction text not null check (direction in ('income','expense')), payment_method_id uuid references payment_methods(id) on delete set null, budget_id uuid references budgets(id) on delete set null, status text not null default 'paid' check (status in ('paid','pending')), installments integer, installment_number integer, source_transaction_id uuid references transactions(id) on delete set null, period_key text references periods(key) on delete set null, created_at timestamptz not null default now());
alter table transactions add column if not exists url text;
create table if not exists recurring_expenses (id uuid primary key default gen_random_uuid(), title text not null, description text, amount numeric not null, currency text not null, start_period text not null, end_period text, planned_day integer, payment_method_id uuid references payment_methods(id) on delete set null, budget_id uuid references budgets(id) on delete set null, active boolean not null default true);
create table if not exists recurring_instances (id uuid primary key default gen_random_uuid(), recurring_id uuid references recurring_expenses(id) on delete cascade, period_key text references periods(key), amount numeric not null, currency text not null, planned_date date, status text not null default 'pending', transaction_id uuid references transactions(id) on delete set null, unique(recurring_id, period_key));
create table if not exists exchange_rates (date date primary key, ars_per_usd numeric not null, source text not null, manual boolean not null default false, updated_at timestamptz not null default now());

-- First version: no auth by design. Keep the project private and use this only from the local app.

-- No-auth local mode: the app's anon key can read/write the personal workspace.
-- Keep this Supabase project private and do not deploy the app publicly without adding auth.
do $$ declare t text; begin
  for t in select unnest(array['periods','payment_methods','card_periods','credit_limit_history','budgets','budget_period_assignments','budget_rules','transactions','recurring_expenses','recurring_instances','exchange_rates']) loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "local app full access" on %I', t);
    execute format('create policy "local app full access" on %I for all to anon using (true) with check (true)', t);
  end loop;
end $$;
