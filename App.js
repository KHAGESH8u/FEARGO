import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Alert, Platform } from 'react-native';
import { supabase } from './utils/supabase';

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
  const [currentUser, setCurrentUser] = useState(null); 

  // --- FIX 3: GLOBAL STUDENT RADAR ---
  const [studentSessionId, setStudentSessionId] = useState(null);

  // 1. Get the DB ID when a student joins
  useEffect(() => {
    if (!sessionCode) {
      setStudentSessionId(null);
      return;
    }
    const fetchId = async () => {
      const { data } = await supabase.from('sessions').select('id').eq('code', sessionCode).single();
      if (data) setStudentSessionId(data.id);
    }
    fetchId();
  }, [sessionCode]);

  // 2. Listen globally to events for this session!
  useEffect(() => {
    if (!studentSessionId) return;

    // Listen for Auto-Kick (Session Ended)
    const sessionSub = supabase.channel('global:session')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${studentSessionId}` }, (payload) => {
        if (payload.new.is_active === false) {
           if(Platform.OS === 'web') alert("The teacher has ended this session."); 
           else Alert.alert("Session Ended", "The teacher has closed this session.");
           setSessionCode(''); // Clear code
           setCurrentView('studentJoin'); // Kick to join screen
        }
      }).subscribe();

    // Listen for Pulse Checks (Auto-Redirect)
    const pulseSub = supabase.channel('global:pulses')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pulses', filter: `session_id=eq.${studentSessionId}` }, () => {
         setCurrentView('studentPulseCheck'); 
      }).subscribe();

    // Listen for Quizzes (Show global alert)
    const quizSub = supabase.channel('global:quizzes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quizzes', filter: `session_id=eq.${studentSessionId}` }, (payload) => {
         if (payload.new.is_active) {
            if(Platform.OS === 'web') {
               if(window.confirm("Live Quiz Active! The teacher has started a new quiz. Join now?")) {
                 setCurrentView('studentMCQ');
               }
            } else {
               Alert.alert("Live Quiz Active!", "The teacher has started a new quiz.", [
                 { text: "Dismiss", style: "cancel" },
                 { text: "Join Quiz", onPress: () => setCurrentView('studentMCQ') }
               ]);
            }
         }
      }).subscribe();

    return () => {
      supabase.removeChannel(sessionSub);
      supabase.removeChannel(pulseSub);
      supabase.removeChannel(quizSub);
    };
  }, [studentSessionId]);

  // --- ROUTING LOGIC ---
  if (currentView === 'roleSelection') {
    return (
      <RoleSelection
        onSelectRole={(role) => {
          if (role === 'teacher') setCurrentView('teacherLogin');
          if (role === 'student') setCurrentView('studentJoin');
        }}
      />
    );
  }

  // --- TEACHER ROUTES ---
  if (currentView === 'teacherLogin') {
    return (
      <TeacherLogin
        onLogin={(user) => {
          setCurrentUser(user); 
          setCurrentView('teacherHome'); 
        }}
        onBack={() => setCurrentView('roleSelection')}
      />
    );
  }

  if (currentView === 'teacherHome') {
    return (
      <TeacherHome
        user={currentUser} 
        onCreateSession={(sessionData) => {
          setActiveSession(sessionData); 
          setCurrentView('liveDashboard');
        }}
        onViewSummary={() => setCurrentView('sessionSummary')}
        onBack={() => {
          setCurrentUser(null); 
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
        onCreateQuiz={() => setCurrentView('teacherQuizCreation')}
        onLiveQuiz={() => setCurrentView('teacherQuizResults')}
      />
    );
  }

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

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Error: Unknown Route `{currentView}`</Text>
    </SafeAreaView>
  );
}