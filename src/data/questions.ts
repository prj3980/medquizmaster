import { Question } from "@/types/question";

export const questions: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      text: "What is the function of the mitochondria?",
      options: [
        { id: "a", text: "Energy production" },
        { id: "b", text: "Protein synthesis" },
        { id: "c", text: "Waste removal" },
        { id: "d", text: "Cell division" }
      ],
      correctOption: "a",
      explanation:
        "Mitochondria are often referred to as the powerhouse of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
      isBookmarked: false,
    },
    {
      id: 2,
      text: "Which of the following is NOT a function of the liver?",
      options: [
        { id: "a", text: "Protein synthesis" },
        { id: "b", text: "Bile production" },
        { id: "c", text: "Oxygen transport" },
        { id: "d", text: "Detoxification" }
      ],
      correctOption: "c",
      explanation:
        "The liver has many functions including protein synthesis, bile production, and detoxification. Oxygen transport is primarily a function of red blood cells, not the liver.",
      isBookmarked: false,
    },
  ],
};