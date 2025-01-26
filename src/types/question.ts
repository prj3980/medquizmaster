export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctOption: string;
  explanation: string;
  isBookmarked?: boolean;
}