
import React, { useState, useEffect } from 'react';

interface RestTimerProps {
  initialSeconds: number;
  onFinish: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ initialSeconds, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onFinish]);

  const percentage = (timeLeft / initialSeconds) * 100;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] animate-bounceIn">
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-2xl border border-slate-700 flex items-center gap-6 w-64 overflow-hidden relative">
        <div 
          className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        ></div>
        
        <div className="relative w-12 h-12 flex items-center justify-center">
           <svg className="absolute w-full h-full -rotate-90">
             <circle cx="24" cy="24" r="20" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
             <circle 
                cx="24" cy="24" r="20" fill="transparent" stroke="#6366f1" strokeWidth="4" 
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * percentage) / 100}
                className="transition-all duration-1000"
             />
           </svg>
           <span className="text-xs font-black">{timeLeft}s</span>
        </div>

        <div className="flex-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Rest Timer</p>
          <p className="font-bold text-sm">Recover & Prepare</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTimeLeft(prev => prev + 30)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700">
            <i className="fas fa-plus text-[10px]"></i>
          </button>
          <button onClick={onFinish} className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/30">
            <i className="fas fa-stop text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestTimer;
