import { TErrorStateProps } from "@/types";
import { AlertTriangle } from "lucide-react";

export const ErrorState = ({
  title = "Something went wrong",
  description = "Please try again.",
}: TErrorStateProps) => {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
      <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
      <div>
        <p className="font-medium text-destructive">{title}</p>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
