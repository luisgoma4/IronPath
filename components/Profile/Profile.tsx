
import React from 'react';
import { UserProfile } from '../../types';

interface ProfileProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const handleChange = (field: string, value: any) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field: string, value: any) => {
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">Your Profile</h1>
        <p className="text-slate-500">Manage your body metrics and training preferences.</p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-indigo-200">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
              <p className="text-slate-400 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weight (kg)</label>
              <input 
                type="number" 
                value={user.weight}
                onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Height (cm)</label>
              <input 
                type="number" 
                value={user.height}
                onChange={(e) => handleChange('height', parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <h3 className="text-lg font-black text-slate-800">Training Logic Settings</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progression Increment (%)</label>
              <input 
                type="number" 
                value={user.settings.progressionPercentage}
                step="0.5"
                onChange={(e) => handleSettingsChange('progressionPercentage', parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plate Minimum (kg)</label>
              <input 
                type="number" 
                value={user.settings.plateIncrement}
                step="0.25"
                onChange={(e) => handleSettingsChange('plateIncrement', parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex gap-4 items-start">
              <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 mt-1">
                <i className="fas fa-brain text-xs"></i>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                The <strong>Smart Progression System</strong> uses your weight increments and plate minimums to calculate optimal load increases based on your previous sets and RPE feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
};

export default Profile;
