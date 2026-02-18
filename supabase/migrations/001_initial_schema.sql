-- Profiles (extends Supabase Auth users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;
create policy "Users can read own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- JD Analyses
create table public.jd_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  raw_text text not null,
  company text,
  role_title text,
  parsed_skills text[] default '{}',
  parsed_responsibilities text[] default '{}',
  parsed_qualifications text[] default '{}',
  seniority_level text,
  created_at timestamptz default now() not null
);

alter table public.jd_analyses enable row level security;
create policy "Users can CRUD own JD analyses" on public.jd_analyses
  for all using (auth.uid() = user_id);

-- Interview Sessions
create table public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  jd_analysis_id uuid not null references public.jd_analyses(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  interview_type text not null default 'mixed' check (interview_type in ('behavioral', 'technical', 'mixed')),
  total_questions int not null default 5,
  current_question_index int not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now() not null
);

alter table public.interview_sessions enable row level security;
create policy "Users can CRUD own sessions" on public.interview_sessions
  for all using (auth.uid() = user_id);

-- Questions
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.interview_sessions(id) on delete cascade,
  question_text text not null,
  question_type text not null check (question_type in ('behavioral', 'technical', 'situational')),
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  skill_tags text[] default '{}',
  user_answer text,
  ai_feedback text,
  score int check (score between 0 and 10),
  order_index int not null default 0,
  created_at timestamptz default now() not null
);

alter table public.questions enable row level security;
create policy "Users can CRUD own questions" on public.questions
  for all using (
    exists (
      select 1 from public.interview_sessions s
      where s.id = questions.session_id
        and s.user_id = auth.uid()
    )
  );

-- Indexes
create index idx_jd_analyses_user on public.jd_analyses(user_id);
create index idx_sessions_user on public.interview_sessions(user_id);
create index idx_sessions_jd on public.interview_sessions(jd_analysis_id);
create index idx_questions_session on public.questions(session_id);

-- Storage bucket for resume/JD uploads
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

create policy "Users can upload own docs" on storage.objects
  for insert with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read own docs" on storage.objects
  for select using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own docs" on storage.objects
  for delete using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
