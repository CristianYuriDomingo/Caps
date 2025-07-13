'use client';
import { useState, useEffect } from 'react';

// Types
interface Quiz {
  id: string;
  title: string;
  timer: number;
  questions: Question[];
}

interface Question {
  id: string;
  question: string;
  lesson: string;
  image?: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => 
  isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Quiz Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        {children}
      </div>
    </div>
  ) : null;

const QuizCard = ({ quiz, onView, onDelete }: { quiz: Quiz; onView: (quiz: Quiz) => void; onDelete: (quizId: string) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get unique lessons from questions
  const uniqueLessons = [...new Set(quiz.questions.map(q => q.lesson))];

  return (
    <>
      <div className="bg-white rounded-lg shadow border overflow-hidden w-72">
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <div className="text-4xl text-gray-400">🧠</div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{quiz.title}</h3>
          <div className="text-sm text-gray-600 mb-3">
            <div>📚 {uniqueLessons.length > 1 ? `${uniqueLessons.length} lessons` : uniqueLessons[0] || 'No lessons'}</div>
            <div>⏱️ {quiz.timer}s per question</div>
            <div>❓ {quiz.questions.length} questions</div>
          </div>
          
          <button onClick={() => setIsModalOpen(true)} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-medium transition-colors">
            View Quiz
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">{quiz.title}</h3>
          
          <div className="mb-4">
            <p><strong>Lessons:</strong> {uniqueLessons.join(', ')}</p>
            <p><strong>Timer:</strong> {quiz.timer} seconds per question</p>
            <p><strong>Questions:</strong> {quiz.questions.length}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Questions Preview:</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {quiz.questions.map((q, index) => (
                <div key={q.id} className="border rounded p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">{index + 1}. {q.question}</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{q.lesson}</span>
                  </div>
                  {q.image && (
                    <img src={q.image} alt="Question" className="w-32 h-20 object-cover rounded border mb-2" />
                  )}
                  <div className="text-sm space-y-1">
                    {q.options.map((option, optIndex) => (
                      <div key={optIndex} className={`${optIndex === q.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                        {String.fromCharCode(65 + optIndex)}. {option} {optIndex === q.correctAnswer && <span className="text-green-600">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button onClick={() => { onView(quiz); setIsModalOpen(false); }} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
              Edit Quiz
            </button>
            <button onClick={() => { 
              if (confirm(`Are you sure you want to delete "${quiz.title}"?`)) { 
                onDelete(quiz.id); 
                setIsModalOpen(false); 
              } 
            }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
              Delete Quiz
            </button>
            <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const FormField = ({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    {children}
  </div>
);

const QuestionForm = ({ question, onSave, onCancel, questionNumber }: { 
  question?: Question; 
  onSave: (question: Question) => void; 
  onCancel: () => void; 
  questionNumber: number;
}) => {
  const [questionText, setQuestionText] = useState(question?.question || '');
  const [lesson, setLesson] = useState(question?.lesson || '');
  const [options, setOptions] = useState(question?.options || ['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer || 0);
  const [explanation, setExplanation] = useState(question?.explanation || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(question?.image || '');

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!questionText.trim()) return alert('Please enter a question');
    if (!lesson.trim()) return alert('Please enter a lesson');
    if (options.some(opt => !opt.trim())) return alert('Please fill all options');
    
    onSave({
      id: question?.id || Date.now().toString(),
      question: questionText.trim(),
      lesson: lesson.trim(),
      image: imagePreview,
      options: options.map(opt => opt.trim()),
      correctAnswer,
      explanation: explanation.trim()
    });
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-gray-50">
      <h4 className="font-semibold mb-4">Question {questionNumber}</h4>
      
      <FormField label="Question" required>
        <textarea 
          value={questionText} 
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question here..."
          className="w-full border border-gray-300 p-2 rounded h-20 resize-none"
        />
      </FormField>
      
      <FormField label="Lesson" required>
        <input 
          type="text"
          value={lesson} 
          onChange={(e) => setLesson(e.target.value)}
          placeholder="Enter lesson name (e.g., Crime Prevention, Cyber Security, etc.)"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </FormField>
      
      <FormField label="Question Image (Optional)">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Question Preview" className="mt-2 w-32 h-20 object-cover rounded border" />
        )}
      </FormField>
      
      <FormField label="Options" required>
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="radio"
              name={`correct-${questionNumber}`}
              checked={correctAnswer === index}
              onChange={() => setCorrectAnswer(index)}
              className="mr-2"
            />
            <span className="mr-2 font-medium">{String.fromCharCode(65 + index)}.</span>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
              className="flex-1 border border-gray-300 p-2 rounded"
            />
            {correctAnswer === index && <span className="ml-2 text-green-600 font-medium">✓ Correct</span>}
          </div>
        ))}
      </FormField>
      
      <FormField label="Explanation (Optional)">
        <textarea 
          value={explanation} 
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explain why this is the correct answer..."
          className="w-full border border-gray-300 p-2 rounded h-16 resize-none"
        />
      </FormField>
      
      <div className="flex space-x-2">
        <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm">
          Save Question
        </button>
        <button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
};

const AddQuizForm = ({ onClose, onSave, initialQuiz }: { onClose: () => void; onSave: (quiz: Quiz) => void; initialQuiz?: Quiz }) => {
  const [title, setTitle] = useState(initialQuiz?.title || '');
  const [timer, setTimer] = useState(initialQuiz?.timer || 30);
  const [questions, setQuestions] = useState<Question[]>(initialQuiz?.questions || []);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSaveQuestion = (question: Question) => {
    if (editingIndex !== null) {
      const newQuestions = [...questions];
      newQuestions[editingIndex] = question;
      setQuestions(newQuestions);
      setEditingIndex(null);
      setEditingQuestion(null);
    } else {
      setQuestions([...questions, question]);
    }
    setShowAddQuestion(false);
  };

  const handleEditQuestion = (question: Question, index: number) => {
    setEditingQuestion(question);
    setEditingIndex(index);
    setShowAddQuestion(true);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSaveQuiz = async () => {
    if (!title.trim() || questions.length === 0) {
      return alert('Please fill in the quiz title and add at least one question');
    }
    
    setLoading(true);
    
    try {
      const quizData = {
        title: title.trim(),
        timer,
        questions
      };
      
      const response = await fetch(
        initialQuiz ? `/api/admin/quizzes/${initialQuiz.id}` : '/api/admin/quizzes',
        {
          method: initialQuiz ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quizData),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to save quiz');
      }
      
      const savedQuiz = await response.json();
      onSave(savedQuiz);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {initialQuiz ? 'Edit Quiz' : 'Add New Quiz'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <FormField label="Quiz Title" required>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Safety Assessment Quiz"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </FormField>
        
        <FormField label="Timer per Question (seconds)">
          <input 
            type="number" 
            value={timer} 
            onChange={(e) => setTimer(Number(e.target.value))}
            min="10"
            max="300"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </FormField>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold">Questions ({questions.length})</h4>
          <button 
            onClick={() => setShowAddQuestion(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            + Add Question
          </button>
        </div>
        
        {questions.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center text-gray-500">
            No questions added yet. Add at least one question to create the quiz.
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{index + 1}. {question.question}</p>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">{question.lesson}</span>
                    </div>
                    {question.image && (
                      <img src={question.image} alt="Question" className="w-32 h-20 object-cover rounded border mb-2" />
                    )}
                    <div className="text-sm space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className={`${optIndex === question.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                          {String.fromCharCode(65 + optIndex)}. {option} {optIndex === question.correctAnswer && <span className="text-green-600">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => handleEditQuestion(question, index)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteQuestion(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {showAddQuestion && (
        <QuestionForm 
          question={editingQuestion || undefined}
          onSave={handleSaveQuestion}
          onCancel={() => { setShowAddQuestion(false); setEditingQuestion(null); setEditingIndex(null); }}
          questionNumber={editingIndex !== null ? editingIndex + 1 : questions.length + 1}
        />
      )}
      
      <div className="flex space-x-3">
        <button 
          onClick={handleSaveQuiz} 
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : (initialQuiz ? 'Update Quiz' : 'Save Quiz')}
        </button>
        <button 
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch quizzes from API
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/admin/quizzes');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
      } else {
        alert('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz');
    }
  };

  const handleSaveQuiz = (savedQuiz: Quiz) => {
    if (editingQuiz) {
      setQuizzes(quizzes.map(quiz => quiz.id === savedQuiz.id ? savedQuiz : quiz));
      setEditingQuiz(null);
    } else {
      setQuizzes([savedQuiz, ...quizzes]);
    }
    setShowAddQuiz(false);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setShowAddQuiz(true);
  };

  const handleCloseForm = () => {
    setShowAddQuiz(false);
    setEditingQuiz(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quiz Management</h1>
        <button 
          onClick={() => setShowAddQuiz(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add Quiz</span>
        </button>
      </div>

      {showAddQuiz && (
        <AddQuizForm 
          onClose={handleCloseForm}
          onSave={handleSaveQuiz}
          initialQuiz={editingQuiz || undefined}
        />
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Available Quizzes</h2>
        </div>
        <div className="p-6">
          {quizzes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🧠</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes created yet</h3>
              <p className="text-gray-600 mb-6">Create your first quiz to get started</p>
              <button 
                onClick={() => setShowAddQuiz(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
              >
                Create First Quiz
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {quizzes.map((quiz) => (
                <QuizCard 
                  key={quiz.id} 
                  quiz={quiz} 
                  onView={handleEditQuiz}
                  onDelete={handleDeleteQuiz} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}