
import React, { useState } from 'react';
import { Routine, Exercise, ProgressionModel } from '../../types';

interface RoutineFormProps {
  routine?: Routine;
  onSave: (routine: Routine) => void;
  onCancel: () => void;
}

const RoutineForm: React.FC<RoutineFormProps> = ({ routine, onSave, onCancel }) => {
  const [name, setName] = useState(routine?.name || '');
  const [description, setDescription] = useState(routine?.description || '');
  const [assignedDays, setAssignedDays] = useState<number[]>(routine?.assignedDays || []);
  const [exercises, setExercises] = useState<Exercise[]>(routine?.exercises || []);

  const toggleDay = (dayIdx: number) => {
    setAssignedDays(prev => 
      prev.includes(dayIdx) ? prev.filter(d => d !== dayIdx) : [...prev, dayIdx]
    );
  };

  const addExercise = () => {
    const newEx: Exercise = {
      id: `ex-${Date.now()}`,
      name: 'New Exercise',
      targetSets: 3,
      targetReps: '8-12',
      restTime: 90,
      progressionModel: ProgressionModel.LINEAR
    };
    setExercises([...exercises, newEx]);
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

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800">{routine ? 'Edit Routine' : 'Create Routine'}</h2>
            <p className="text-sm text-slate-500">Design your perfect training block</p>
          </div>
          <button onClick={onCancel} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors">
            <i className="fas fa-times text-slate-400"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Routine Name</label>
                <input 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Upper Body Hypertrophy"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                <input 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Focus on chest and back width"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Schedule Days</label>
              <div className="flex flex-wrap gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      assignedDays.includes(idx)
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">Exercises</h3>
              <button 
                type="button" 
                onClick={addExercise}
                className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
              >
                <i className="fas fa-plus-circle"></i> Add Exercise
              </button>
            </div>

            <div className="space-y-3">
              {exercises.map((ex, idx) => (
                <div key={ex.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative group">
                  <button 
                    type="button"
                    onClick={() => removeExercise(idx)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                  
                  <input 
                    value={ex.name}
                    onChange={e => updateExercise(idx, 'name', e.target.value)}
                    className="bg-transparent border-b border-slate-200 font-bold text-slate-700 outline-none w-full pb-1 focus:border-indigo-500"
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Sets</label>
                      <input 
                        type="number"
                        value={ex.targetSets}
                        onChange={e => updateExercise(idx, 'targetSets', parseInt(e.target.value))}
                        className="w-full bg-white rounded-lg px-2 py-1 text-sm border border-slate-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Reps</label>
                      <input 
                        value={ex.targetReps}
                        onChange={e => updateExercise(idx, 'targetReps', e.target.value)}
                        className="w-full bg-white rounded-lg px-2 py-1 text-sm border border-slate-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Rest (s)</label>
                      <input 
                        type="number"
                        value={ex.restTime}
                        onChange={e => updateExercise(idx, 'restTime', parseInt(e.target.value))}
                        className="w-full bg-white rounded-lg px-2 py-1 text-sm border border-slate-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {exercises.length === 0 && (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
                  No exercises added yet. Start by clicking "Add Exercise".
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="p-8 border-t border-slate-100 bg-white">
          <button 
            onClick={handleSubmit}
            disabled={!name || exercises.length === 0}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all disabled:bg-slate-300 disabled:shadow-none"
          >
            Save Routine
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutineForm;
