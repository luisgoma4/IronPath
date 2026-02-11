
import React, { useState } from 'react';
import { WorkoutSession } from '../../types';
import { calculateVolume } from '../../services/progressionService';

interface HistoryViewProps {
  workouts: WorkoutSession[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ workouts }) => {
  const [filter, setFilter] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSession | null>(null);

  const filteredWorkouts = workouts.filter(w => 
    w.routineName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Training Log</h1>
          <p className="text-slate-500 font-medium">Detailed archives of your physical progress.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text"
            placeholder="Find routine or date..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
          />
        </div>
      </header>

      <div className="space-y-6">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map((w) => (
            <div 
              key={w.id} 
              onClick={() => setSelectedWorkout(w)}
              className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex flex-col items-center justify-center text-white text-xs font-black leading-tight group-hover:bg-indigo-600 transition-colors">
                    <span className="text-xl">{new Date(w.date).getDate()}</span>
                    <span className="uppercase text-[10px] text-slate-400 group-hover:text-indigo-200">{new Date(w.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{w.routineName}</h3>
                    <div className="flex flex-wrap gap-4 text-xs font-black text-slate-400 uppercase tracking-widest mt-2">
                      <span className="flex items-center gap-2"><i className="fas fa-clock text-indigo-500"></i> {w.duration} min</span>
                      <span className="flex items-center gap-2"><i className="fas fa-weight-hanging text-indigo-500"></i> {w.exercises.reduce((acc, ex) => acc + calculateVolume(ex.sets), 0).toLocaleString()} kg</span>
                      <span className="flex items-center gap-2"><i className="fas fa-layer-group text-indigo-500"></i> {w.exercises.length} Exercises</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 max-w-sm justify-end">
                  {w.exercises.slice(0, 3).map((ex, i) => (
                    <span key={i} className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200/50">
                      {ex.exerciseName}
                    </span>
                  ))}
                  {w.exercises.length > 3 && (
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                      +{w.exercises.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <i className="fas fa-history text-5xl"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Log is empty</h3>
            <p className="text-slate-500 font-medium">Your lifting journey starts with your first log entry.</p>
          </div>
        )}
      </div>

      {selectedWorkout && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-scaleUp">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{selectedWorkout.routineName}</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Session Detail • {new Date(selectedWorkout.date).toLocaleDateString()}</p>
               </div>
               <button onClick={() => setSelectedWorkout(null)} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                 <i className="fas fa-times text-xl"></i>
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              {selectedWorkout.exercises.map((ex, i) => (
                <div key={i} className="space-y-4">
                  <h4 className="text-lg font-black text-slate-800 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs">{i+1}</span>
                    {ex.exerciseName}
                  </h4>
                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <tr>
                          <th className="px-6 py-3">Set</th>
                          <th className="px-6 py-3">Load</th>
                          <th className="px-6 py-3">Reps</th>
                          <th className="px-6 py-3">RPE</th>
                          <th className="px-6 py-3 text-right">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {ex.sets.map((set, si) => (
                          <tr key={si} className="text-sm">
                            <td className="px-6 py-4 font-black text-slate-300">{si + 1}</td>
                            <td className="px-6 py-4 font-black text-slate-700">{set.weight} kg</td>
                            <td className="px-6 py-4 font-black text-slate-700">{set.reps}</td>
                            <td className="px-6 py-4"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black">RPE {set.rpe}</span></td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-slate-400">{(set.weight * set.reps).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-10 border-t border-slate-100 bg-white flex justify-between items-center">
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Volume</p>
                  <p className="text-2xl font-black text-slate-800">{selectedWorkout.exercises.reduce((acc, ex) => acc + calculateVolume(ex.sets), 0).toLocaleString()} kg</p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</p>
                  <p className="text-2xl font-black text-indigo-600">A+</p>
               </div>
               <button onClick={() => setSelectedWorkout(null)} className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black hover:bg-slate-800 transition-colors">Close View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
