import { Video } from '../types';

export function parseCSV(csvText: string): Video[] {
  const lines = csvText.split('\n');
  const videos: Video[] = [];

  // Skip empty lines and validate header
  const nonEmptyLines = lines.filter(line => line.trim());
  if (nonEmptyLines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Get header line and normalize it
  const header = nonEmptyLines[0].toLowerCase();
  const requiredColumns = ['author', 'title', 'source', 'video'];
  const hasRequiredColumns = requiredColumns.every(col => header.includes(col));
  
  if (!hasRequiredColumns) {
    throw new Error('CSV must contain Author, title, source, and video columns');
  }

  // Process data rows
  for (let i = 1; i < nonEmptyLines.length; i++) {
    const line = nonEmptyLines[i].trim();
    if (!line) continue;

    try {
      // Split by comma but preserve commas within quotes
      const fields = line.match(/(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g) || [];
      const cleanFields = fields.map(field => 
        field.replace(/^"|"$/g, '').replace(/""/g, '"').trim()
      );

      // Extract fields
      const [author, title, source, videoUrl] = cleanFields;

      if (!title || !videoUrl) {
        console.warn(`Skipping invalid row ${i + 1}: Missing required fields`);
        continue;
      }

      // Validate video URL
      try {
        new URL(videoUrl);
      } catch {
        console.warn(`Skipping row ${i + 1}: Invalid video URL`);
        continue;
      }

      videos.push({
        title: title,
        description: source || '',
        url: videoUrl,
        uploadDate: new Date().toISOString(),
        creator: author || 'Unknown'
      });
    } catch (error) {
      console.warn(`Error parsing row ${i + 1}:`, error);
      continue;
    }
  }

  if (videos.length === 0) {
    throw new Error('No valid video entries found in CSV');
  }

  return videos;
}