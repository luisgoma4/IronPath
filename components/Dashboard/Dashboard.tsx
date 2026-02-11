
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { UserProfile, WorkoutSession, Routine } from '../../types';
import { calculateVolume, calculate1RM } from '../../services/progressionService';
import PredictionWindow from './PredictionWindow';

interface DashboardProps {
  user: UserProfile;
  workouts: WorkoutSession[];
  routines: Routine[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, workouts, routines }) => {
  const recentWorkouts = [...workouts].slice(0, 10).reverse();

  const volumeData = recentWorkouts.map(w => ({
    date: new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    volume: w.exercises.reduce((acc, ex) => acc + calculateVolume(ex.sets), 0)
  }));

  const oneRMData = recentWorkouts.flatMap(w =>
    w.exercises.map(ex => ({
      date: new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      exercise: ex.exerciseName,
      max1RM: Math.max(...ex.sets.map(s => calculate1RM(s.weight, s.reps)))
    }))
  ).filter(d => d.exercise === 'Bench Press');

  const kpis = [
    { label: 'Total Workouts', value: workouts.length, icon: 'fa-calendar-check', color: 'bg-indigo-600' },
    { label: 'Avg Intensity', value: '8.2 RPE', icon: 'fa-fire', color: 'bg-orange-500' },
    { label: 'Weekly Volume', value: volumeData[volumeData.length-1]?.volume.toLocaleString() || 0, icon: 'fa-weight-hanging', color: 'bg-emerald-500' },
    { label: 'Bodyweight', value: `${user.weight}kg`, icon: 'fa-user', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Performance</h1>
          <p className="text-slate-500 font-medium">Monitoring your mechanical tension and progression.</p>
        </div>
      </header>

      {/* Smart Prediction Section */}
      <PredictionWindow user={user} routines={routines} workouts={workouts} />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-3 group hover:shadow-md transition-shadow">
            <div className={`${kpi.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-current/20`}>
              <i className={`fas ${kpi.icon} text-sm`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Progressive Overload Trend
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                   contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', padding: '12px'}}
                   itemStyle={{color: '#818cf8', fontWeight: 900}}
                />
                <Area type="monotone" dataKey="volume" stroke="#4f46e5" fillOpacity={1} fill="url(#colorVolume)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-pink-500 rounded-full"></span>
              Estimated 1RM Focus
            </h2>
            <select className="text-[10px] font-black uppercase tracking-widest bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Bench Press</option>
              <option>Squat</option>
              <option>Deadlift</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oneRMData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                   contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', padding: '12px'}}
                   itemStyle={{color: '#f472b6', fontWeight: 900}}
                />
                <Line type="monotone" dataKey="max1RM" stroke="#ec4899" strokeWidth={4} dot={{r: 6, fill: '#ec4899', strokeWidth: 0}} activeDot={{r: 8, strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
