import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

export default function SchedulePage({ userId, matchedUserId, matchedUserName, selectedUser }) {
  const passedDate = selectedUser?.date;

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await fetch(`${process.env.REACT_APP_MY_API_BASE}/api/users/${userId}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: [passedDate] })
      });
      await fetch(`${process.env.REACT_APP_MY_API_BASE}/api/users/${matchedUserId}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: [passedDate] })
      });
      const res = await fetch(`${process.env.REACT_APP_MY_API_BASE}/api/users/${userId}/schedule`, {
        method: 'POST'
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Scheduling failed. Please try again.');
      } else {
        setMeeting(json);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  if (meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 p-4 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 max-w-xl w-full">
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">🎉 Interview Scheduled!</h3>
          <p className="text-lg text-slate-700 dark:text-slate-200 mb-2">
            <strong>Time:</strong> {new Date(meeting.time).toLocaleString()}
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-200">
            <strong>Link:</strong>{' '}
            <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {meeting.link}
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => window.location.reload()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Matches
        </Button>

        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white mx-auto mb-4">
              <Calendar className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Schedule Interview
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Confirm your interview with {matchedUserName}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Interview Details
              </h3>

              <div className="space-y-3 text-slate-700 dark:text-slate-300">
                {/* <div className="flex items-center">
                  <span className="font-medium w-32">Your ID:</span>
                  <code className="bg-white dark:bg-slate-700 px-2 py-1 rounded text-sm">{userId}</code>
                </div> */}
                <div className="flex items-center">
                  <span className="font-medium w-32">Interviewer:</span>
                  <span>{matchedUserName}</span>
                </div>
                {/* <div className="flex items-center">
                  <span className="font-medium w-32">Interviewer ID:</span>
                  <code className="bg-white dark:bg-slate-700 px-2 py-1 rounded text-sm">{matchedUserId}</code>
                </div> */}
                {passedDate && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="font-medium w-30">Scheduled:</span>
                    <span>{new Date(passedDate).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              {error && (
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              )}
              <Button
                onClick={handleSchedule}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold w-full"
              >
                {loading ? 'Scheduling...' : 'Confirm & Generate Meeting Link'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
