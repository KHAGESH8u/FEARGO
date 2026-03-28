import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';

// --- IMPORT SCREENS ---
import RoleSelection from './screens/RoleSelection';

// Teacher Screens
import TeacherLogin from './screens/TeacherLogin';
import TeacherHome from './screens/TeacherHome';
import LiveDashboard from './screens/LiveDashboard';
import SessionSummary from './screens/SessionSummary';
import TeacherQuizCreation from './screens/TeacherQuizCreation';
import TeacherQuizResults from './screens/TeacherQuizResults';

// Student Screens
import StudentJoin from './screens/StudentJoin';
import StudentAskDoubts from './screens/StudentAskDoubts';
import StudentPulseCheck from './screens/StudentPulseCheck';
import StudentMCQ from './screens/StudentMCQ';

export default function App() {
  const [currentView, setCurrentView] = useState('roleSelection');
  const [sessionCode, setSessionCode] = useState('');
  const [activeSession, setActiveSession] = useState(null); 
  
  // NEW: Store the logged-in teacher's credentials
  const [currentUser, setCurrentUser] = useState(null); 

  if (currentView === 'roleSelection') {
    return (
      <RoleSelection
        onSelectRole={(role) => {
          // Route teachers to login, route students straight to join
          if (role === 'teacher') setCurrentView('teacherLogin');
          if (role === 'student') setCurrentView('studentJoin');
        }}
      />
    );
  }

  // --- NEW: TEACHER LOGIN ROUTE ---
  if (currentView === 'teacherLogin') {
    return (
      <TeacherLogin
        onLogin={(user) => {
          setCurrentUser(user); // Save the Supabase user ID
          setCurrentView('teacherHome'); // Move to Dashboard
        }}
        onBack={() => setCurrentView('roleSelection')}
      />
    );
  }

  if (currentView === 'teacherHome') {
    return (
      <TeacherHome
        user={currentUser} // Pass the user to attach to the session
        onCreateSession={(sessionData) => {
          setActiveSession(sessionData); 
          setCurrentView('liveDashboard');
        }}
        onViewSummary={() => setCurrentView('sessionSummary')}
        onBack={() => {
          setCurrentUser(null); // "Logout" if they go back
          setCurrentView('roleSelection');
        }}
      />
    );
  }

  if (currentView === 'liveDashboard') {
    return (
      <LiveDashboard 
        session={activeSession}
        onEndSession={() => setCurrentView('sessionSummary')}
        onBack={() => setCurrentView('teacherHome')}
        // NEW: Quiz Routing
        onCreateQuiz={() => setCurrentView('teacherQuizCreation')}
        onLiveQuiz={() => setCurrentView('teacherQuizResults')}
      />
    );
  }

  // --- NEW: TEACHER QUIZ ROUTES ---
  if (currentView === 'teacherQuizCreation') {
    return (
      <TeacherQuizCreation 
        session={activeSession}
        onPublish={() => setCurrentView('liveDashboard')}
        onBack={() => setCurrentView('liveDashboard')}
      />
    );
  }

  if (currentView === 'teacherQuizResults') {
    return (
      <TeacherQuizResults 
        session={activeSession}
        onBack={() => setCurrentView('liveDashboard')}
      />
    );
  }

  if (currentView === 'sessionSummary') {
    return (
      <SessionSummary 
        session={activeSession}
        onRestart={() => setCurrentView('teacherHome')}
        onBack={() => setCurrentView('teacherHome')}
      />
    );
  }

  // --- STUDENT ROUTES ---
  if (currentView === 'studentJoin') {
    return (
      <StudentJoin 
        onJoin={(code) => {
          setSessionCode(code);
          setCurrentView('studentAskDoubts');
        }}
        onBack={() => setCurrentView('roleSelection')}
      />
    );
  }

  if (currentView === 'studentAskDoubts') {
    return (
      <StudentAskDoubts
        sessionCode={sessionCode}
        onLeave={() => {
          setSessionCode('');
          setCurrentView('studentJoin');
        }}
        onPulseCheck={() => setCurrentView('studentPulseCheck')}
        // NEW: Navigate to the student MCQ screen when they click the banner
        onViewQuiz={() => setCurrentView('studentMCQ')}
      />
    );
  }

  if (currentView === 'studentPulseCheck') {
    return (
      <StudentPulseCheck
        sessionCode={sessionCode}
        onBack={() => setCurrentView('studentAskDoubts')}
        onLeave={() => {
          setSessionCode('');
          setCurrentView('studentJoin');
        }}
      />
    );
  }

  // --- NEW: STUDENT MCQ ROUTE ---
  if (currentView === 'studentMCQ') {
    return (
      <StudentMCQ
        sessionCode={sessionCode}
        onBack={() => setCurrentView('studentAskDoubts')}
        onLeave={() => {
          setSessionCode('');
          setCurrentView('studentJoin');
        }}
      />
    );
  }

  // Fallback for bad routes
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Error: Unknown Route `{currentView}`</Text>
    </SafeAreaView>
  );
}