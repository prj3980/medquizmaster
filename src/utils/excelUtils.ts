import * as XLSX from 'xlsx';
import { Question, Option } from '@/types/question';

export const generateTemplate = () => {
  const template = [
    ['Chapter', 'Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Option', 'Explanation']
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(template);
  XLSX.utils.book_append_sheet(wb, ws, 'Questions Template');
  XLSX.writeFile(wb, 'questions_template.xlsx');
};

export const processExcelFile = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

        // Skip header row
        const questions: Question[] = jsonData.slice(1).map((row, index) => {
          const [chapter, text, optionA, optionB, optionC, optionD, correctOption, explanation] = row;
          
          const options: Option[] = [
            { id: 'a', text: optionA },
            { id: 'b', text: optionB },
            { id: 'c', text: optionC },
            { id: 'd', text: optionD },
          ];

          return {
            id: index + 1,
            text,
            options,
            correctOption: correctOption.toLowerCase(),
            explanation,
            isBookmarked: false,
          };
        });

        resolve(questions);
      } catch (error) {
        reject(new Error('Error processing Excel file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsArrayBuffer(file);
  });
};