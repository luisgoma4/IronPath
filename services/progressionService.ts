
import { SetRecord, WorkoutSession, Routine, UserProfile } from '../types';

/**
 * Brzycki Formula for Estimated 1RM
 * 1RM = Weight * (36 / (37 - Reps))
 */
export const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 0) return 0;
  if (reps === 1) return weight;
  return weight * (36 / (37 - reps));
};

export const calculateVolume = (sets: SetRecord[]): number => {
  return sets.reduce((total, set) => total + (set.weight * set.reps), 0);
};

export const getProgressionSuggestion = (
  lastSessionSets: SetRecord[],
  targetReps: string,
  progressionPercent: number,
  plateRounding: number
): { suggestion: 'INCREASE' | 'MAINTAIN' | 'DELOAD'; nextWeight: number; reason: string } => {
  if (!lastSessionSets || lastSessionSets.length === 0) {
    return { suggestion: 'MAINTAIN', nextWeight: 20, reason: 'No previous data found.' };
  }

  const [minTarget, maxTarget] = targetReps.split('-').map(Number);
  const avgReps = lastSessionSets.reduce((sum, s) => sum + s.reps, 0) / lastSessionSets.length;
  const avgRpe = lastSessionSets.reduce((sum, s) => sum + s.rpe, 0) / lastSessionSets.length;
  const lastWeight = lastSessionSets[0]?.weight || 0;

  const roundWeight = (w: number) => Math.round(w / plateRounding) * plateRounding;

  // Logic: Success if all sets achieved max target reps OR average reps are at max target
  const allMaxed = lastSessionSets.every(s => s.reps >= maxTarget);
  const reachedMaxRange = avgReps >= maxTarget;
  const lowExertion = avgRpe <= 8;

  if ((allMaxed || reachedMaxRange) && lowExertion) {
    const increase = lastWeight * (progressionPercent / 100);
    const nextW = roundWeight(lastWeight + Math.max(increase, plateRounding));
    return {
      suggestion: 'INCREASE',
      nextWeight: nextW,
      reason: `High performance detected (${avgReps.toFixed(1)} avg reps @ RPE ${avgRpe.toFixed(1)}). Suggesting +${(nextW - lastWeight).toFixed(1)}kg.`
    };
  }

  if (avgReps < minTarget) {
    return {
      suggestion: 'MAINTAIN',
      nextWeight: lastWeight,
      reason: `Focus on hitting the minimum rep range (${minTarget}) before increasing load.`
    };
  }

  return {
    suggestion: 'MAINTAIN',
    nextWeight: lastWeight,
    reason: `Consistency is key. Maintain ${lastWeight}kg to solidify your strength base.`
  };
};

/**
 * Predicts the next session details based on historical trends
 */
export const predictNextSession = (
  routine: Routine,
  history: WorkoutSession[],
  user: UserProfile
) => {
  const predictions = routine.exercises.map(ex => {
    // Find last 3 instances of this specific exercise
    const exerciseHistory = history
      .flatMap(session => session.exercises.filter(e => e.exerciseId === ex.id).map(e => ({ ...e, date: session.date })))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 1);

    const lastPerf = exerciseHistory[0];
    const lastWeight = lastPerf?.sets[0]?.weight || 0;
    
    const suggestion = getProgressionSuggestion(
      lastPerf?.sets || [],
      ex.targetReps,
      user.settings.progressionPercentage,
      user.settings.plateIncrement
    );

    return {
      exerciseId: ex.id,
      name: ex.name,
      lastWeight,
      predictedWeight: lastWeight === 0 ? 20 : suggestion.nextWeight,
      suggestion: suggestion.suggestion,
      reason: suggestion.reason
    };
  });

  return predictions;
};
