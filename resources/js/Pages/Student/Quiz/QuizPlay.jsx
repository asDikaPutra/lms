import { Head } from '@inertiajs/react';
import QuizPlay from './Play';

export default function QuizPlayPage({ attemptId, questionNumber }) {
  return (
    <>
      <Head title="Quiz">
        <meta name="csrf-token" content={document.head.querySelector('meta[name="csrf-token"]')?.content || ''} />
      </Head>
      <QuizPlay attemptId={attemptId} initialQuestionNumber={questionNumber} />
    </>
  );
}
