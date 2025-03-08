/*
  # Update video table policies

  1. Changes
    - Drop existing policies if they exist
    - Create new policies for public access
    - Allow unauthenticated access for all operations
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Videos are viewable by everyone" ON videos;
  DROP POLICY IF EXISTS "Anyone can insert videos" ON videos;
  DROP POLICY IF EXISTS "Anyone can update videos" ON videos;
  DROP POLICY IF EXISTS "Authenticated users can insert videos" ON videos;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create new policies for public access
CREATE POLICY "Allow public select"
  ON videos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert"
  ON videos
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update"
  ON videos
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);