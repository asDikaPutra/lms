import { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/Components/ui/progress';

const ANSWER_COLORS = [
  { bg: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-white', icon: '△' },
  { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', text: 'text-white', icon: '◇' },
  { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', text: 'text-white', icon: '○' },
  { bg: 'bg-green-500', hover: 'hover:bg-green-600', text: 'text-white', icon: '□' },
];

export default function QuizPlay({ attemptId, initialQuestionNumber = 1 }) {
  const [question, setQuestion] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestionNumber);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/student/quiz-attempts/${attemptId}/questions/${currentQuestion}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setQuestion(data.question);
      setTotalQuestions(data.total);
      setTimeLeft(data.question.time_limit);
      setStartTime(Date.now());
      setSelectedAnswer(null);
      setShowFeedback(false);
      setFeedback(null);
    } catch (error) {
      console.error('Failed to load question:', error);
      alert('Gagal memuat soal. Silakan refresh halaman.');
    } finally {
      setLoading(false);
    }
  }, [attemptId, currentQuestion]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  useEffect(() => {
    if (timeLeft <= 0 || showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showFeedback]);

  const handleTimeout = async () => {
    if (showFeedback) return;
    
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      const response = await fetch(
        `/student/quiz-attempts/${attemptId}/questions/${currentQuestion}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          },
          body: JSON.stringify({
            answer: null,
            time_taken: timeTaken,
          }),
        }
      );

      const data = await response.json();
      setFeedback(data);
      setShowFeedback(true);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleAnswerSelect = async (answer) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await fetch(
        `/student/quiz-attempts/${attemptId}/questions/${currentQuestion}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          },
          body: JSON.stringify({
            answer,
            time_taken: timeTaken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFeedback(data);
      setShowFeedback(true);
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Gagal submit jawaban. Silakan coba lagi.');
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      const response = await fetch(`/student/quiz-attempts/${attemptId}/finish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Quiz finished:', data);
      router.visit(`/student/quiz-attempts/${attemptId}/result`);
    } catch (error) {
      console.error('Failed to finish quiz:', error);
      alert('Gagal menyelesaikan quiz. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-white text-2xl font-bold"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between text-white mb-4">
          <div className="text-lg font-bold">
            {currentQuestion} / {totalQuestions}
          </div>
          <motion.div
            animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 0.5 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeLeft <= 5 ? 'bg-red-500' : 'bg-white/20'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-2xl font-bold">{timeLeft}</span>
          </motion.div>
        </div>
        <Progress value={progressPercentage} className="h-3 bg-white/20" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        {!showFeedback ? (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="max-w-5xl mx-auto"
          >
            {/* Question */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-8 mb-6 min-h-[200px] flex items-center justify-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
                {question?.question}
              </h2>
            </motion.div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question?.options?.map((option, index) => {
                const colors = ANSWER_COLORS[index % ANSWER_COLORS.length];
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswerSelect(option)}
                    className={`${colors.bg} ${colors.hover} ${colors.text} p-6 rounded-2xl text-left font-bold text-lg shadow-lg transition-all relative overflow-hidden group`}
                  >
                    <div className="absolute top-4 left-4 text-3xl opacity-50">
                      {colors.icon}
                    </div>
                    <div className="pl-12">
                      {option}
                    </div>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`feedback-${currentQuestion}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className={`rounded-3xl shadow-2xl p-12 mb-6 ${
                feedback?.is_correct ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              <div className="text-center text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="text-8xl font-bold mb-4"
                >
                  {feedback?.is_correct ? '✓' : '✗'}
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold mb-4"
                >
                  {feedback?.is_correct ? 'Benar!' : 'Salah!'}
                </motion.h2>
                {!feedback?.is_correct && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl"
                  >
                    Jawaban benar: <span className="font-bold">{feedback?.correct_answer}</span>
                  </motion.div>
                )}
                {feedback?.is_correct && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-2 text-2xl"
                  >
                    <Zap className="w-6 h-6" />
                    <span>+{feedback?.points || 100} poin</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <div className="text-center">
              <Button
                onClick={handleNext}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-6 rounded-full font-bold shadow-lg"
              >
                {currentQuestion < totalQuestions ? 'Lanjut' : 'Lihat Hasil'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
