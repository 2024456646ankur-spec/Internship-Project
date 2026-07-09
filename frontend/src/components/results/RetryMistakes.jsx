import React from "react";
import { RotateCcw } from "lucide-react";
import Button from "../ui/Button";
import { useQuizEngine } from "../../hooks/useQuizEngine";

export default function RetryMistakes({ results }) {
  const { handleRetryMistakes } = useQuizEngine();

  if (!results?.mistakes?.length) return null;

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <p className="text-sm text-slate-400">
        You got <span className="text-red-400 font-semibold">{results.mistakes.length}</span> question{results.mistakes.length > 1 ? "s" : ""} wrong.
      </p>
      <Button variant="danger" onClick={handleRetryMistakes}>
        <RotateCcw size={15} />
        Retry Mistakes Only
      </Button>
    </div>
  );
}
