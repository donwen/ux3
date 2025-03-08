/*
  # Update video interactions

  1. Changes
    - Add views count column to videos table
    - Create anonymous likes table without user authentication
    - Add trigger to update views count

  2. Security
    - Enable RLS on new table
    - Allow public access for views and likes
*/

-- Add views count to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS views_count bigint DEFAULT 0;

-- Create anonymous likes table
CREATE TABLE IF NOT EXISTS anonymous_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE anonymous_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public select on anonymous_likes"
  ON anonymous_likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on anonymous_likes"
  ON anonymous_likes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create function to get likes count
CREATE OR REPLACE FUNCTION get_anonymous_likes_count(video_id uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)
  FROM anonymous_likes
  WHERE anonymous_likes.video_id = $1;
$$;

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_video_views(video_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE videos
  SET views_count = views_count + 1
  WHERE id = video_id;
END;
$$;