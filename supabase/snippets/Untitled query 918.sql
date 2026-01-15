create table if not exists public.products (
  id text primary key,

  name text not null,
  image text not null,
  description text,

  category text not null check (
    category in ('Seating','Tables','Lighting','Objects','Storage')
  ),

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;
