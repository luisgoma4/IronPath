
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import RoutineManager from './components/Routines/RoutineManager';
import WorkoutTracker from './components/Workouts/WorkoutTracker';
import HistoryView from './components/History/HistoryView';
import Profile from './components/Profile/Profile';
import { UserProfile, WorkoutSession, Routine, ProgressionModel } from './types';

// Initial Mock Data
const DEFAULT_USER: UserProfile = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  age: 28,
  weight: 82.5,
  height: 180,
  trainingGoal: 'HYPERTROPHY',
  settings: {
    progressionPercentage: 2.5,
    plateIncrement: 1.25,
    deloadThreshold: 2,
    minRpeThreshold: 7,
  }
};

const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'r1',
    name: 'Push Day A',
    description: 'Chest, Shoulders, and Triceps focus',
    assignedDays: [1, 4],
    exercises: [
      { id: 'e1', name: 'Bench Press', targetSets: 3, targetReps: '8-12', restTime: 120, progressionModel: ProgressionModel.LINEAR },
      { id: 'e2', name: 'Overhead Press', targetSets: 3, targetReps: '10-12', restTime: 90, progressionModel: ProgressionModel.LINEAR },
      { id: 'e3', name: 'Lateral Raises', targetSets: 4, targetReps: '12-15', restTime: 60, progressionModel: ProgressionModel.LINEAR },
    ]
  },
  {
    id: 'r2',
    name: 'Pull Day A',
    description: 'Back and Biceps focus',
    assignedDays: [2, 5],
    exercises: [
      { id: 'e4', name: 'Barbell Rows', targetSets: 3, targetReps: '8-10', restTime: 120, progressionModel: ProgressionModel.LINEAR },
      { id: 'e5', name: 'Pull Ups', targetSets: 3, targetReps: '8-12', restTime: 90, progressionModel: ProgressionModel.LINEAR },
      { id: 'e6', name: 'Barbell Curls', targetSets: 3, targetReps: '10-12', restTime: 60, progressionModel: ProgressionModel.LINEAR },
    ]
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [routines, setRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem('ip_routines');
    return saved ? JSON.parse(saved) : INITIAL_ROUTINES;
  });
  const [workouts, setWorkouts] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem('ip_workouts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ip_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('ip_workouts', JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = (session: WorkoutSession) => {
    setWorkouts(prev => [session, ...prev]);
  };

  return (
    <HashRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard user={user} workouts={workouts} routines={routines} />} />
            <Route path="/routines" element={<RoutineManager routines={routines} setRoutines={setRoutines} />} />
            <Route path="/workout/:routineId" element={<WorkoutTracker routines={routines} workouts={workouts} addWorkout={addWorkout} user={user} />} />
            <Route path="/history" element={<HistoryView workouts={workouts} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
