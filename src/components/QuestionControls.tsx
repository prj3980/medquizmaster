import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionControlsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const QuestionControls = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
}: QuestionControlsProps) => {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentQuestionIndex === totalQuestions - 1}
      >
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};