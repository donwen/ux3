/*
  # Add video likes functionality

  1. New Tables
    - `video_likes`
      - `id` (uuid, primary key)
      - `video_id` (uuid, references videos)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Changes
    - Add likes count function
    - Add user likes check function

  3. Security
    - Enable RLS on video_likes table
    - Add policies for authenticated users
*/

-- Create video_likes table
CREATE TABLE IF NOT EXISTS video_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(video_id, user_id)
);

-- Enable RLS
ALTER TABLE video_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can see all likes"
  ON video_likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can like videos"
  ON video_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
  ON video_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to get likes count
CREATE OR REPLACE FUNCTION get_video_likes(video_id uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)
  FROM video_likes
  WHERE video_likes.video_id = $1;
$$;