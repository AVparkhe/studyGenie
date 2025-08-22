'use client';

import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import QuizComponent from '../components/QuizComponent';

export default function Home() {
  const [learningContent, setLearningContent] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [contentType, setContentType] = useState(null); // 'quiz' or 'flashcard'

  const handleContentGenerated = (content) => {
    setLearningContent(content);
    setActiveTab('learn');
    
    // Determine content type based on what was generated
    if (content.quizzes.length > 0 && content.flashcards.length === 0) {
      setContentType('quiz');
    } else if (content.flashcards.length > 0 && content.quizzes.length === 0) {
      setContentType('flashcard');
    } else {
      setContentType('mixed');
    }
  };

  const resetContent = () => {
    setLearningContent(null);
    setContentType(null);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                My Learning Platform
              </h1>
            </div>
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Upload Content
              </button>
              <button
                onClick={() => setActiveTab('learn')}
                disabled={!learningContent}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'learn'
                    ? 'bg-blue-100 text-blue-700'
                    : learningContent 
                      ? 'text-gray-500 hover:text-gray-700'
                      : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                Learn
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'upload' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upload Your Learning Material
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload a document and choose whether to generate quizzes or flashcards 
                to help you learn more effectively.
              </p>
            </div>
            
            <FileUploader onContentGenerated={handleContentGenerated} />
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="px-4 py-6 sm:px-0">
            {learningContent ? (
              <div>
                {/* Content Type Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {contentType === 'quiz' && (
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900">Quiz Mode</h2>
                        </div>
                      )}
                      {contentType === 'flashcard' && (
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900">Flashcard Mode</h2>
                        </div>
                      )}
                      {contentType === 'mixed' && (
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900">Mixed Learning</h2>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={resetContent}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Upload New File
                    </button>
                  </div>
                </div>
                
                <QuizComponent 
                  flashcards={learningContent.flashcards} 
                  quizzes={learningContent.quizzes} 
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No learning content available
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a document first to generate flashcards and quizzes.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Upload Content
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
