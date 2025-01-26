import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Question } from '@/types/question';

export const getQuestions = async (subjectId: number): Promise<Question[]> => {
  const questionsCol = collection(db, `subjects/${subjectId}/questions`);
  const questionSnapshot = await getDocs(questionsCol);
  return questionSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: parseInt(doc.id), // Convert string ID to number
      text: data.text,
      options: data.options,
      correctOption: data.correctOption,
      explanation: data.explanation,
      isBookmarked: data.isBookmarked || false
    } as Question;
  });
};

export const addQuestion = async (subjectId: number, question: Omit<Question, 'id'>) => {
  const questionsCol = collection(db, `subjects/${subjectId}/questions`);
  return await addDoc(questionsCol, question);
};

export const updateBookmark = async (subjectId: number, questionId: string, isBookmarked: boolean) => {
  const questionRef = doc(db, `subjects/${subjectId}/questions/${questionId}`);
  return await updateDoc(questionRef, { isBookmarked });
};