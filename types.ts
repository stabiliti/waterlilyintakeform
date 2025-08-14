
export enum InputType {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT = 'select',
  DATE = 'date',
}

export interface Question {
  id: string;
  title: string;
  description: string;
  inputType: InputType;
  options?: string[]; // For SELECT type
  placeholder?: string;
  required?: boolean;
}

export type Answers = Record<string, string>;

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}
