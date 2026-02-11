
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Routine, WorkoutSession, UserProfile } from '../../types';
import { predictNextSession } from '../../services/progressionService';

interface PredictionWindowProps {
  user: UserProfile;
  routines: Routine[];
  workouts: WorkoutSession[];
}

const PredictionWindow: React.FC<PredictionWindowProps> = ({ user, routines, workouts }) => {
  const navigate = useNavigate();

  // Logic to find "Due" Routine:
  // 1. Check if a routine is assigned to today's day of week
  // 2. If not, find the routine performed least recently
  const today = new Date().getDay();
  let recommendedRoutine = routines.find(r => r.assignedDays.includes(today));
  
  if (!recommendedRoutine && routines.length > 0) {
    const lastPerformedMap = new Map<string, number>();
    workouts.forEach(w => {
      if (!lastPerformedMap.has(w.routineId)) {
        lastPerformedMap.set(w.routineId, new Date(w.date).getTime());
      }
    });
    
    recommendedRoutine = [...routines].sort((a, b) => {
      const lastA = lastPerformedMap.get(a.id) || 0;
      const lastB = lastPerformedMap.get(b.id) || 0;
      return lastA - lastB;
    })[0];
  }

  if (!recommendedRoutine) return null;

  const predictions = predictNextSession(recommendedRoutine, workouts, user);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex-1 space-y-6">
          <header className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <i className="fas fa-robot text-xl animate-pulse"></i>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">AI Performance Forecast</p>
              <h2 className="text-2xl font-black tracking-tight">Ready for {recommendedRoutine.name}?</h2>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.slice(0, 4).map((p, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex justify-between items-center group/item hover:bg-white/15 transition-colors">
                <div>
                  <p className="text-xs font-bold text-indigo-100 truncate max-w-[120px]">{p.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black">{p.predictedWeight}</span>
                    <span className="text-[10px] font-bold opacity-60 uppercase">kg</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-indigo-200">Next Target</p>
                  <div className={`flex items-center gap-1 text-xs font-black ${p.suggestion === 'INCREASE' ? 'text-emerald-300' : 'text-slate-300'}`}>
                    {p.suggestion === 'INCREASE' ? (
                      <><i className="fas fa-arrow-up-right"></i> +{(p.predictedWeight - p.lastWeight).toFixed(1)}</>
                    ) : (
                      <><i className="fas fa-equals"></i> Steady</>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-indigo-100/80 bg-black/10 p-4 rounded-2xl italic">
            <i className="fas fa-lightbulb text-indigo-300"></i>
            <p>Based on your last session, we've optimized your loads to maximize hypertrophy.</p>
          </div>
        </div>

        <div className="lg:w-72 flex flex-col justify-center gap-4">
          <button 
            onClick={() => navigate(`/workout/${recommendedRoutine?.id}`)}
            className="w-full bg-white text-indigo-600 py-5 rounded-[2rem] font-black text-lg shadow-xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <i className="fas fa-bolt"></i> START NOW
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 opacity-60">Routine assigned for: {recommendedRoutine.assignedDays.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionWindow;
