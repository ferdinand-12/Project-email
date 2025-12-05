-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EMAILS TABLE
create table public.emails (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null, -- Owner of the email copy
  from_email text not null,
  to_emails text[] not null, -- Array of email addresses
  subject text,
  body text,
  attachments text[] default '{}',
  folder text not null default 'inbox', -- inbox, sent, drafts, trash
  is_starred boolean default false,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CONTACTS TABLE
create table public.contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null, -- The user who owns this contact
  name text not null,
  email text not null,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Row Level Security)
alter table public.users enable row level security;
alter table public.emails enable row level security;
alter table public.contacts enable row level security;

-- Users can only see their own profile
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Emails policies
create policy "Users can view own emails" on public.emails
  for select using (auth.uid() = user_id);

create policy "Users can insert emails" on public.emails
  for insert with check (auth.uid() = user_id);

create policy "Users can update own emails" on public.emails
  for update using (auth.uid() = user_id);

create policy "Users can delete own emails" on public.emails
  for delete using (auth.uid() = user_id);

-- Contacts policies
create policy "Users can view own contacts" on public.contacts
  for select using (auth.uid() = user_id);

create policy "Users can insert contacts" on public.contacts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own contacts" on public.contacts
  for update using (auth.uid() = user_id);

create policy "Users can delete own contacts" on public.contacts
  for delete using (auth.uid() = user_id);
