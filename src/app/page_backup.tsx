'use client';

import { useState } from 'react';
import { UserData, CalculationResults } from '@/types';
import { 
  calculateTDEE, 
  ACTIVITY_LEVELS, 
  kgToPounds, 
  cmToInches, 
  inchesToFeetInches, 
  feetInchesToTotalInches 
} from '@/lib/calculations';
import InfoAccordion from '@/components/InfoAccordion';

export default function Home() {
  const [formData, setFormData] = useState<UserData>({
    gender: '',
    age: 0,
    weight: 0,
    height: 0,
    activityLevel: 0,
    weightUnit: 'kg',
    heightUnit: 'cm'
  });

  const [heightFeet, setHeightFeet] = useState<number>(0);
  const [heightInches, setHeightInches] = useState<number>(0);
  const [results, setResults] = useState<CalculationResults>({
    bmr: 0,
    tdee: 0
  });
  const [genderError, setGenderError] = useState<string>('');


  const handleInputChange = (field: keyof UserData, value: string | number) => {
    if (field === 'gender' && value !== '') {
      setGenderError('');
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return (
      formData.gender !== '' &&
      formData.age >= 18 &&
      formData.age <= 100 &&
      formData.weight > 0 &&
      formData.height > 0 &&
      formData.activityLevel > 0
    );
  };

  const handleWeightUnitToggle = () => {
    const newWeightUnit = formData.weightUnit === 'kg' ? 'lbs' : 'kg';
    let newWeight = formData.weight;

    if (formData.weightUnit === 'kg' && formData.weight > 0) {
      newWeight = kgToPounds(formData.weight);
    } else if (formData.weightUnit === 'lbs' && formData.weight > 0) {
      newWeight = formData.weight * 0.453592;
    }

    setFormData(prev => ({
      ...prev,
      weightUnit: newWeightUnit,
      weight: Math.round(newWeight * 10) / 10
    }));
  };

  const handleHeightUnitToggle = () => {
    const newHeightUnit = formData.heightUnit === 'cm' ? 'ft-in' : 'cm';
    
    if (formData.heightUnit === 'cm' && formData.height > 0) {
      const totalInches = cmToInches(formData.height);
      const { feet, inches } = inchesToFeetInches(totalInches);
      setHeightFeet(feet);
      setHeightInches(inches);
      setFormData(prev => ({
        ...prev,
        height: totalInches
      }));
    } else if (formData.heightUnit === 'ft-in' && heightFeet > 0) {
      const totalInches = feetInchesToTotalInches(heightFeet, heightInches);
      const newHeight = totalInches * 2.54;
      setFormData(prev => ({
        ...prev,
        height: Math.round(newHeight)
      }));
    }

    setFormData(prev => ({
      ...prev,
      heightUnit: newHeightUnit
    }));
  };

  const handleHeightFeetChange = (feet: number) => {
    setHeightFeet(feet);
    if (feet > 0 || heightInches > 0) {
      const totalInches = feetInchesToTotalInches(feet, heightInches);
      setFormData(prev => ({
        ...prev,
        height: totalInches
      }));
    }
  };

  const handleHeightInchesChange = (inches: number) => {
    setHeightInches(inches);
    if (heightFeet > 0 || inches > 0) {
      const totalInches = feetInchesToTotalInches(heightFeet, inches);
      setFormData(prev => ({
        ...prev,
        height: totalInches
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.gender === '') {
      setGenderError('Please select a gender');
      setResults({ bmr: 0, tdee: 0 });
      return;
    }
    if (!isFormValid()) {
      setResults({ bmr: 0, tdee: 0 });
      return;
    }
    const calculatedResults = calculateTDEE(formData);
    setResults(calculatedResults);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">
            TDEE Calculator
          </h1>
          <p className="text-gray-400 text-lg">
            Calculate Your Total Daily Energy Expenditure
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Gender
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="h-4 w-4 text-yellow-500 border-gray-600 focus:ring-yellow-500 bg-gray-800"
                  />
                  <span className="ml-2 text-gray-300">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="h-4 w-4 text-yellow-500 border-gray-600 focus:ring-yellow-500 bg-gray-800"
                  />
                  <span className="ml-2 text-gray-300">Female</span>
                </label>
              </div>
              {genderError && (
                <p className="text-red-400 text-sm mt-2">{genderError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Age
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your age"
                min="18"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Weight
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={formData.weightUnit === 'kg' ? 'Weight (kg)' : 'Weight (lbs)'}
                  min={formData.weightUnit === 'kg' ? 30 : 66}
                  max={formData.weightUnit === 'kg' ? 300 : 660}
                  step="0.1"
                />
                <button
                  type="button"
                  onClick={handleWeightUnitToggle}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    formData.weightUnit === 'kg'
                      ? 'bg-yellow-500 text-gray-900 font-medium'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {formData.weightUnit === 'kg' ? 'kg' : 'lbs'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Height
              </label>
              {formData.heightUnit === 'cm' ? (
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.height || ''}
                    onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Height (cm)"
                    min="100"
                    max="250"
                    step="0.1"
                  />
                  <button
                    type="button"
                    onClick={handleHeightUnitToggle}
                    className="px-4 py-2 bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
                  >
                    cm
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={heightFeet || ''}
                      onChange={(e) => handleHeightFeetChange(parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Feet"
                      min="4"
                      max="8"
                    />
                    <input
                      type="number"
                      value={heightInches || ''}
                      onChange={(e) => handleHeightInchesChange(parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Inches"
                      min="0"
                      max="11"
                    />
                    <button
                      type="button"
                      onClick={handleHeightUnitToggle}
                      className="px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      ft+in
                    </button>
                  </div>
                  {formData.height > 0 && formData.heightUnit === 'ft-in' && (
                    <p className="text-xs text-gray-500">
                      Equivalent to {Math.round(formData.height * 2.54)} cm
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Activity Level
              </label>
              <select
                value={formData.activityLevel || ''}
                onChange={(e) => handleInputChange('activityLevel', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Select activity level</option>
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              isFormValid()
                ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isFormValid() ? 'Calculate TDEE' : 'Complete all fields'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Your Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">BMR</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {results.bmr > 0 ? results.bmr.toLocaleString() : '-'}
                </p>
                <p className="text-xs text-gray-500 mt-1">calories/day</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">TDEE</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {results.tdee > 0 ? results.tdee.toLocaleString() : '-'}
                </p>
                <p className="text-xs text-gray-500 mt-1">calories/day</p>
              </div>
            </div>
            {results.bmr > 0 && (
              <p className="text-sm text-gray-400 mt-4">
                Based on {formData.gender}, {formData.age}y, {formData.weight}
                {formData.weightUnit === 'kg' ? 'kg' : 'lbs'}, {
                  formData.heightUnit === 'cm' 
                    ? `${formData.height}cm` 
                    : `${Math.floor(formData.height / 12)}'${Math.round(formData.height % 12)}"`
                }
              </p>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <InfoAccordion />
        </div>
      </div>
    </div>
  );
}