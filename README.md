# TDEE Calculator

A modern, responsive Total Daily Energy Expenditure (TDEE) calculator built with Next.js, React, and TypeScript. Calculate your daily calorie needs and macronutrient distribution based on your goals.

## Features

- **TDEE Calculation**: Calculate your Total Daily Energy Expenditure using the Mifflin-St Jeor equation
- **BMR Calculation**: Determine your Basal Metabolic Rate
- **Macronutrient Planning**: Get personalized macro recommendations for different diet styles
- **Goal-Based Calorie Targets**: Maintenance, Cutting (-500 calories), and Bulking (+500 calories) modes
- **Multiple Diet Styles**: Moderate (30P/35F/35C), Low Carb (40P/40F/20C), and High Carb (30P/20F/50C) options
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Unit Conversion**: Switch between metric (kg/cm) and imperial (lbs/ft+in) units

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. Enter your personal information (gender, age, weight, height)
2. Select your activity level
3. Click "Calculate TDEE" to see your results
4. Choose your goal (Maintenance, Cutting, or Bulking)
5. Select your preferred diet style (Moderate, Low Carb, or High Carb)
6. View your personalized macronutrient breakdown

## Technology Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React** - UI library

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - React components
- `/src/lib` - Utility functions and calculations
- `/src/types` - TypeScript type definitions

## Calculations

The calculator uses the Mifflin-St Jeor equation for BMR calculation:
- **Men**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) + 5
- **Women**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) - 161

TDEE is calculated as: BMR × activity multiplier

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
