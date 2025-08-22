'use client';

import { useState } from 'react';
import { UserData, CalculationResults } from '@/types';
import { 
  calculateTDEE, 
  ACTIVITY_LEVELS, 
  kgToPounds, 
  cmToInches, 
  inchesToFeetInches, 
  feetInchesToTotalInches,
  calculateMacros,
  GoalType,
  DietStyle,
  MacroResults
} from '@/lib/calculations';
import InfoAccordion from '@/components/InfoAccordion';
import MacroCard from '@/components/MacroCard';

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
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('maintenance');
  const [selectedDietStyle, setSelectedDietStyle] = useState<DietStyle>('moderate');
  const [macroResults, setMacroResults] = useState<MacroResults | null>(null);


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
      setMacroResults(null);
      return;
    }
    if (!isFormValid()) {
      setResults({ bmr: 0, tdee: 0 });
      setMacroResults(null);
      return;
    }
    const calculatedResults = calculateTDEE(formData);
    setResults(calculatedResults);
    
    if (calculatedResults.tdee > 0) {
      const macros = calculateMacros(calculatedResults.tdee, selectedGoal, selectedDietStyle);
      setMacroResults(macros);
    }
  };

  const handleGoalChange = (goal: GoalType) => {
    setSelectedGoal(goal);
    if (results.tdee > 0) {
      const macros = calculateMacros(results.tdee, goal, selectedDietStyle);
      setMacroResults(macros);
    }
  };

  const handleDietStyleChange = (dietStyle: DietStyle) => {
    setSelectedDietStyle(dietStyle);
    if (results.tdee > 0) {
      const macros = calculateMacros(results.tdee, selectedGoal, dietStyle);
      setMacroResults(macros);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-100 mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              CalorieCalc
            </h1>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Your personal Total Daily Energy Expenditure calculator. Discover your perfect calorie intake 
              and macronutrient balance to achieve your fitness goals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="text-yellow-500 text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-100 mb-2">Accurate Calculations</h3>
                <p className="text-sm text-gray-400">Based on Mifflin-St Jeor equation for precise results</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="text-yellow-500 text-2xl mb-2">🎯</div>
                <h3 className="font-semibold text-gray-100 mb-2">Goal-Oriented</h3>
                <p className="text-sm text-gray-400">Custom plans for maintenance, cutting, and bulking</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="text-yellow-500 text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-100 mb-2">Macro Tracking</h3>
                <p className="text-sm text-gray-400">Three diet styles with detailed macronutrient breakdown</p>
              </div>
            </div>
          </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
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
            </div>
          </div>

          <div>
            <InfoAccordion />
          </div>
        </div>

        {results.tdee > 0 && (
          <div className="mt-8 w-full">
            <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Macronutrient Plan</h3>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Select Your Goal</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGoalChange('maintenance')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedGoal === 'maintenance'
                        ? 'bg-yellow-500 text-gray-900 font-medium'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Maintenance
                  </button>
                  <button
                    onClick={() => handleGoalChange('cutting')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedGoal === 'cutting'
                        ? 'bg-yellow-500 text-gray-900 font-medium'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Cutting
                  </button>
                  <button
                    onClick={() => handleGoalChange('bulking')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedGoal === 'bulking'
                        ? 'bg-yellow-500 text-gray-900 font-medium'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Bulking
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Select Diet Style</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDietStyleChange('moderate')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedDietStyle === 'moderate'
                        ? 'bg-yellow-500 text-gray-900 font-medium'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Moderate
                  </button>
                  <button
                    onClick={() => handleDietStyleChange('lowCarb')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedDietStyle === 'lowCarb'
                        ? 'bg-yellow-500 text-gray-900 font-medium'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Low Carb
                  </button>
                  <button
                    onClick={() => handleDietStyleChange('highCarb')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedDietStyle === 'highCarb'
                        ? 'bg-yellow-500 text-gray-900 font-medium'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    High Carb
                  </button>
                </div>
              </div>

              {macroResults && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MacroCard
                    macroResults={calculateMacros(results.tdee, selectedGoal, 'moderate')}
                    dietStyle="moderate"
                    isSelected={selectedDietStyle === 'moderate'}
                    onSelect={() => handleDietStyleChange('moderate')}
                  />
                  <MacroCard
                    macroResults={calculateMacros(results.tdee, selectedGoal, 'lowCarb')}
                    dietStyle="lowCarb"
                    isSelected={selectedDietStyle === 'lowCarb'}
                    onSelect={() => handleDietStyleChange('lowCarb')}
                  />
                  <MacroCard
                    macroResults={calculateMacros(results.tdee, selectedGoal, 'highCarb')}
                    dietStyle="highCarb"
                    isSelected={selectedDietStyle === 'highCarb'}
                    onSelect={() => handleDietStyleChange('highCarb')}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            Made with ❤️ and dedication by{' '}
            <a 
              href="https://juan-oclock.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-500 hover:text-yellow-400 transition-colors font-medium"
            >
              juan-oclock
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}