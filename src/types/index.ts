export interface UserData {
  gender: 'male' | 'female' | '';
  age: number;
  weight: number;
  height: number;
  activityLevel: number;
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft-in';
}

export interface CalculationResults {
  bmr: number;
  tdee: number;
}

export interface ActivityLevel {
  value: number;
  label: string;
  description: string;
}