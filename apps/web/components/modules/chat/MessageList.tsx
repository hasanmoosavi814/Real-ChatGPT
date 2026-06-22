"use client";

import { useGetConversationMessagesQuery } from "@/services/messages.api";
import { MessageBubble } from "@/components/modules/chat/message-bubble";
import { LoadingState } from "@/components/elements/loading-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/elements/empty-state";

export const MessageList = ({ conversationId }: { conversationId: string }) => {
  const { data, isLoading } = useGetConversationMessagesQuery(conversationId);
  if (isLoading) return <LoadingState label="Loading messages..." />;
  if (!data?.length)
    return (
      <div className="p-6">
        <EmptyState
          title="No messages yet"
          description="Start the conversation by sending your first message."
        />
      </div>
    );

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-8">
        {data.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
};
