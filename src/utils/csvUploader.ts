import { supabase } from '../lib/supabaseClient';
import { Video } from '../types';

export async function uploadCSV(
  file: File,
  onProgress: (progress: number) => void
): Promise<void> {
  const text = await file.text();
  const lines = text.split('\n');
  const videos: Video[] = [];

  // Skip header
  const startIndex = lines[0].toLowerCase().includes('title') ? 1 : 0;

  // Parse CSV
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const [title, description, url, uploadDate, creator] = line.split(',').map(field => field.trim());

    if (title && url && creator) {
      videos.push({
        title,
        description: description || '',
        url,
        uploadDate: uploadDate || new Date().toISOString().split('T')[0],
        creator
      });
    }

    // Report progress
    onProgress((i - startIndex) / (lines.length - startIndex));
  }

  // Upload to Supabase in batches
  const batchSize = 100;
  for (let i = 0; i < videos.length; i += batchSize) {
    const batch = videos.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('videos')
      .upsert(
        batch.map(video => ({
          ...video,
          // Add additional fields for duplicate handling
          unique_key: `${video.url}_${video.creator}`,
        })),
        { onConflict: 'unique_key' }
      );

    if (error) throw new Error('Failed to upload videos to database');
    
    // Update progress for database upload
    onProgress((i + batch.length) / videos.length);
  }
}