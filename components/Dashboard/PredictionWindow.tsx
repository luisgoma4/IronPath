
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
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex-1 space-y-6">
          <header className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <i className="fas fa-magic text-xl"></i>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Next Scheduled Routine</p>
              <h2 className="text-2xl font-black tracking-tight">{recommendedRoutine.name}</h2>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.slice(0, 4).map((p, i) => (
              <div key={i} className="bg-slate-700/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-600/50 flex justify-between items-center group/item hover:bg-slate-700 transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-300 truncate max-w-[120px]">{p.name}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black">{p.predictedWeight}</span>
                    <span className="text-[10px] font-bold opacity-60 uppercase">kg</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Target</p>
                  <div className={`flex items-center gap-1 text-xs font-black ${p.suggestion === 'INCREASE' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {p.suggestion === 'INCREASE' ? (
                      <><i className="fas fa-arrow-up-right"></i> +{(p.predictedWeight - p.lastWeight).toFixed(1)}</>
                    ) : (
                      <><i className="fas fa-equals"></i> Maintain</>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-slate-400 bg-black/20 p-4 rounded-2xl border border-white/5">
            <i className="fas fa-chart-line text-indigo-400"></i>
            <p>Load calculated based on your average intensity and volume from the previous session.</p>
          </div>
        </div>

        <div className="lg:w-72 flex flex-col justify-center gap-4">
          <button 
            onClick={() => navigate(`/workout/${recommendedRoutine?.id}`)}
            className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <i className="fas fa-play"></i> START SESSION
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Auto-fills predicted weights for efficiency.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionWindow;
