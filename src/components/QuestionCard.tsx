import { motion, AnimatePresence } from "framer-motion";
import { Timer } from "./Timer";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { Button } from "./ui/button";

interface Option {
  id: string;
  text: string;
}

interface QuestionCardProps {
  question: string;
  options: Option[];
  selectedOption?: string;
  correctOption?: string;
  explanation?: string;
  onSelect: (optionId: string) => void;
  showExplanation: boolean;
  timeLimit: number;
  onTimeUp: () => void;
  className?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  isSubmitted?: boolean;
  onSubmit?: () => void;
}

export const QuestionCard = ({
  question,
  options,
  selectedOption,
  correctOption,
  explanation,
  onSelect,
  showExplanation,
  timeLimit,
  onTimeUp,
  className,
  isBookmarked,
  onToggleBookmark,
  isSubmitted,
  onSubmit,
}: QuestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "rounded-xl bg-white p-6 shadow-lg",
        "border border-gray-100",
        className
      )}
    >
      <div className="mb-6 flex items-start justify-between">
        <Timer duration={timeLimit} onComplete={onTimeUp} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleBookmark}
          className={cn(
            "transition-colors",
            isBookmarked && "text-yellow-500 hover:text-yellow-600"
          )}
        >
          <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current")} />
        </Button>
      </div>

      <h2 className="mb-6 text-xl font-semibold text-gray-900">{question}</h2>

      <div className="space-y-4">
        {options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(option.id)}
            className={cn(
              "w-full rounded-lg border p-4 text-left transition-all",
              "hover:border-primary hover:bg-primary/5",
              selectedOption === option.id && "border-primary bg-primary/5",
              isSubmitted && correctOption === option.id && "border-green-500 bg-green-50",
              isSubmitted && selectedOption === option.id &&
                correctOption !== option.id &&
                "border-red-500 bg-red-50"
            )}
            disabled={isSubmitted}
          >
            <span className="text-gray-900">{option.text}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-6">
        <Button 
          onClick={onSubmit} 
          disabled={!selectedOption || isSubmitted}
          className="w-full"
        >
          Submit Answer
        </Button>
      </div>

      <AnimatePresence>
        {showExplanation && explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden rounded-lg bg-gray-50 p-4"
          >
            <h3 className="mb-2 font-semibold text-gray-900">Explanation</h3>
            <p className="text-gray-700">{explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};