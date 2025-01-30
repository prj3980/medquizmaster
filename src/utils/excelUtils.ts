import * as XLSX from 'xlsx';

interface ExcelQuestion {
  Question: string;
  'Option A': string;
  'Option B': string;
  'Option C': string;
  'Option D': string;
  'Correct Option': string;
  Explanation: string;
  Chapter?: string;
}

export const generateTemplate = () => {
  const template = [{
    Question: 'What is the capital of France?',
    'Option A': 'London',
    'Option B': 'Paris',
    'Option C': 'Berlin',
    'Option D': 'Madrid',
    'Correct Option': 'B',
    Explanation: 'Paris is the capital and largest city of France.',
    Chapter: 'Geography'
  }];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(template);
  XLSX.utils.book_append_sheet(wb, ws, "Questions");
  XLSX.writeFile(wb, 'question_template.xlsx');
};

export const processExcelFile = async (file: File): Promise<ExcelQuestion[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('The Excel file is empty.');
        }
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        if (!worksheet || Object.keys(worksheet).length <= 1) {
          throw new Error('The Excel sheet is empty.');
        }
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelQuestion[];
        
        if (!jsonData || jsonData.length === 0) {
          throw new Error('No questions found in the Excel file.');
        }

        // Validate required fields
        const requiredFields = ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Option'];
        const hasRequiredFields = jsonData.every(row => 
          requiredFields.every(field => field in row)
        );

        if (!hasRequiredFields) {
          throw new Error('Missing required fields in Excel file. Please use the template provided.');
        }

        resolve(jsonData);
      } catch (error) {
        if (error instanceof Error) {
          reject(new Error(error.message));
        } else {
          reject(new Error('Error processing Excel file.'));
        }
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading the file.'));
    };

    reader.readAsArrayBuffer(file);
  });
};