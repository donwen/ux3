/*
  # Add comments functionality

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `video_id` (uuid, foreign key to videos)
      - `content` (text)
      - `author_name` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on comments table
    - Add policies for:
      - Public read access to all comments
      - Public insert access for new comments
      - No update/delete access
*/

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  content text NOT NULL,
  author_name text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can view comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS comments_video_id_idx ON comments(video_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);