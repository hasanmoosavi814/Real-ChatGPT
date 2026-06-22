import { Loader2 } from "lucide-react";

export const LoadingState = ({ label = "Loading..." }: { label?: string }) => {
  return (
    <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
};
