create table if not exists chat_conversations (
  id text primary key,
  visitor_token_hash text not null unique,
  customer_id text references customers(id) on delete set null,
  visitor_name text,
  visitor_email text,
  status text not null default 'OPEN',
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id text primary key,
  conversation_id text not null references chat_conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('VISITOR', 'ADMIN', 'SYSTEM')),
  sender_name text,
  body text not null,
  read_by_admin_at timestamptz,
  read_by_visitor_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists chat_conversations_status_idx on chat_conversations(status);
create index if not exists chat_conversations_last_message_at_idx on chat_conversations(last_message_at desc);
create index if not exists chat_messages_conversation_id_idx on chat_messages(conversation_id);
create index if not exists chat_messages_created_at_idx on chat_messages(created_at);
