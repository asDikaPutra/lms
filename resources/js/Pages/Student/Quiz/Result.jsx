import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Trophy, CheckCircle, XCircle, Clock, ArrowLeft, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Result({ attempt, courseId }) {
  const totalQuestions = attempt.quiz.questions.length;
  const answers = attempt.answers || {};
  const correctAnswers = Object.values(answers).filter(a => a.is_correct).length;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const passed = percentage >= (attempt.quiz.passing_score || 0);

  const totalTime = Object.values(answers).reduce((sum, a) => sum + (a.time_taken || 0), 0);
  const courseUrl = courseId ? `/student/courses/${courseId}` : '/student/courses';

  return (
    <>
      <Head title="Hasil Quiz" />

      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Score Card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6"
          >
            {/* Header */}
            <div className={`p-12 text-center ${
              passed 
                ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                : 'bg-gradient-to-br from-amber-400 to-orange-500'
            }`}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Trophy className={`w-12 h-12 ${passed ? 'text-green-600' : 'text-orange-600'}`} />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-white mb-2"
              >
                {passed ? '🎉 Selamat!' : '💪 Tetap Semangat!'}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-7xl font-bold text-white mb-2"
              >
                {attempt.score}
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-2xl text-white/90"
              >
                {correctAnswers} / {totalQuestions} benar ({percentage}%)
              </motion.p>
            </div>

            <div className="p-8">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center"
                >
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-900">{correctAnswers}</div>
                  <div className="text-sm text-green-700 font-medium">Benar</div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 text-center"
                >
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-red-900">
                    {totalQuestions - correctAnswers}
                  </div>
                  <div className="text-sm text-red-700 font-medium">Salah</div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center"
                >
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-900">{totalTime}s</div>
                  <div className="text-sm text-blue-700 font-medium">Total Waktu</div>
                </motion.div>
              </div>

              {/* Question Review */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Review Jawaban
                </h3>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {attempt.quiz.questions.map((question, index) => {
                    const answer = answers[question.id];
                    const isCorrect = answer?.is_correct || false;

                    return (
                      <motion.div
                        key={question.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 + index * 0.05 }}
                        className={`border-2 rounded-xl p-4 ${
                          isCorrect 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-red-300 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCorrect ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <XCircle className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 mb-2">
                              {index + 1}. {question.question}
                            </div>
                            <div className="space-y-1 text-sm">
                              <div>
                                <span className="font-semibold text-gray-700">Jawaban Anda:</span>{' '}
                                <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                  {answer?.answer || 'Tidak dijawab'}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div>
                                  <span className="font-semibold text-gray-700">Jawaban Benar:</span>{' '}
                                  <span className="font-medium text-green-700">{question.correct_answer}</span>
                                </div>
                              )}
                              <div className="text-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {answer?.time_taken || 0}s
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-8"
              >
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg py-6 rounded-2xl font-bold"
                >
                  <Link href={courseUrl}>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Kembali ke Pembelajaran
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
