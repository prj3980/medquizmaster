import { Button } from "./ui/button";
import { Download, Upload } from "lucide-react";
import { useRef } from "react";
import { ModeToggle } from "./ModeToggle";

interface QuestionActionsProps {
  mode: "practice" | "exam";
  onModeChange: (mode: "practice" | "exam") => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
}

export const QuestionActions = ({
  mode,
  onModeChange,
  onExport,
  onImport,
  onDownloadTemplate,
}: QuestionActionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={onImport}
        ref={fileInputRef}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Import Questions
      </Button>
      <Button
        variant="outline"
        onClick={onDownloadTemplate}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download Template
      </Button>
      <Button
        variant="outline"
        onClick={onExport}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export Questions
      </Button>
      <ModeToggle mode={mode} onChange={onModeChange} />
    </div>
  );
};