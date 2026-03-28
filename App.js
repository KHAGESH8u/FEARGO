import React, { useState } from 'react';
import LiveDashboard from './screens/LiveDashboard';
import SessionSummary from './screens/SessionSummary';

export default function App() {
  // Navigation State: 'live' for active dashboard, 'summary' for post-session analytics
  const [currentView, setCurrentView] = useState('live');

  if (currentView === 'summary') {
    return (
      <SessionSummary 
        onRestart={() => setCurrentView('live')} 
      />
    );
  }

  return (
    <LiveDashboard 
      onEndSession={() => setCurrentView('summary')} 
    />
  );
}
