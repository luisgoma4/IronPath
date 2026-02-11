
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routine } from '../../types';
import RoutineForm from './RoutineForm';

interface RoutineManagerProps {
  routines: Routine[];
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
}

const RoutineManager: React.FC<RoutineManagerProps> = ({ routines, setRoutines }) => {
  const navigate = useNavigate();
  const [editingRoutine, setEditingRoutine] = useState<Routine | null | undefined>(undefined);

  const deleteRoutine = (id: string) => {
    if (confirm('Are you sure you want to delete this routine?')) {
      setRoutines(prev => prev.filter(r => r.id !== id));
    }
  };

  const duplicateRoutine = (routine: Routine) => {
    const newRoutine = {
      ...routine,
      id: `r-${Date.now()}`,
      name: `${routine.name} (Copy)`
    };
    setRoutines(prev => [...prev, newRoutine]);
  };

  const saveRoutine = (routine: Routine) => {
    setRoutines(prev => {
      const exists = prev.find(r => r.id === routine.id);
      if (exists) {
        return prev.map(r => r.id === routine.id ? routine : r);
      }
      return [...prev, routine];
    });
    setEditingRoutine(undefined);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Your Routines</h1>
          <p className="text-slate-500">Plan and organize your weekly training split.</p>
        </div>
        <button 
          onClick={() => setEditingRoutine(null)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <i className="fas fa-plus"></i> Create Routine
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {routines.map((routine) => (
          <div key={routine.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{routine.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{routine.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingRoutine(routine)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition-colors">
                    <i className="fas fa-edit text-sm"></i>
                  </button>
                  <button onClick={() => duplicateRoutine(routine)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition-colors">
                    <i className="fas fa-copy text-sm"></i>
                  </button>
                  <button onClick={() => deleteRoutine(routine.id)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors">
                    <i className="fas fa-trash-alt text-sm"></i>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <span 
                    key={day} 
                    className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${
                      routine.assignedDays.includes(idx) 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                {routine.exercises.map((ex, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                    <span className="font-medium text-slate-700">{ex.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{ex.targetSets} × {ex.targetReps}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate(`/workout/${routine.id}`)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 group-hover:scale-[1.02] transform active:scale-95 transition-transform"
              >
                <i className="fas fa-play text-xs"></i> Start Workout
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingRoutine !== undefined && (
        <RoutineForm 
          routine={editingRoutine || undefined}
          onSave={saveRoutine}
          onCancel={() => setEditingRoutine(undefined)}
        />
      )}
    </div>
  );
};

export default RoutineManager;
