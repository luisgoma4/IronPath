
export enum ProgressionModel {
  LINEAR = 'LINEAR',
  UNDULATING = 'UNDULATING',
  RPE_BASED = 'RPE_BASED'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  trainingGoal: 'STRENGTH' | 'HYPERTROPHY' | 'FAT_LOSS' | 'MAINTENANCE';
  settings: {
    progressionPercentage: number;
    plateIncrement: number;
    deloadThreshold: number;
    minRpeThreshold: number;
  }
}

export interface SetRecord {
  id: string;
  weight: number;
  reps: number;
  rpe: number; // 1-10
  restTime: number; // seconds
  isWarmup: boolean;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetSets: number;
  targetReps: string; // e.g., "8-12"
  restTime: number;
  progressionModel: ProgressionModel;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  assignedDays: number[]; // 0-6 (Sunday-Saturday)
}

export interface WorkoutSession {
  id: string;
  userId: string;
  routineId: string;
  routineName: string;
  date: string;
  duration: number; // minutes
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: SetRecord[];
  }[];
}

export interface PerformanceStats {
  exerciseId: string;
  date: string;
  maxWeight: number;
  volume: number;
  estimated1RM: number;
}
