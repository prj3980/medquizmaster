import { Question } from "@/types/question";

const STORAGE_KEY_PREFIX = 'subject_questions_';

export const getQuestions = async (subjectId: number): Promise<Question[]> => {
  const storageKey = `${STORAGE_KEY_PREFIX}${subjectId}`;
  const storedQuestions = localStorage.getItem(storageKey);
  return storedQuestions ? JSON.parse(storedQuestions) : [];
};

export const addQuestions = async (subjectId: number, questions: Question[]): Promise<void> => {
  const storageKey = `${STORAGE_KEY_PREFIX}${subjectId}`;
  localStorage.setItem(storageKey, JSON.stringify(questions));
};

export const updateBookmark = async (subjectId: number, questionId: string, isBookmarked: boolean): Promise<void> => {
  const questions = await getQuestions(subjectId);
  const updatedQuestions = questions.map(q => 
    q.id.toString() === questionId ? { ...q, isBookmarked } : q
  );
  await addQuestions(subjectId, updatedQuestions);
};

export const addQuestion = async (subjectId: number, questionData: Omit<Question, "id">): Promise<void> => {
  const questions = await getQuestions(subjectId);
  const newQuestion = {
    ...questionData,
    id: questions.length + 1
  };
  await addQuestions(subjectId, [...questions, newQuestion]);
};