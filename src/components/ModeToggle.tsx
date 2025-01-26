import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  mode: "practice" | "exam";
  onChange: (mode: "practice" | "exam") => void;
  className?: string;
}

export const ModeToggle = ({ mode, onChange, className }: ModeToggleProps) => {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg bg-gray-100 p-1",
        className
      )}
    >
      {["practice", "exam"].map((m) => (
        <button
          key={m}
          onClick={() => onChange(m as "practice" | "exam")}
          className={cn(
            "relative px-4 py-2 text-sm font-medium capitalize",
            "transition-colors",
            mode === m ? "text-white" : "text-gray-600"
          )}
        >
          {mode === m && (
            <motion.div
              layoutId="mode-toggle-active"
              className="absolute inset-0 rounded-md bg-primary"
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{m}</span>
        </button>
      ))}
    </div>
  );
};