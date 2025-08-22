export default function handler(req, res) {
  if (req.method === 'POST') {
    const { fileContent, type } = req.body;
    
    // Simple content analysis and generation
    const sentences = fileContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const words = fileContent.split(/\s+/).filter(w => w.length > 3);
    
    let flashcards = [];
    let quizzes = [];
    
    if (type === 'flashcard' || !type) {
      // Generate flashcards based on content
      for (let i = 0; i < Math.min(5, sentences.length); i++) {
        const sentence = sentences[i].trim();
        if (sentence.length > 20) {
          const words = sentence.split(' ');
          const keyWord = words.find(w => w.length > 5) || words[Math.floor(words.length / 2)];
          
          flashcards.push({
            question: `What is the main concept discussed in: "${sentence.substring(0, 50)}..."?`,
            answer: `The text discusses ${keyWord} and its related concepts.`
          });
        }
      }
      
      // Add some default flashcards if not enough was generated
      if (flashcards.length === 0) {
        flashcards.push(
          { question: 'What is the main topic of this document?', answer: 'The document covers various learning concepts and materials.' },
          { question: 'How can you best study this material?', answer: 'Review the content multiple times and test your understanding with practice questions.' },
          { question: 'What are the key points to remember?', answer: 'Focus on understanding the main concepts and their relationships to each other.' }
        );
      }
    }
    
    if (type === 'quiz' || !type) {
      // Generate quizzes based on content
      for (let i = 0; i < Math.min(3, sentences.length); i++) {
        const sentence = sentences[i].trim();
        if (sentence.length > 15) {
          const options = [
            'True',
            'False',
            'Partially correct',
            'Not mentioned'
          ];
          
          quizzes.push({
            question: `Based on the content: "${sentence.substring(0, 60)}..."`,
            options: options,
            answer: options[Math.floor(Math.random() * 2)] // Randomly choose True or False
          });
        }
      }
      
      // Add some default quizzes if not enough was generated
      if (quizzes.length === 0) {
        quizzes.push(
          {
            question: 'Is it important to review learning materials multiple times?',
            options: ['Yes', 'No', 'Sometimes', 'Never'],
            answer: 'Yes'
          },
          {
            question: 'Should you test your understanding after studying?',
            options: ['Always', 'Sometimes', 'Rarely', 'Never'],
            answer: 'Always'
          },
          {
            question: 'Does active learning improve retention?',
            options: ['Significantly', 'Slightly', 'Not at all', 'It depends'],
            answer: 'Significantly'
          }
        );
      }
    }
    
    res.status(200).json({ flashcards, quizzes });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
  