export function validateCSV(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          reject(new Error('Failed to read file'));
          return;
        }

        // Basic validation
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          reject(new Error('CSV must contain a header and at least one data row'));
          return;
        }

        // Validate header
        const header = lines[0].toLowerCase();
        const requiredColumns = ['author', 'title', 'source', 'video'];
        const hasRequiredColumns = requiredColumns.every(col => header.includes(col));

        if (!hasRequiredColumns) {
          reject(new Error('CSV must contain Author, title, source, and video columns'));
          return;
        }

        // Validate at least one valid data row
        let hasValidRow = false;
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const fields = line.match(/(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g) || [];
          if (fields.length >= 4) {
            hasValidRow = true;
            break;
          }
        }

        if (!hasValidRow) {
          reject(new Error('No valid data rows found in CSV'));
          return;
        }

        resolve(true);
      } catch (error) {
        reject(new Error('Invalid CSV format'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}