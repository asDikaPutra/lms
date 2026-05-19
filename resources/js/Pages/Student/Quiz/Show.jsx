import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Clock, Trophy, ListChecks, Play, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Show({ quiz, userAttempts, canAttempt }) {
  const [starting, setStarting] = useState(false);

  const handleStart = () => {
    setStarting(true);
    router.post(`/student/quizzes/${quiz.id}/start`);
  };

  return (
    <>
      <Head title={quiz.title} />

      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 py-12 px-4">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto mb-6">
          <button
            onClick={() => router.visit('/student/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Trophy className="w-10 h-10 text-purple-600" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
              <p className="text-purple-100 text-lg">
                Siap untuk menguji pengetahuan Anda?
              </p>
            </div>

            <div className="p-8">
              {/* Quiz Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center"
                >
                  <ListChecks className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-900">
                    {quiz.questions?.length || 0}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">Soal</div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 text-center"
                >
                  <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-amber-900">
                    {quiz.duration || 'N/A'}
                  </div>
                  <div className="text-sm text-amber-700 font-medium">Menit</div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center"
                >
                  <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-900">
                    {quiz.passing_score || 0}%
                  </div>
                  <div className="text-sm text-green-700 font-medium">Lulus</div>
                </motion.div>
              </div>

              {/* Attempts Info */}
              {quiz.max_attempts && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6"
                >
                  <div className="text-amber-900 font-semibold text-center">
                    Percobaan: {userAttempts} / {quiz.max_attempts}
                  </div>
                </motion.div>
              )}

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-50 rounded-xl p-6 mb-8"
              >
                <h3 className="font-bold text-gray-900 mb-3 text-lg">📋 Instruksi:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Jawab setiap pertanyaan dalam batas waktu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Feedback langsung setelah menjawab</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Tidak bisa mengubah jawaban setelah submit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Kumpulkan poin sebanyak-banyaknya!</span>
                  </li>
                </ul>
              </motion.div>

              {/* Start Button */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {canAttempt ? (
                  <Button
                    onClick={handleStart}
                    disabled={starting}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xl py-8 rounded-2xl font-bold shadow-lg"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    {starting ? 'Memulai...' : 'Mulai Quiz Sekarang!'}
                  </Button>
                ) : (
                  <div className="text-center text-red-600 font-bold bg-red-50 p-4 rounded-xl">
                    Anda telah mencapai batas maksimal percobaan untuk quiz ini.
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
