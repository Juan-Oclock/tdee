'use client';

import { useState } from 'react';

interface AccordionItem {
  title: string;
  content: string;
}

const accordionItems: AccordionItem[] = [
  {
    title: 'What is TDEE?',
    content: 'Your Total Daily Energy Expenditure (TDEE) is an estimate of how many calories you burn per day when exercise is taken into account. It is calculated by first figuring out your Basal Metabolic Rate (BMR), then multiplying that value by an activity multiplier.'
  },
  {
    title: 'What is BMR?',
    content: 'Your Basal Metabolic Rate (BMR) is the number of calories required to keep your body functioning at rest. BMR is also known as your body\'s metabolism; therefore, any increase to your metabolic weight, such as exercise, will increase your BMR. Your BMR is calculated using your age, sex, height, and weight.'
  },
  {
    title: 'How is TDEE Calculated?',
    content: 'TDEE is calculated using the Mifflin-St Jeor Equation, which is considered one of the most accurate BMR formulas. For men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) + 5. For women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) - 161. TDEE is then calculated as BMR × activity multiplier.'
  },
  {
    title: 'Activity Level Multipliers',
    content: 'Sedentary (little or no exercise): BMR × 1.2 | Lightly active (light exercise 1-3 days/week): BMR × 1.375 | Moderately active (moderate exercise 3-5 days/week): BMR × 1.55 | Very active (hard exercise 6-7 days/week): BMR × 1.725 | Extremely active (very hard exercise, physical job): BMR × 1.9'
  },
  {
    title: 'How to Use Your TDEE',
    content: 'To maintain your current weight: Eat at your TDEE | To lose weight: Create a calorie deficit by eating 300-500 calories less than your TDEE | To gain weight: Create a calorie surplus by eating 300-500 calories more than your TDEE. A safe rate of weight loss/gain is 0.5-1 kg (1-2 lbs) per week.'
  },
  {
    title: 'Maintenance',
    content: 'Maintenance is when you eat at your calculated TDEE to maintain your current body weight. This is ideal for those who are happy with their current physique and want to sustain their weight while maintaining muscle mass and energy levels.'
  },
  {
    title: 'Cutting',
    content: 'Cutting involves creating a calorie deficit (typically 300-500 calories below your TDEE) to lose body fat while preserving muscle mass. This phase is used when you want to reduce body fat percentage and achieve a leaner physique. The calculator automatically subtracts 500 calories from your TDEE for cutting.'
  },
  {
    title: 'Bulking',
    content: 'Bulking involves creating a calorie surplus (typically 300-500 calories above your TDEE) to build muscle mass. This phase is used when you want to increase muscle size and strength. The calculator automatically adds 500 calories to your TDEE for bulking. Focus on progressive overload in your workouts during this phase.'
  }
];

export default function InfoAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Understanding Your Results</h2>
        <div className="space-y-3">
          {accordionItems.map((item, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 py-4 text-left flex items-center justify-between text-gray-100 hover:text-yellow-400 transition-colors"
              >
                <span className="font-semibold text-sm">{item.title}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? 'rotate-180 text-yellow-500' : 'text-gray-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4">
                  <p className="text-gray-300 text-sm leading-relaxed">{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}