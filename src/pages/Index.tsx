import { useState } from "react";
import { motion } from "framer-motion";
import { SubjectCard } from "@/components/SubjectCard";
import { QuestionCard } from "@/components/QuestionCard";
import { ModeToggle } from "@/components/ModeToggle";

// Mock data - replace with actual data from your backend
const subjects = [
  { id: 1, title: "Anatomy", totalQuestions: 150, progress: 65 },
  { id: 2, title: "Physiology", totalQuestions: 120, progress: 45 },
  { id: 3, title: "Biochemistry", totalQuestions: 100, progress: 30 },
  // Add more subjects...
];

const sampleQuestion = {
  id: 1,
  text: "Which of the following is a characteristic feature of cardiac muscle?",
  options: [
    { id: "a", text: "Voluntary control" },
    { id: "b", text: "Presence of intercalated discs" },
    { id: "c", text: "Absence of striations" },
    { id: "d", text: "Multinucleated cells" },
  ],
  correctOption: "b",
  explanation:
    "Cardiac muscle cells are characterized by the presence of intercalated discs, which are specialized junctions that allow for rapid electrical conduction between cells.",
};

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [selectedOption, setSelectedOption] = useState<string>();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-4xl font-bold text-gray-900">MBBS MCQ Practice</h1>
          <p className="text-lg text-gray-600">
            Select a subject to start practicing
          </p>
        </motion.div>

        {!selectedSubject ? (
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
                  onClick={() => setSelectedSubject(subject.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedSubject(null)}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
              >
                ← Back to Subjects
              </button>
              <ModeToggle mode={mode} onChange={setMode} />
            </div>

            <QuestionCard
              question={sampleQuestion.text}
              options={sampleQuestion.options}
              selectedOption={selectedOption}
              correctOption={sampleQuestion.correctOption}
              explanation={sampleQuestion.explanation}
              onSelect={setSelectedOption}
              showExplanation={mode === "practice" && !!selectedOption}
              timeLimit={30}
              onTimeUp={() => console.log("Time's up!")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;