create table if not exists public.projects (
  id text primary key,

  image text not null,
  title text not null,
  subtitle text,
  location text,
  year text,

  category text not null check (
    category in (
      'Residence','Villa','Hotel','Gallery',
      'Office','Cultural','Commercial','Public'
    )
  ),

  material text,
  description text,

  details text[] not null default '{}',
  area text,

  status text not null check (
    status in ('Completed','In Progress','Concept')
  ),

  tags text[] not null default '{}',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.projects enable row level security;
