import React, { useState } from 'react';
import { View, Text } from 'react-native';

// Import Screens
import RoleSelection from './screens/RoleSelection';
import TeacherHome from './screens/TeacherHome';
import LiveDashboard from './screens/LiveDashboard';
import SessionSummary from './screens/SessionSummary';
import StudentJoin from './screens/StudentJoin';
import StudentDashboard from './screens/StudentDashboard';
import StudentAskDoubts from './screens/StudentAskDoubts';
import StudentPulseCheck from './screens/StudentPulseCheck';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('roleSelection');
  
  // Shared Data State
  const [sessionCode, setSessionCode] = useState('');

  // ==========================
  // VIEW: ROLE SELECTION
  // ==========================
  if (currentView === 'roleSelection') {
    return (
      <RoleSelection
        onSelectRole={(role) => {
          if (role === 'teacher') setCurrentView('teacherHome');
          if (role === 'student') setCurrentView('studentJoin');
        }}
      />
    );
  }

  // ==========================
  // TEACHER FLOW
  // ==========================
  if (currentView === 'teacherHome') {
    return (
      <TeacherHome
        onCreateSession={() => setCurrentView('liveDashboard')}
        onViewSummary={() => setCurrentView('sessionSummary')}
        onBack={() => setCurrentView('roleSelection')}
      />
    );
  }
  if (currentView === 'liveDashboard') {
    return (
      <LiveDashboard 
        onEndSession={() => setCurrentView('sessionSummary')}
        onBack={() => setCurrentView('roleSelection')}
      />
    );
  }

  if (currentView === 'sessionSummary') {
    return (
      <SessionSummary 
        onRestart={() => setCurrentView('liveDashboard')}
        onBack={() => setCurrentView('liveDashboard')}
      />
    );
  }

  // ==========================
  // STUDENT FLOW
  // ==========================
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

  // Fallback Error Case
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Error: Unknown Route `{currentView}`</Text>
    </View>
  );
}
