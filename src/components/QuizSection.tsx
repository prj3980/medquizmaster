import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { QuestionControls } from "./QuestionControls";
import { QuestionActions } from "./QuestionActions";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { updateBookmark, addQuestion } from "@/services/questionService";
import { generateTemplate, processExcelFile } from "@/utils/excelUtils";
import * as XLSX from 'xlsx';
import { useQuestions } from "@/hooks/useQuestions";

interface QuizSectionProps {
  subjectId: number;
  onBack: () => void;
}

export const QuizSection = ({ subjectId, onBack }: QuizSectionProps) => {
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [selectedOption, setSelectedOption] = useState<string>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { questions, setQuestions } = useQuestions(subjectId);
  const { toast } = useToast();

  const handleExportQuestions = () => {
    try {
      const exportData = questions.map(q => ({
        Question: q.text,
        'Option A': q.options[0].text,
        'Option B': q.options[1].text,
        'Option C': q.options[2].text,
        'Option D': q.options[3].text,
        'Correct Option': q.correctOption,
        Explanation: q.explanation
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, "Questions");
      XLSX.writeFile(wb, `questions_subject_${subjectId}.xlsx`);

      toast({
        title: "Success",
        description: "Questions exported successfully",
      });
    } catch (error) {
      console.error("Error exporting questions:", error);
      toast({
        title: "Error",
        description: "Failed to export questions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const processedQuestions = await processExcelFile(file);
      
      // Process each question sequentially
      for (const question of processedQuestions) {
        await addQuestion(subjectId, {
          text: question.text,
          options: [
            { id: "a", text: question["Option A"] },
            { id: "b", text: question["Option B"] },
            { id: "c", text: question["Option C"] },
            { id: "d", text: question["Option D"] }
          ],
          correctOption: question["Correct Option"].toLowerCase(),
          explanation: question.Explanation,
          isBookmarked: false
        });
      }

      // Fetch updated questions
      const { questions: updatedQuestions } = useQuestions(subjectId);
      setQuestions(updatedQuestions);

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
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>← Back to Subjects</Button>
          <QuestionActions
            mode={mode}
            onModeChange={setMode}
            onExport={handleExportQuestions}
            onImport={handleFileUpload}
            onDownloadTemplate={generateTemplate}
          />
        </div>
        <div className="text-center py-8">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>← Back to Subjects</Button>
        <QuestionActions
          mode={mode}
          onModeChange={setMode}
          onExport={handleExportQuestions}
          onImport={handleFileUpload}
          onDownloadTemplate={generateTemplate}
        />
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

      <QuestionControls
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onPrevious={() => {
          setCurrentQuestionIndex((prev) => prev - 1);
          setSelectedOption(undefined);
        }}
        onNext={() => {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedOption(undefined);
        }}
      />
    </div>
  );
};
