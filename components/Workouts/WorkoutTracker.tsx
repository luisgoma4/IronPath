
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Routine, WorkoutSession, SetRecord, UserProfile } from '../../types';
import { getProgressionSuggestion } from '../../services/progressionService';
import RestTimer from './RestTimer';

interface WorkoutTrackerProps {
  routines: Routine[];
  workouts: WorkoutSession[];
  addWorkout: (session: WorkoutSession) => void;
  user: UserProfile;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ routines, workouts, addWorkout, user }) => {
  const { routineId } = useParams<{ routineId: string }>();
  const navigate = useNavigate();
  const routine = routines.find(r => r.id === routineId);
  
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [restTime, setRestTime] = useState<number | null>(null);

  const [activeExercises, setActiveExercises] = useState<{
    exerciseId: string;
    exerciseName: string;
    targetReps: string;
    restTime: number;
    sets: SetRecord[];
    suggestion?: any;
  }[]>([]);

  useEffect(() => {
    if (routine) {
      setActiveExercises(routine.exercises.map(ex => {
        const previousWorkout = workouts.find(w => w.routineId === routine.id);
        const prevExercise = previousWorkout?.exercises.find(pe => pe.exerciseId === ex.id);
        
        let initialWeight = 20;
        let suggestion = null;

        if (prevExercise && prevExercise.sets.length > 0) {
          const res = getProgressionSuggestion(
            prevExercise.sets,
            ex.targetReps,
            user.settings.progressionPercentage,
            user.settings.plateIncrement
          );
          initialWeight = res.nextWeight;
          suggestion = res;
        }

        return {
          exerciseId: ex.id,
          exerciseName: ex.name,
          targetReps: ex.targetReps,
          restTime: ex.restTime,
          suggestion,
          sets: Array.from({ length: ex.targetSets }).map((_, i) => ({
            id: `s-${ex.id}-${i}`,
            weight: initialWeight,
            reps: 0,
            rpe: 8,
            restTime: ex.restTime,
            isWarmup: false,
            isCompleted: false,
          })) as any
        };
      }));

      timerRef.current = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [routine, workouts, user]);

  const updateSet = (exIndex: number, setIndex: number, field: string, value: any) => {
    setActiveExercises(prev => {
      const next = [...prev];
      next[exIndex].sets[setIndex] = { ...next[exIndex].sets[setIndex], [field]: value };
      return next;
    });
  };

  const toggleSetComplete = (exIndex: number, setIndex: number) => {
    const isNowComplete = !(activeExercises[exIndex].sets[setIndex] as any).isCompleted;
    updateSet(exIndex, setIndex, 'isCompleted', isNowComplete);
    
    if (isNowComplete) {
      setRestTime(activeExercises[exIndex].restTime);
    }
  };

  const finishWorkout = () => {
    if (!routine) return;
    const session: WorkoutSession = {
      id: `w-${Date.now()}`,
      userId: user.id,
      routineId: routine.id,
      routineName: routine.name,
      date: new Date().toISOString(),
      duration: Math.floor(timer / 60),
      exercises: activeExercises.map(ex => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        sets: ex.sets.filter(s => s.reps > 0)
      }))
    };
    addWorkout(session);
    navigate('/');
  };

  if (!routine) return <div className="p-8 text-center text-slate-500">Routine not found</div>;

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-fadeIn relative">
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl border border-white/50 sticky top-4 z-40 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{routine.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="bg-indigo-50 text-indigo-600 px-3 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase">Live Session</span>
            <p className="text-slate-400 font-mono text-sm font-bold flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
              {formatTime(timer)}
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-6 sm:mt-0">
          <button onClick={() => navigate('/routines')} className="px-6 py-2.5 text-slate-400 font-black text-sm hover:text-slate-600">QUIT</button>
          <button onClick={finishWorkout} className="bg-indigo-600 text-white px-8 py-2.5 rounded-2xl font-black shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all">FINISH</button>
        </div>
      </header>

      <div className="space-y-8">
        {activeExercises.map((ex, exIdx) => (
          <div key={ex.exerciseId} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group">
            <div className="p-8 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{ex.exerciseName}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Target: {ex.sets.length} × {ex.targetReps} • {ex.restTime}s rest</p>
              </div>
              {ex.suggestion && (
                <div className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest ${
                  ex.suggestion.suggestion === 'INCREASE' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-800 text-white shadow-lg shadow-slate-200'
                }`}>
                  <i className={`fas ${ex.suggestion.suggestion === 'INCREASE' ? 'fa-bolt' : 'fa-balance-scale'} mr-2`}></i>
                  Suggest: {ex.suggestion.nextWeight}kg
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="space-y-2">
                {ex.sets.map((set: any, sIdx: number) => (
                  <div key={sIdx} className={`grid grid-cols-12 gap-3 items-center p-3 rounded-2xl transition-all ${set.isCompleted ? 'bg-indigo-50/50 opacity-60' : 'bg-white'}`}>
                    <div className="col-span-1 text-center font-black text-slate-300 text-sm">{sIdx + 1}</div>
                    
                    <div className="col-span-4 relative">
                      <input 
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(exIdx, sIdx, 'weight', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 font-black text-slate-700 text-center outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">kg</span>
                    </div>

                    <div className="col-span-3 relative">
                      <input 
                        type="number"
                        value={set.reps || ''}
                        placeholder="--"
                        onChange={(e) => updateSet(exIdx, sIdx, 'reps', parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-100 border-none rounded-xl px-4 py-2.5 font-black text-slate-700 text-center outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">reps</span>
                    </div>

                    <div className="col-span-2">
                      <select 
                        value={set.rpe}
                        onChange={(e) => updateSet(exIdx, sIdx, 'rpe', parseInt(e.target.value))}
                        className="w-full bg-slate-100 border-none rounded-xl px-2 py-2.5 font-black text-slate-700 text-center outline-none focus:ring-2 focus:ring-indigo-500 text-xs appearance-none"
                      >
                        {[6, 7, 8, 9, 10].map(val => <option key={val} value={val}>RPE {val}</option>)}
                      </select>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <button 
                        onClick={() => toggleSetComplete(exIdx, sIdx)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          set.isCompleted 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-90' 
                          : 'bg-slate-100 text-slate-300 hover:text-indigo-600'
                        }`}
                      >
                        <i className={`fas ${set.isCompleted ? 'fa-check' : 'fa-circle-check'} text-lg`}></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {ex.suggestion?.reason && (
                <div className="mt-6 flex gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
                    <i className="fas fa-brain text-[10px]"></i>
                  </div>
                  <p className="text-xs text-indigo-700 font-medium leading-relaxed italic">"{ex.suggestion.reason}"</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {restTime && (
        <RestTimer initialSeconds={restTime} onFinish={() => setRestTime(null)} />
      )}
    </div>
  );
};

export default WorkoutTracker;
