# FictPlay — Chat with Characters

Create AI characters with names, profile pictures, descriptions, personalities, and extras. Chat 1:1 or in groups using your saved bots. Includes Supabase email/password authentication, attachments (images, videos, GIFs, links), and stubs for GPT and TensorFlow.js integrations.

## Quick start

1) Copy config.example.js to config.js and fill in keys

```bash
cp public/scripts/config.example.js public/scripts/config.js
```

Then edit `public/scripts/config.js`:
- Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` (from Supabase)
- Optional: `OPENAI_API_KEY` for local testing only (do not ship to web)

2) Serve the `public/` directory

```bash
npx serve public
```

3) (Optional) Create Supabase tables for persistence

```sql
create table bots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  pfp_url text,
  description text,
  personality text,
  extras jsonb,
  created_at timestamp with time zone default now()
);

create table chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  is_group boolean not null default false,
  title text,
  bot_ids uuid[] default '{}',
  created_at timestamp with time zone default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats on delete cascade not null,
  role text check (role in ('user','bot')) not null,
  bot_id uuid,
  content text,
  attachments jsonb,
  created_at timestamp with time zone default now()
);
```

## Pages

- index.html — landing and nav
- login.html — Supabase email/password
- characters.html — create and manage bots
- chat.html — single chat
- group.html — group chat

## Attachments

You can attach images, videos, and files. For persistence, configure Supabase Storage and update `public/scripts/dataStore.js` to upload files and save URLs.
