import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Question } from '@/types/question';

export const getQuestions = async (subjectId: number): Promise<Question[]> => {
  const questionsCol = collection(db, `subjects/${subjectId}/questions`);
  const questionSnapshot = await getDocs(questionsCol);
  
  return questionSnapshot.docs.map(doc => {
    const data = doc.data();
    // Create a new object with only the required properties
    return {
      id: parseInt(doc.id),
      text: data.text || '',
      options: data.options || [],
      correctOption: data.correctOption || '',
      explanation: data.explanation || '',
      isBookmarked: !!data.isBookmarked
    };
  });
};

export const addQuestion = async (subjectId: number, question: Omit<Question, 'id'>) => {
  const questionsCol = collection(db, `subjects/${subjectId}/questions`);
  // Create a clean object without any circular references
  const cleanQuestion = {
    text: question.text,
    options: question.options,
    correctOption: question.correctOption,
    explanation: question.explanation,
    isBookmarked: question.isBookmarked || false
  };
  return await addDoc(questionsCol, cleanQuestion);
};

export const updateBookmark = async (subjectId: number, questionId: string, isBookmarked: boolean) => {
  const questionRef = doc(db, `subjects/${subjectId}/questions/${questionId}`);
  return await updateDoc(questionRef, { isBookmarked });
};