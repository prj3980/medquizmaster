import { useState } from "react";
import { motion } from "framer-motion";
import { SubjectCard } from "@/components/SubjectCard";
import { QuestionCard } from "@/components/QuestionCard";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data - replace with actual data from your backend
const subjects = [
  { id: 1, title: "Anatomy", totalQuestions: 150, progress: 65 },
  { id: 2, title: "Physiology", totalQuestions: 120, progress: 45 },
  { id: 3, title: "Biochemistry", totalQuestions: 100, progress: 30 },
  { id: 4, title: "Pathology", totalQuestions: 130, progress: 0 },
  { id: 5, title: "Microbiology", totalQuestions: 110, progress: 0 },
  { id: 6, title: "Pharmacology", totalQuestions: 140, progress: 0 },
  { id: 7, title: "Forensic Medicine", totalQuestions: 80, progress: 0 },
  { id: 8, title: "Community Medicine", totalQuestions: 100, progress: 0 },
  { id: 9, title: "General Medicine", totalQuestions: 160, progress: 0 },
  { id: 10, title: "General Surgery", totalQuestions: 150, progress: 0 },
  { id: 11, title: "Obstetrics & Gynecology", totalQuestions: 130, progress: 0 },
  { id: 12, title: "Pediatrics", totalQuestions: 120, progress: 0 },
  { id: 13, title: "Orthopedics", totalQuestions: 90, progress: 0 },
  { id: 14, title: "ENT", totalQuestions: 70, progress: 0 },
  { id: 15, title: "Ophthalmology", totalQuestions: 80, progress: 0 },
  { id: 16, title: "Psychiatry", totalQuestions: 60, progress: 0 },
  { id: 17, title: "Dermatology", totalQuestions: 70, progress: 0 },
  { id: 18, title: "Anesthesiology", totalQuestions: 60, progress: 0 },
  { id: 19, title: "Radiology", totalQuestions: 80, progress: 0 },
];

const sampleQuestions = [
  {
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
    isBookmarked: false,
  },
  {
    id: 2,
    text: "Which enzyme is responsible for converting angiotensin I to angiotensin II?",
    options: [
      { id: "a", text: "Renin" },
      { id: "b", text: "ACE (Angiotensin Converting Enzyme)" },
      { id: "c", text: "Aldosterone synthase" },
      { id: "d", text: "Chymase" },
    ],
    correctOption: "b",
    explanation:
      "Angiotensin Converting Enzyme (ACE) is responsible for converting angiotensin I to angiotensin II in the renin-angiotensin-aldosterone system.",
    isBookmarked: false,
  },
];

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [selectedOption, setSelectedOption] = useState<string>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState(sampleQuestions);
  const { toast } = useToast();

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

  const handleToggleBookmark = () => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[currentQuestionIndex];
    currentQuestion.isBookmarked = !currentQuestion.isBookmarked;
    setQuestions(updatedQuestions);

    toast({
      title: currentQuestion.isBookmarked
        ? "Question bookmarked"
        : "Bookmark removed",
      description: currentQuestion.isBookmarked
        ? "You can find this question in your bookmarks"
        : "Question removed from bookmarks",
    });
  };

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
          <p className="text-lg text-gray-600">Select a subject to start practicing</p>
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
        )}
      </div>
    </div>
  );
};

export default Index;