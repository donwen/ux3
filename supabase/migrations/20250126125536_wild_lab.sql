/*
  # Create videos table schema

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `url` (text, not null)
      - `upload_date` (timestamptz)
      - `creator` (text, not null)
      - `created_at` (timestamptz)
      - `unique_key` (text, unique) - Prevents duplicate videos

  2. Security
    - Enable RLS on `videos` table
    - Add policies for:
      - Public read access
      - Authenticated users can insert
*/

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  upload_date timestamptz DEFAULT now(),
  creator text NOT NULL,
  created_at timestamptz DEFAULT now(),
  unique_key text GENERATED ALWAYS AS (url || '_' || creator) STORED UNIQUE
);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Videos are viewable by everyone"
  ON videos
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);