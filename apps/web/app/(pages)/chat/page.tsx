import { MessageSquarePlus } from "lucide-react";
import { EmptyState } from "@/components/elements/empty-state";
import { ChatShell } from "@/components/modules/chat/chat-shell";

const ChatPage = () => {
  return (
    <ChatShell>
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          title="Select or create a conversation"
          description="Choose a chat from the sidebar or create a new one to start messaging."
          action={
            <div className="flex items-center justify-center text-muted-foreground">
              <MessageSquarePlus className="h-10 w-10" />
            </div>
          }
        />
      </div>
    </ChatShell>
  );
};

export default ChatPage;
