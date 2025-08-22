import React, { useState } from 'react';

const QuizComponent = ({ flashcards = [], quizzes = [] }) => {
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResults, setQuizResults] = useState({});

  const handleFlashcardNext = () => {
    setShowAnswer(false);
    setCurrentFlashcardIndex((prev) => 
      prev < flashcards.length - 1 ? prev + 1 : 0
    );
  };

  const handleFlashcardPrev = () => {
    setShowAnswer(false);
    setCurrentFlashcardIndex((prev) => 
      prev > 0 ? prev - 1 : flashcards.length - 1
    );
  };

  const handleQuizAnswer = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === quizzes[currentQuizIndex].answer;
    setQuizResults(prev => ({
      ...prev,
      [currentQuizIndex]: isCorrect
    }));
  };

  const handleQuizNext = () => {
    setSelectedAnswer(null);
    setCurrentQuizIndex((prev) => 
      prev < quizzes.length - 1 ? prev + 1 : 0
    );
  };

  const handleQuizPrev = () => {
    setSelectedAnswer(null);
    setCurrentQuizIndex((prev) => 
      prev > 0 ? prev - 1 : quizzes.length - 1
    );
  };

  if (flashcards.length === 0 && quizzes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No learning content available. Upload a file to get started!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Flashcards Section */}
      {flashcards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Flashcards</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500">
                {currentFlashcardIndex + 1} of {flashcards.length}
              </span>
            </div>
            
            <div className="min-h-[200px] flex flex-col justify-center">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  {flashcards[currentFlashcardIndex]?.question}
                </h3>
                {showAnswer && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">
                      {flashcards[currentFlashcardIndex]?.answer}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleFlashcardPrev}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
                <button
                  onClick={handleFlashcardNext}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Section */}
      {quizzes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Quiz</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500">
                Question {currentQuizIndex + 1} of {quizzes.length}
              </span>
            </div>
            
            <div className="min-h-[200px] flex flex-col justify-center">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-700">
                  {quizzes[currentQuizIndex]?.question}
                </h3>
                
                <div className="space-y-3">
                  {quizzes[currentQuizIndex]?.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 text-left rounded-lg border transition-colors ${
                        selectedAnswer === option
                          ? option === quizzes[currentQuizIndex].answer
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : 'bg-red-100 border-red-500 text-red-800'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {selectedAnswer && (
                  <div className="mt-4 p-4 rounded-lg text-center">
                    {selectedAnswer === quizzes[currentQuizIndex].answer ? (
                      <p className="text-green-600 font-semibold">✓ Correct!</p>
                    ) : (
                      <p className="text-red-600 font-semibold">
                        ✗ Incorrect. The correct answer is: {quizzes[currentQuizIndex].answer}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleQuizPrev}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleQuizNext}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
