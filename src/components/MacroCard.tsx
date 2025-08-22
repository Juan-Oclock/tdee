'use client';

import { MacroResults } from '@/lib/calculations';

interface MacroCardProps {
  macroResults: MacroResults;
  dietStyle: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function MacroCard({ macroResults, dietStyle, isSelected, onSelect }: MacroCardProps) {
  const getDietStyleLabel = (style: string) => {
    switch (style) {
      case 'moderate':
        return 'Moderate Carb';
      case 'lowCarb':
        return 'Lower Carb';
      case 'highCarb':
        return 'Higher Carb';
      default:
        return style;
    }
  };

  const getDietStyleDescription = (style: string) => {
    switch (style) {
      case 'moderate':
        return '40% Carbs, 30% Protein, 30% Fat';
      case 'lowCarb':
        return '25% Carbs, 35% Protein, 40% Fat';
      case 'highCarb':
        return '50% Carbs, 30% Protein, 20% Fat';
      default:
        return '';
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-yellow-500 bg-yellow-500/10'
          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-100">{getDietStyleLabel(dietStyle)}</h3>
        <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-yellow-500' : 'bg-gray-600'}`} />
      </div>
      
      <p className="text-sm text-gray-400 mb-4">{getDietStyleDescription(dietStyle)}</p>
      
      <div className="bg-gray-900 rounded-lg p-3 mb-3">
        <p className="text-lg font-bold text-yellow-500 text-center">
          {macroResults.calories.toLocaleString()} calories
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Carbs</span>
          <span className="font-semibold text-gray-100">{macroResults.carbs}g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Protein</span>
          <span className="font-semibold text-gray-100">{macroResults.protein}g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Fat</span>
          <span className="font-semibold text-gray-100">{macroResults.fat}g</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{Math.round(macroResults.carbsPercentage)}% Carbs</span>
          <span>{Math.round(macroResults.proteinPercentage)}% Protein</span>
          <span>{Math.round(macroResults.fatPercentage)}% Fat</span>
        </div>
      </div>
    </div>
  );
}