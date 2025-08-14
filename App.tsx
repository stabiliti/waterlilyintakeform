
import React, { useState, useCallback, useEffect } from 'react';
import { Survey } from './components/Survey';
import { ReviewScreen } from './components/ReviewScreen';
import { SubmissionScreen } from './components/SubmissionScreen';
import { Answers, UserProfile } from './types';
import { Button } from './components/ui/Button';
import { LoginScreen } from './components/LoginScreen';

type AppState = 'welcome' | 'survey' | 'review' | 'submitted' | 'view_submission';

const USER_SESSION_KEY = 'waterlily-user-session';
const getLocalStorageKey = (userId: string) => `waterlily-survey-answers-${userId}`;

declare global {
  interface Window {
    google: any;
  }
}

const WaterlilyLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10 C 25 10, 10 30, 10 50 C 10 70, 25 90, 50 90 M50 10 C 75 10, 90 30, 90 50 C 90 70, 75 90, 50 90" fill="none" stroke="#4a90e2" strokeWidth="5"/>
    <path d="M30 50 C 30 35, 40 25, 50 25 C 60 25, 70 35, 70 50 C 70 65, 60 75, 50 75 C 40 75, 30 65, 30 50" fill="#a8d0f1"/>
    <circle cx="50" cy="50" r="5" fill="#4a90e2"/>
  </svg>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [answers, setAnswers] = useState<Answers>({});
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUserSession = localStorage.getItem(USER_SESSION_KEY);
    if (savedUserSession) {
      const loggedInUser: UserProfile = JSON.parse(savedUserSession);
      setUser(loggedInUser);

      const savedAnswers = localStorage.getItem(getLocalStorageKey(loggedInUser.id));
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
        setAppState('submitted');
      } else {
        setAppState('welcome');
      }
    }
  }, []);

  const handleLoginSuccess = useCallback((loggedInUser: UserProfile) => {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    const savedAnswers = localStorage.getItem(getLocalStorageKey(loggedInUser.id));
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
      setAppState('submitted');
    } else {
      setAnswers({});
      setAppState('welcome');
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(USER_SESSION_KEY);
    setUser(null);
    setAnswers({});
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  const handleSurveyComplete = useCallback((finalAnswers: Answers) => {
    setAnswers(finalAnswers);
    setAppState('review');
  }, []);

  const handleEdit = useCallback(() => {
    setAppState('survey');
  }, []);

  const handleSubmit = useCallback(() => {
    if (user) {
      localStorage.setItem(getLocalStorageKey(user.id), JSON.stringify(answers));
      setAppState('submitted');
    }
  }, [answers, user]);

  const handleViewSubmission = useCallback(() => {
    if (user) {
      const savedAnswers = localStorage.getItem(getLocalStorageKey(user.id));
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
        setAppState('view_submission');
      }
    }
  }, [user]);
  
  const handleStartOver = () => {
    if(user){
      localStorage.removeItem(getLocalStorageKey(user.id));
      setAnswers({});
      setAppState('welcome');
    }
  }

  const renderContent = () => {
    switch (appState) {
      case 'survey':
        return <Survey onComplete={handleSurveyComplete} />;
      case 'review':
        return <ReviewScreen answers={answers} onEdit={handleEdit} onSubmit={handleSubmit} />;
      case 'submitted':
        return <SubmissionScreen onViewSubmission={handleViewSubmission} />;
      case 'view_submission':
        return <ReviewScreen answers={answers} onEdit={() => {}} onSubmit={() => {}} readOnly={true} />;
      case 'welcome':
      default:
        return (
          <div className="text-center animate-fade-in">
            <WaterlilyLogo className="w-24 h-24 mx-auto mb-4 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
              Help us understand your needs. This information is crucial for our model to predict your future long-term care requirements and costs.
            </p>
            <div className="mt-8">
              <Button onClick={() => setAppState('survey')}>Start Survey</Button>
            </div>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        <div className="text-right">
          <p className="font-semibold text-gray-700">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
        <Button variant="secondary" onClick={handleLogout} className="py-2 px-4">Sign Out</Button>
      </div>

      {renderContent()}

       {(appState === 'view_submission' || appState === 'submitted') && (
        <Button variant="secondary" className="mt-8" onClick={handleStartOver}>
            Start Over
        </Button>
      )}
    </main>
  );
};

export default App;
