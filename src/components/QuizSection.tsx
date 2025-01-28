import { useState, useEffect, useRef } from "react";
import { QuestionCard } from "./QuestionCard";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Download, Upload } from "lucide-react";
import { Question } from "@/types/question";
import { useToast } from "./ui/use-toast";
import { getQuestions, updateBookmark, addQuestion } from "@/services/questionService";
import { generateTemplate, processExcelFile } from "@/utils/excelUtils";

interface QuizSectionProps {
  subjectId: number;
  onBack: () => void;
}

export const QuizSection = ({ subjectId, onBack }: QuizSectionProps) => {
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [selectedOption, setSelectedOption] = useState<string>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const loadedQuestions = await getQuestions(subjectId);
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error("Error loading questions:", error);
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive",
        });
      }
    };
    loadQuestions();
  }, [subjectId, toast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const processedQuestions = await processExcelFile(file);
      
      // Add each question to the database
      for (const question of processedQuestions) {
        const { id, ...questionData } = question;
        await addQuestion(subjectId, questionData);
      }

      // Reload questions
      const loadedQuestions = await getQuestions(subjectId);
      setQuestions(loadedQuestions);

      toast({
        title: "Success",
        description: "Questions imported successfully",
      });
    } catch (error) {
      console.error("Error importing questions:", error);
      toast({
        title: "Error",
        description: "Failed to import questions. Please check the file format.",
        variant: "destructive",
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(undefined);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption(undefined);
    }
  };

  const handleToggleBookmark = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const newBookmarkStatus = !currentQuestion.isBookmarked;
    
    try {
      await updateBookmark(subjectId, currentQuestion.id.toString(), newBookmarkStatus);
      
      setQuestions(questions.map((q, idx) => 
        idx === currentQuestionIndex ? { ...q, isBookmarked: newBookmarkStatus } : q
      ));

      toast({
        title: newBookmarkStatus ? "Question bookmarked" : "Bookmark removed",
        description: newBookmarkStatus
          ? "You can find this question in your bookmarks"
          : "Question removed from bookmarks",
      });
    } catch (error) {
      console.error("Error updating bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
        >
          ← Back to Subjects
        </button>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Questions
          </Button>
          <Button
            variant="outline"
            onClick={generateTemplate}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>
      </div>

      <QuestionCard
        question={questions[currentQuestionIndex].text}
        options={questions[currentQuestionIndex].options}
        selectedOption={selectedOption}
        correctOption={questions[currentQuestionIndex].correctOption}
        explanation={questions[currentQuestionIndex].explanation}
        onSelect={setSelectedOption}
        showExplanation={mode === "practice" && !!selectedOption}
        timeLimit={60}
        onTimeUp={() => console.log("Time's up!")}
        isBookmarked={questions[currentQuestionIndex].isBookmarked}
        onToggleBookmark={handleToggleBookmark}
      />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
