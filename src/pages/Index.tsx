import { useState } from "react";
import { motion } from "framer-motion";
import { SubjectGrid } from "@/components/SubjectGrid";
import { QuizSection } from "@/components/QuizSection";
import { subjects } from "@/data/subjects";
import { questions } from "@/data/questions";

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            MBBS MCQ Practice
          </h1>
          <p className="text-lg text-gray-600">
            Select a subject to start practicing
          </p>
        </motion.div>

        {!selectedSubject ? (
          <SubjectGrid
            subjects={subjects}
            onSelectSubject={setSelectedSubject}
          />
        ) : (
          <QuizSection
            questions={questions[selectedSubject] || []}
            onBack={() => setSelectedSubject(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;