import { motion } from "framer-motion";
import { SubjectCard } from "./SubjectCard";
import { Subject } from "@/types/subject";

interface SubjectGridProps {
  subjects: Subject[];
  onSelectSubject: (id: number) => void;
}

export const SubjectGrid = ({ subjects, onSelectSubject }: SubjectGridProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {subjects.map((subject, index) => (
        <motion.div
          key={subject.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <SubjectCard
            title={subject.title}
            progress={subject.progress}
            totalQuestions={subject.totalQuestions}
            onClick={() => onSelectSubject(subject.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};