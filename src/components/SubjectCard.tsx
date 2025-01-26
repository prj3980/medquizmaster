import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  title: string;
  progress: number;
  totalQuestions: number;
  onClick: () => void;
  className?: string;
}

export const SubjectCard = ({
  title,
  progress,
  totalQuestions,
  onClick,
  className,
}: SubjectCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl",
        "border border-gray-100",
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {Math.round(progress)}% Complete
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">
            {totalQuestions} questions available
          </p>
        </div>
      </div>
    </motion.div>
  );
};