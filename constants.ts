
import { Question, InputType } from './types';

export const SURVEY_QUESTIONS: Question[] = [
  {
    id: 'fullName',
    title: 'What is your full name?',
    description: 'Please enter your legal first and last name.',
    inputType: InputType.TEXT,
    placeholder: 'e.g., Jane Doe',
    required: true,
  },
  {
    id: 'dob',
    title: 'What is your date of birth?',
    description: 'This helps us determine your current age.',
    inputType: InputType.DATE,
    required: true,
  },
  {
    id: 'maritalStatus',
    title: 'What is your current marital status?',
    description: 'Select the option that best describes you.',
    inputType: InputType.SELECT,
    options: ['Single', 'Married', 'Divorced', 'Widowed'],
    required: true,
  },
  {
    id: 'annualIncome',
    title: 'What is your estimated annual income?',
    description: 'Provide your gross income before taxes. Use numbers only.',
    inputType: InputType.NUMBER,
    placeholder: 'e.g., 75000',
    required: true,
  },
  {
    id: 'healthStatus',
    title: 'How would you rate your current health?',
    description: 'Be honest about your overall well-being.',
    inputType: InputType.SELECT,
    options: ['Excellent', 'Good', 'Fair', 'Poor'],
    required: true,
  },
  {
    id: 'existingConditions',
    title: 'Do you have any chronic health conditions?',
    description: 'e.g., Diabetes, Hypertension, Asthma. If none, write "None".',
    inputType: InputType.TEXT,
    placeholder: 'e.g., Hypertension',
    required: true,
  },
  {
    id: 'retirementSavings',
    title: 'What are your estimated retirement savings?',
    description: 'Include all retirement accounts like 401(k) and IRAs.',
    inputType: InputType.NUMBER,
    placeholder: 'e.g., 250000',
    required: true,
  },
];
