import { BotMessageSquare } from "lucide-react";

export const AppLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <BotMessageSquare className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold leading-none">Real ChatGPT</p>
        <p className="text-xs text-muted-foreground">Technical Assignment</p>
      </div>
    </div>
  );
};
