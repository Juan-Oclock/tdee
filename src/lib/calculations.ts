import { UserData, CalculationResults } from '@/types';

export const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary', description: 'Little or no exercise' },
  { value: 1.375, label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 1.55, label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 1.725, label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 1.9, label: 'Extremely Active', description: 'Very hard exercise, physical job' }
];

export function calculateTDEE(userData: UserData): CalculationResults {
  if (!userData.gender || !userData.age || !userData.weight || !userData.height || !userData.activityLevel) {
    return { bmr: 0, tdee: 0 };
  }

  const weightInKg = userData.weightUnit === 'lbs' 
    ? poundsToKg(userData.weight) 
    : userData.weight;
  
  const heightInCm = userData.heightUnit === 'ft-in' 
    ? feetInchesToCm(userData.height) 
    : userData.height;

  const bmr = calculateBMR(userData.gender, weightInKg, heightInCm, userData.age);
  const tdee = bmr * userData.activityLevel;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee)
  };
}

function calculateBMR(gender: string, weight: number, height: number, age: number): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

function poundsToKg(pounds: number): number {
  return pounds * 0.453592;
}

function feetInchesToCm(totalInches: number): number {
  return totalInches * 2.54;
}

export function kgToPounds(kg: number): number {
  return kg * 2.20462;
}

export function cmToInches(cm: number): number {
  return cm * 0.393701;
}

export function inchesToFeetInches(totalInches: number): { feet: number; inches: number } {
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function feetInchesToTotalInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}

export interface MacroResults {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  carbsPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
}

export type GoalType = 'maintenance' | 'cutting' | 'bulking';
export type DietStyle = 'moderate' | 'lowCarb' | 'highCarb';

export function calculateMacros(tdee: number, goal: GoalType, dietStyle: DietStyle): MacroResults {
  let targetCalories = tdee;
  
  switch (goal) {
    case 'cutting':
      targetCalories = tdee - 500;
      break;
    case 'bulking':
      targetCalories = tdee + 500;
      break;
    case 'maintenance':
    default:
      targetCalories = tdee;
  }

  let carbsPercentage = 0;
  let proteinPercentage = 0;
  let fatPercentage = 0;

  switch (dietStyle) {
    case 'moderate':
      carbsPercentage = 0.35;
      proteinPercentage = 0.3;
      fatPercentage = 0.35;
      break;
    case 'lowCarb':
      carbsPercentage = 0.2;
      proteinPercentage = 0.4;
      fatPercentage = 0.4;
      break;
    case 'highCarb':
      carbsPercentage = 0.5;
      proteinPercentage = 0.3;
      fatPercentage = 0.2;
      break;
  }

  const carbsCalories = targetCalories * carbsPercentage;
  const proteinCalories = targetCalories * proteinPercentage;
  const fatCalories = targetCalories * fatPercentage;

  const carbsGrams = Math.round(carbsCalories / 4);
  const proteinGrams = Math.round(proteinCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  return {
    calories: targetCalories,
    carbs: carbsGrams,
    protein: proteinGrams,
    fat: fatGrams,
    carbsPercentage: carbsPercentage * 100,
    proteinPercentage: proteinPercentage * 100,
    fatPercentage: fatPercentage * 100
  };
}