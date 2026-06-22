import { TChatConversationPageProps } from "@/types";
import { MessageComposer } from "@modules/chat/message-composer";
import { MessageList } from "@modules/chat/message-list";
import { ChatShell } from "@modules/chat/chat-shell";

const ChatConversationPage = async ({ params }: TChatConversationPageProps) => {
  const { conversationId } = await params;
  return (
    <ChatShell>
      <div className="flex h-full flex-col">
        <div className="min-h-0 flex-1">
          <MessageList conversationId={conversationId} />
        </div>
        <MessageComposer conversationId={conversationId} />
      </div>
    </ChatShell>
  );
};

export default ChatConversationPage;
