import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onContentGenerated }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedContent, setUploadedContent] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    setShowOptions(false);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const text = await file.text();
      
      // Complete the progress
      setUploadProgress(100);
      clearInterval(progressInterval);
      
      // Store the content for later processing
      setUploadedContent(text);
      setShowOptions(true);
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const generateContent = async (type) => {
    if (!uploadedContent) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate generation progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 150);

      // Send to API for processing
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileContent: uploadedContent,
          type: type // 'quiz' or 'flashcard'
        }),
      });

      const data = await response.json();
      
      // Complete the progress
      setUploadProgress(100);
      clearInterval(progressInterval);
      
      // Filter content based on type
      const filteredData = {
        flashcards: type === 'flashcard' ? data.flashcards : [],
        quizzes: type === 'quiz' ? data.quizzes : []
      };
      
      onContentGenerated(filteredData);
      
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Error generating content. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Section */}
      {!showOptions && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 transform ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
              : 'border-gray-300 hover:border-gray-400 hover:shadow-xl'
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Processing file...</p>
            </div>
          ) : (
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400 transition-transform duration-300 transform hover:scale-110"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                {isDragActive
                  ? 'Drop the file here...'
                  : 'Drag & drop a file here, or click to select'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supports TXT, PDF, DOC, DOCX files
              </p>
            </div>
          )}
        </div>
      )}

      {/* Success Message and Options */}
      {uploadedFile && !isUploading && showOptions && (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-800">
                ✓ {uploadedFile.name} uploaded successfully! Choose what you'd like to generate:
              </p>
            </div>
          </div>

          {/* Generation Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Generate Quizzes Option */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Quizzes</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create multiple choice questions to test your knowledge
                </p>
                <button
                  onClick={() => generateContent('quiz')}
                  disabled={isUploading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading ? 'Generating...' : 'Generate Quizzes'}
                </button>
              </div>
            </div>

            {/* Generate Flashcards Option */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Flashcards</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create flashcards for quick review and memorization
                </p>
                <button
                  onClick={() => generateContent('flashcard')}
                  disabled={isUploading}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading ? 'Generating...' : 'Generate Flashcards'}
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar for Generation */}
          {isUploading && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Generating content...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Reset Option */}
          <div className="text-center">
            <button
              onClick={() => {
                setUploadedFile(null);
                setUploadedContent(null);
                setShowOptions(false);
                setUploadProgress(0);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              Upload a different file
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
