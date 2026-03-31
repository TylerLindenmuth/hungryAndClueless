export interface Meal {
  id: string;
  name: string;
  category: string;
  tags: string[];
  prepTime?: string;
  cuisine?: string;
  flavorTags: string[];
  timeOfDayTags: string[];
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  meals: Meal[];
}

export interface QuizAnswers {
  category?: string;
  cuisine?: string;
  prepTime?: string;
  tags?: string[];
}
