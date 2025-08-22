Product Requirements Document: TDEE Calculator
1. Overview & Objectives

Product Name: CalorieCalc (or a name of your choice)
Project: TDEE (Total Daily Energy Expenditure) Calculator Web App.
Description: A modern, minimal, and mobile-friendly web application that allows users to calculate their estimated daily calorie expenditure (TDEE) and Basal Metabolic Rate (BMR) based on key personal metrics.

Primary Objectives:

    Provide users with a quick, accurate, and easy-to-use TDEE calculation.

    Deliver a superior user experience with a focus on mobile devices.

    Educate users on the factors influencing their metabolic rate.

    Establish a clean, modern brand identity with a distinctive dark and yellow theme.

2. User Stories & Features

Epic: As a new health-conscious user, I want to calculate my TDEE so I can inform my diet and fitness goals.

    User Story 1: As a user, I want to input my personal details (age, gender, weight, height, activity level) so the calculator can be accurate.

        Feature: Input form with validated fields and unit toggles.

    User Story 2: As a user, I want to understand what each activity level means so I can select the most appropriate one.

        Feature: Descriptive tooltips or labels for the activity level dropdown.

    User Story 3: As a user, I want to submit my data and see my BMR and TDEE results presented clearly and immediately.

        Feature: Dynamic results display section that updates upon form submission/change.

    User Story 4: As a user, I want my results to be persistent during my session so I can refer back to them if I change a single input.

        Feature: State management that re-calculates on input change ("live" calculation).

    User Story 5: As a user, I want the app to work flawlessly on my mobile phone.

        Feature: Fully responsive design using Tailwind CSS.

3. Design Specifications

    Framework: Next.js 14 (App Router)

    Styling: Tailwind CSS

    Design Principles: Modern, Minimal, Mobile-First.

Color Scheme:

    Primary Background: bg-gray-950 (Near black)

    Card/Surface Background: bg-gray-900 or bg-gray-800

    Primary Text: text-gray-100 (White) / text-gray-400 (Lighter gray for labels)

    Accent Color: yellow-500 (#EAB308)

        Usage: Buttons, key result numbers, highlights, hover states.

    Ensure sufficient contrast between text and background for accessibility.

UI Components:

    A central card component housing the form and results.

    Inputs: Rounded, with a dark background and light border.

    Buttons: Rounded, with a solid yellow background that darkens on hover (hover:bg-yellow-600).

    Results: Displayed in a distinct section within the card. BMR and TDEE values should be in a large, bold font size (text-3xl or text-4xl) and yellow.

4. Technical Specifications

Core Technologies:

    Frontend Framework: Next.js 14

    Language: TypeScript

    Styling: Tailwind CSS

    Deployment: Vercel (Recommended)

Project Structure:
/src
  /app
    layout.tsx          # Root layout with HTML and body tags
    page.tsx            # Homepage containing the main calculator
  /lib
    calculations.ts     # Utility functions for BMR/TDEE formulas
  /types
    index.ts           # TypeScript interfaces (e.g., UserData)

Key Functional Requirements:

    Form Inputs:

        Gender: Radio button (Male, Female)

        Age: Number input (years)

        Weight: Number input + toggle button (kg / lbs)

        Height: Number input + toggle button (cm / ft+in - future enhancement, start with cm)

        Activity Level: Dropdown select with options and multipliers:

            Sedentary (little exercise) - 1.2

            Lightly Active (1-3 days/week) - 1.375

            Moderately Active (3-5 days/week) - 1.55

            Very Active (6-7 days/week) - 1.725

            Extremely Active (physical job) - 1.9

        Formula (Optional): Radio button (Mifflin-St Jeor (default), Harris-Benedict)

    Calculation Logic (lib/calculations.ts):

        Implement the Mifflin-St Jeor formula:

            BMR (Male): 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5

            BMR (Female): 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) - 161

        TDEE: BMR * Activity Multiplier

        Functions must handle unit conversion (lbs to kg) internally.

    State & Interactivity:

        Use React's useState to manage all form fields and results.

        Use useEffect to trigger calculation on form state change for a "live" result experience.

        Input validation to prevent non-numeric entries in number fields.

5. Milestones & Timeline

    Milestone 1: Project Setup & UI Shell (Day 1)

        ✅ Initialize Next.js app with TypeScript and Tailwind.

        ✅ Implement base layout with dark theme.

        ✅ Create responsive card component.

    Milestone 2: Core Functionality (Day 2)

        ✅ Build the form component with all inputs.

        ✅ Write and test calculation utility functions.

        ✅ Connect form state to calculation logic.

        ✅ Implement dynamic results display.

    Milestone 3: Polish & Deployment (Day 3)

        ✅ Add unit conversion (kg/lbs).

        ✅ Final UI polish (spacing, hover states, focus rings).

        ✅ Perform responsiveness testing on various devices.

        ✅ Deploy to Vercel.

6. Success Metrics

    Performance: Largest Contentful Paint (LCP) < 2.5 seconds.

    Usability: >95% of users who enter data see a result (no form errors).

    Engagement: Low bounce rate (<40%) on the landing page.

7. Out of Scope (V2 Considerations)

    User accounts/profiles to save history.

    Advanced results (macronutrient breakdown, calorie goals for cutting/bulking).

    Integration with health APIs (Apple Health, Google Fit).

    "Fat Percentage" input for more accurate Katch-McArdle formula.

    Multi-language support.