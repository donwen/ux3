/*
  # Add likes count to videos table

  1. Changes
    - Add likes_count column to videos table
    - Create function to get total likes count
    - Create function to update likes count
    - Create trigger to automatically update likes count

  2. Security
    - Functions are marked as SECURITY DEFINER to ensure they can always run
*/

-- Add likes count column if it doesn't exist
ALTER TABLE videos ADD COLUMN IF NOT EXISTS likes_count bigint DEFAULT 0;

-- Create function to get total likes count
CREATE OR REPLACE FUNCTION get_total_likes_count(video_id uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)
  FROM anonymous_likes
  WHERE anonymous_likes.video_id = $1;
$$;

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_video_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE videos
    SET likes_count = likes_count + 1
    WHERE id = NEW.video_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE videos
    SET likes_count = likes_count - 1
    WHERE id = OLD.video_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for likes count updates
DROP TRIGGER IF EXISTS update_video_likes_count_trigger ON anonymous_likes;
CREATE TRIGGER update_video_likes_count_trigger
  AFTER INSERT OR DELETE ON anonymous_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_video_likes_count();

-- Update existing likes counts
UPDATE videos v
SET likes_count = (
  SELECT COUNT(*)
  FROM anonymous_likes al
  WHERE al.video_id = v.id
);