import { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { getQuestions } from "@/services/questionService";
import { useToast } from "@/components/ui/use-toast";

export const useQuestions = (subjectId: number) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const loadedQuestions = await getQuestions(subjectId);
        setQuestions(loadedQuestions);
        updateSubjectData(loadedQuestions.length);
      } catch (error) {
        console.error("Error loading questions:", error);
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive",
        });
      }
    };

    const updateSubjectData = (questionCount: number) => {
      try {
        const subjectsJson = localStorage.getItem('subjects');
        if (!subjectsJson) return;
        
        const subjects = JSON.parse(subjectsJson);
        
        const updatedSubjects = subjects.map((subject: any) => ({
          id: subject.id,
          title: subject.title,
          totalQuestions: subject.id === subjectId ? questionCount : subject.totalQuestions,
          progress: subject.progress || 0
        }));

        localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      } catch (error) {
        console.error("Error updating subject data:", error);
      }
    };

    loadQuestions();
  }, [subjectId, toast]);

  return { questions, setQuestions };
};