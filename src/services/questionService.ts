import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Question } from '@/types/question';

export const getQuestions = async (subjectId: number) => {
  const questionsCol = collection(db, `subjects/${subjectId}/questions`);
  const questionSnapshot = await getDocs(questionsCol);
  return questionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
};

export const addQuestion = async (subjectId: number, question: Omit<Question, 'id'>) => {
  const questionsCol = collection(db, `subjects/${subjectId}/questions`);
  return await addDoc(questionsCol, question);
};

export const updateBookmark = async (subjectId: number, questionId: string, isBookmarked: boolean) => {
  const questionRef = doc(db, `subjects/${subjectId}/questions/${questionId}`);
  return await updateDoc(questionRef, { isBookmarked });
};