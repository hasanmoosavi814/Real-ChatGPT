import { Message } from "@/types/message";
import { cn } from "@lib/utils";

export const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "USER";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "border bg-muted/60 text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
