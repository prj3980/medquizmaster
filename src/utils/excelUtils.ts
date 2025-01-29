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
  // Create template data with clear example
  const template = [{
    Question: 'What is the capital of France?',
    'Option A': 'London',
    'Option B': 'Paris',
    'Option C': 'Berlin',
    'Option D': 'Madrid',
    'Correct Option': 'B',
    Explanation: 'Paris is the capital and largest city of France.'
  }];

  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert the template data to a worksheet
  const ws = XLSX.utils.json_to_sheet(template);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Questions");
  
  // Write the workbook to a file
  XLSX.writeFile(wb, 'question_template.xlsx');
};

export const processExcelFile = async (file: File): Promise<ExcelQuestion[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Check if workbook is empty
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('The Excel file is empty. Please use a valid template with data.');
        }
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Check if worksheet is empty
        if (!worksheet || Object.keys(worksheet).length <= 1) {
          throw new Error('The Excel sheet is empty. Please add questions using the template format.');
        }
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelQuestion[];

        // Check if there's any data
        if (!jsonData || jsonData.length === 0) {
          throw new Error('No questions found in the Excel file. Please add questions using the template format.');
        }

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
          throw new Error('Invalid Excel format. Please use the template provided by clicking "Download Template".');
        }

        resolve(jsonData);
      } catch (error) {
        if (error instanceof Error) {
          reject(new Error(error.message));
        } else {
          reject(new Error('Error processing Excel file. Please ensure you are using the correct template.'));
        }
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading the file. Please try again.'));
    };

    reader.readAsArrayBuffer(file);
  });
};