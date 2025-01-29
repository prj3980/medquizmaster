import * as XLSX from 'xlsx';

interface ExcelQuestion {
  Question: string;
  'Option A': string;
  'Option B': string;
  'Option C': string;
  'Option D': string;
  'Correct Option': string;
  Explanation: string;
}

export const generateTemplate = () => {
  const template = [
    {
      Question: 'Sample question text here',
      'Option A': 'First option',
      'Option B': 'Second option',
      'Option C': 'Third option',
      'Option D': 'Fourth option',
      'Correct Option': 'A',
      Explanation: 'Explanation for the correct answer'
    }
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(template);
  XLSX.writeFile(wb, 'question_template.xlsx');
};

export const processExcelFile = async (file: File): Promise<ExcelQuestion[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with type assertion
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelQuestion[];

        // Validate the data format
        const isValidFormat = jsonData.every(row => 
          'Question' in row &&
          'Option A' in row &&
          'Option B' in row &&
          'Option C' in row &&
          'Option D' in row &&
          'Correct Option' in row &&
          'Explanation' in row
        );

        if (!isValidFormat) {
          throw new Error('Invalid Excel format. Please use the template.');
        }

        resolve(jsonData);
      } catch (error) {
        reject(new Error('Error processing Excel file. Please ensure you are using the correct template.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading the file'));
    };

    reader.readAsArrayBuffer(file);
  });
};