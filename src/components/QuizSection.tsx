import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { QuestionControls } from "./QuestionControls";
import { QuestionActions } from "./QuestionActions";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { updateBookmark, addQuestions, getQuestions } from "@/services/questionService";
import { generateTemplate, processExcelFile } from "@/utils/excelUtils";
import * as XLSX from 'xlsx';
import { useQuestions } from "@/hooks/useQuestions";
import { QuizSectionProps } from "@/types/quiz";

export const QuizSection = ({ subjectId, onBack }: QuizSectionProps) => {
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [selectedOption, setSelectedOption] = useState<string>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { questions, setQuestions } = useQuestions(subjectId);
  const { toast } = useToast();
  const [currentChapter, setCurrentChapter] = useState<string>("");
  const chapters = [...new Set(questions.map(q => q.chapter || 'General'))];

  const handleExportQuestions = () => {
    try {
      const exportData = questions.map(q => ({
        Question: q.text,
        'Option A': q.options[0].text,
        'Option B': q.options[1].text,
        'Option C': q.options[2].text,
        'Option D': q.options[3].text,
        'Correct Option': q.correctOption,
        Explanation: q.explanation,
        Chapter: q.chapter || 'General'
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
      
      // Create questions array with IDs
      const questionsWithIds = processedQuestions.map((question, index) => ({
        id: index + 1,
        text: question.Question,
        options: [
          { id: "a", text: question["Option A"] },
          { id: "b", text: question["Option B"] },
          { id: "c", text: question["Option C"] },
          { id: "d", text: question["Option D"] }
        ],
        correctOption: question["Correct Option"].toLowerCase(),
        explanation: question.Explanation,
        isBookmarked: false,
        chapter: question.Chapter
      }));

      // Replace all questions for this subject
      await addQuestions(subjectId, questionsWithIds);

      // Update the local state
      setQuestions(questionsWithIds);

      // Update subject's total questions count in localStorage
      const subjectsJson = localStorage.getItem('subjects');
      if (subjectsJson) {
        const subjects = JSON.parse(subjectsJson);
        const updatedSubjects = subjects.map((subject: any) => {
          if (subject.id === subjectId) {
            return { ...subject, totalQuestions: questionsWithIds.length };
          }
          return subject;
        });
        localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      }

      toast({
        title: "Success",
        description: `${questionsWithIds.length} questions imported successfully`,
      });
    } catch (error) {
      console.error("Error importing questions:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import questions",
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

  const filteredQuestions = currentChapter 
    ? questions.filter(q => (q.chapter || 'General') === currentChapter)
    : questions;

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
        <div className="text-center py-8">No questions available</div>
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

      {chapters.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={currentChapter === "" ? "default" : "outline"}
            onClick={() => setCurrentChapter("")}
          >
            All Chapters
          </Button>
          {chapters.map((chapter) => (
            <Button
              key={chapter}
              variant={currentChapter === chapter ? "default" : "outline"}
              onClick={() => setCurrentChapter(chapter)}
            >
              {chapter}
            </Button>
          ))}
        </div>
      )}

      <QuestionCard
        question={filteredQuestions[currentQuestionIndex].text}
        options={filteredQuestions[currentQuestionIndex].options}
        selectedOption={selectedOption}
        correctOption={filteredQuestions[currentQuestionIndex].correctOption}
        explanation={filteredQuestions[currentQuestionIndex].explanation}
        onSelect={setSelectedOption}
        showExplanation={mode === "practice" && !!selectedOption}
        timeLimit={60}
        onTimeUp={() => console.log("Time's up!")}
        isBookmarked={filteredQuestions[currentQuestionIndex].isBookmarked}
        onToggleBookmark={handleToggleBookmark}
      />

      <QuestionControls
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={filteredQuestions.length}
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
