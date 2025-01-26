import { motion, AnimatePresence } from "framer-motion";
import { Timer } from "./Timer";
import { cn } from "@/lib/utils";

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
      <Timer duration={timeLimit} onComplete={onTimeUp} className="mb-6" />

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
              correctOption === option.id && "border-green-500 bg-green-50",
              selectedOption === option.id &&
                correctOption !== option.id &&
                "border-red-500 bg-red-50"
            )}
            disabled={!!selectedOption}
          >
            <span className="text-gray-900">{option.text}</span>
          </motion.button>
        ))}
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