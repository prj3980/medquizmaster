import { Question } from "@/types/question";
import { questions as mockQuestions } from "@/data/questions";

export const getQuestions = async (subjectId: number): Promise<Question[]> => {
  // Simulating API call with mock data
  return mockQuestions[subjectId] || [];
};

export const updateBookmark = async (
  subjectId: number,
  questionId: string,
  isBookmarked: boolean
): Promise<void> => {
  // Simulating API call
  console.log(`Updating bookmark for question ${questionId} to ${isBookmarked}`);
};

export const addQuestion = async (
  subjectId: number,
  questionData: Omit<Question, "id">
): Promise<void> => {
  // Simulating API call
  console.log(`Adding question to subject ${subjectId}:`, questionData);
};