import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { validateCSV } from '../utils/csvValidator';

interface VideoUploadProps {
  onUpload: (file: File) => void;
  onCancel: () => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUpload, onCancel }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'validating' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadStatus('validating');
    setUploadProgress(0);
    setErrorMessage('');

    try {
      // Validate CSV format
      await validateCSV(file);
      
      setUploadStatus('uploading');
      await onUpload(file);
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process CSV file');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Upload Video Metadata</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
          ${uploadStatus === 'error' ? 'border-red-500' : ''}`}
      >
        <input {...getInputProps()} />
        {uploadStatus === 'validating' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-sm text-gray-600">Validating CSV format...</p>
          </div>
        )}
        {uploadStatus === 'uploading' && (
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
          </div>
        )}
        {uploadStatus === 'success' && (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p className="text-lg text-gray-600">Upload successful!</p>
          </div>
        )}
        {uploadStatus === 'error' && (
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-lg text-red-600 mb-2">Upload failed</p>
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        )}
        {uploadStatus === 'idle' && (
          <>
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-600 mb-2">
              {isDragActive
                ? 'Drop the CSV file here'
                : 'Drag and drop a CSV file here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              CSV should contain: Author, title, source, and video columns
            </p>
          </>
        )}
      </div>

      {uploadStatus !== 'idle' && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {uploadStatus === 'success' ? 'Close' : 'Cancel'}
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoUpload;