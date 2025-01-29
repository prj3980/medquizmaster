import { Question } from "@/types/question";

export const questions: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      text: "What is the function of the mitochondria?",
      options: [
        "Energy production",
        "Protein synthesis",
        "Waste removal",
        "Cell division",
      ],
      correctOption: "Energy production",
      explanation:
        "Mitochondria are often referred to as the powerhouse of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
      isBookmarked: false,
    },
    {
      id: 2,
      text: "Which of the following is NOT a function of the liver?",
      options: [
        "Protein synthesis",
        "Bile production",
        "Oxygen transport",
        "Detoxification",
      ],
      correctOption: "Oxygen transport",
      explanation:
        "The liver has many functions including protein synthesis, bile production, and detoxification. Oxygen transport is primarily a function of red blood cells, not the liver.",
      isBookmarked: false,
    },
  ],
};