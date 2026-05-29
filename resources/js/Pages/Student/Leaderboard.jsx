import { Head, Link } from '@inertiajs/react';
import { Trophy, Medal, Award } from 'lucide-react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Leaderboard({ leaderboard }) {
  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  };

  return (
    <StudentLayout>
      <Head title="Leaderboard" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Top 10 Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 rounded-lg border border-line bg-surface p-4"
                >
                  <div className="flex w-8 items-center justify-center text-lg font-bold text-content-primary">
                    {getRankIcon(index) || index + 1}
                  </div>
                  <Avatar>
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-content-primary">{student.name}</div>
                    <div className="text-sm text-content-secondary">{student.nim}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-content-primary">{student.total_score}</div>
                    <div className="text-xs text-content-secondary">poin</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
