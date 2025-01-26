import { Question } from "@/types/question";

export const questions: Record<number, Question[]> = {
  1: [
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
  ],
};