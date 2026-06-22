"use client";

import { useGetConversationsQuery } from "@/services/conversations.api";
import { NewConversationDialog } from "@/components/modules/chat/new-conversation-dialog";
import { ConversationItem } from "@/components/modules/chat/conversation-item";
import { LoadingState } from "@/components/elements/loading-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AppLogo } from "@/components/elements/app-logo";

export const ConversationSidebar = () => {
  const { data, isLoading } = useGetConversationsQuery();

  return (
    <aside className="hidden h-screen w-80 shrink-0 border-r bg-muted/30 md:flex md:flex-col">
      <div className="space-y-4 p-4">
        <AppLogo />
        <NewConversationDialog />
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        {isLoading ? (
          <LoadingState label="Loading conversations..." />
        ) : (
          <div className="space-y-1">
            {(data ?? []).map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
};
