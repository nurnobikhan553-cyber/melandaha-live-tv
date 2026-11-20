# Melandaha Live TV

Responsive Next.js live-TV portal with a click-to-play poster, HLS player, searchable channel list, category filter and starter admin dashboard.

## Local setup
1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local` and enter Supabase Project URL and anon key.
3. Run `supabase/schema.sql` in Supabase SQL Editor.
4. Run `npm install && npm run dev`.
5. Create an admin in Supabase Auth, then add their UUID to `public.admin_users`.

Use only streams you own or have permission to embed. HLS providers must allow browser playback and CORS from your domain. The current poster is a CSS placeholder; your portrait banner still needs to be added as an image asset.

Deploy by importing this repository into Vercel and setting the two `NEXT_PUBLIC_SUPABASE_*` environment variables.