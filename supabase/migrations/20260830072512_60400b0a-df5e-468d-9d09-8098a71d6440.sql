ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS service text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS client_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS client_rating smallint;

ALTER TABLE public.posts
  ADD CONSTRAINT posts_client_rating_range CHECK (client_rating IS NULL OR (client_rating >= 1 AND client_rating <= 5));