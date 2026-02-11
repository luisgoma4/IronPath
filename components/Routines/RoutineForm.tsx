
import React, { useState } from 'react';
import { Routine, Exercise, ProgressionModel } from '../../types';

interface RoutineFormProps {
  routine?: Routine;
  onSave: (routine: Routine) => void;
  onCancel: () => void;
}

const EXERCISE_LIBRARY = [
  { category: 'Chest', items: ['Bench Press (Barbell)', 'Bench Press (Dumbbell)', 'Incline Bench Press', 'Decline Bench Press', 'Chest Fly', 'Pushups', 'Chest Press Machine', 'Dips'] },
  { category: 'Back', items: ['Deadlift (Barbell)', 'Pullups', 'Lat Pulldown', 'Bent Over Row (Barbell)', 'One Arm Row (Dumbbell)', 'Seated Cable Row', 'T-Bar Row', 'Face Pulls', 'Hyperextensions'] },
  { category: 'Legs', items: ['Squat (Barbell)', 'Leg Press', 'Leg Extension', 'Leg Curl', 'Lunge', 'Bulgarian Split Squat', 'Romanian Deadlift', 'Calf Raise', 'Hip Thrust'] },
  { category: 'Shoulders', items: ['Overhead Press (Barbell)', 'Shoulder Press (Dumbbell)', 'Lateral Raise', 'Front Raise', 'Rear Delt Fly', 'Upright Row', 'Arnold Press'] },
  { category: 'Arms', items: ['Bicep Curl (Barbell)', 'Hammer Curl', 'Preacher Curl', 'Tricep Pushdown', 'Skull Crushers', 'Close Grip Bench Press', 'Overhead Tricep Extension'] },
  { category: 'Core', items: ['Plank', 'Crunches', 'Leg Raise', 'Russian Twist', 'Ab Rollout', 'Cable Woodchoppers'] }
];

const RoutineForm: React.FC<RoutineFormProps> = ({ routine, onSave, onCancel }) => {
  const [name, setName] = useState(routine?.name || '');
  const [description, setDescription] = useState(routine?.description || '');
  const [assignedDays, setAssignedDays] = useState<number[]>(routine?.assignedDays || []);
  const [exercises, setExercises] = useState<Exercise[]>(routine?.exercises || []);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDay = (dayIdx: number) => {
    setAssignedDays(prev => 
      prev.includes(dayIdx) ? prev.filter(d => d !== dayIdx) : [...prev, dayIdx]
    );
  };

  const addExerciseFromLibrary = (exName: string) => {
    const newEx: Exercise = {
      id: `ex-${Date.now()}-${Math.random()}`,
      name: exName,
      targetSets: 3,
      targetReps: '8-12',
      restTime: 90,
      progressionModel: ProgressionModel.LINEAR
    };
    setExercises([...exercises, newEx]);
    setSearchTerm('');
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: routine?.id || `r-${Date.now()}`,
      name,
      description,
      assignedDays,
      exercises
    });
  };

  const filteredLibrary = EXERCISE_LIBRARY.map(cat => ({
    ...cat,
    items: cat.items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800">{routine ? 'Edit Routine' : 'New Routine'}</h2>
            <p className="text-sm text-slate-500">Configure your exercises and weekly frequency</p>
          </div>
          <button onClick={onCancel} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors">
            <i className="fas fa-times text-slate-400"></i>
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar: Library */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 flex flex-col p-6 overflow-hidden">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Library</h3>
            <div className="relative mb-6">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search exercises..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {filteredLibrary.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-2">{cat.category}</p>
                  {cat.items.map((item, j) => (
                    <button 
                      key={j}
                      onClick={() => addExerciseFromLibrary(item)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content: Current Routine */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                  <input 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequency</label>
                  <div className="flex gap-1 flex-wrap">
                    {['S','M','T','W','T','F','S'].map((day, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleDay(idx)}
                        className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                          assignedDays.includes(idx) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-800">Assigned Exercises ({exercises.length})</h3>
                <div className="space-y-3">
                  {exercises.map((ex, idx) => (
                    <div key={ex.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4 group relative">
                      <button 
                        type="button"
                        onClick={() => removeExercise(idx)}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                      
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                        <input 
                          value={ex.name}
                          onChange={e => updateExercise(idx, 'name', e.target.value)}
                          className="flex-1 font-black text-slate-800 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase">Sets</label>
                          <input 
                            type="number"
                            value={ex.targetSets}
                            onChange={e => updateExercise(idx, 'targetSets', parseInt(e.target.value))}
                            className="w-full bg-slate-50 rounded-lg px-3 py-2 text-xs font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase">Reps</label>
                          <input 
                            value={ex.targetReps}
                            onChange={e => updateExercise(idx, 'targetReps', e.target.value)}
                            className="w-full bg-slate-50 rounded-lg px-3 py-2 text-xs font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase">Rest (s)</label>
                          <input 
                            type="number"
                            value={ex.restTime}
                            onChange={e => updateExercise(idx, 'restTime', parseInt(e.target.value))}
                            className="w-full bg-slate-50 rounded-lg px-3 py-2 text-xs font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {exercises.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400">
                      <i className="fas fa-plus-circle text-4xl mb-4 opacity-20"></i>
                      <p className="text-sm font-bold">Pick exercises from the library on the left</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-8 border-t border-slate-100 bg-white">
          <button 
            onClick={handleSubmit}
            disabled={!name || exercises.length === 0}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:bg-slate-300 disabled:shadow-none"
          >
            Save Routine
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutineForm;
