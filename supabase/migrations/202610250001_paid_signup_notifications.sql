create table if not exists public.paid_signup_notifications (
  stripe_session_id text primary key,
  event_id text not null,
  email text,
  notification_status text not null default 'processing'
    check (notification_status in ('processing','sent')),
  provider_message_id text,
  created_at timestamptz not null default now(),
  delivered_at timestamptz
);
alter table public.paid_signup_notifications enable row level security;
revoke all on public.paid_signup_notifications from anon, authenticated;
