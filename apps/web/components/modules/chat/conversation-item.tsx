"use client";

import { ConversationListItem } from "@/types/conversation";
import { MessageSquare } from "lucide-react";
import { Badge } from "@ui/badge";
import { cn } from "@lib/utils";

import Link from "next/link";

export const ConversationItem = ({
  conversation,
}: {
  conversation: ConversationListItem;
}) => {
  return (
    <Link
      href={`/chat/${conversation.id}`}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-background",
      )}
    >
      <MessageSquare className="h-4 w-4 text-muted-foreground" />

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {conversation.title || "Untitled Chat"}
        </p>
        <p className="text-xs text-muted-foreground">
          {conversation.messageCount} messages
        </p>
      </div>

      <Badge variant="secondary">{conversation.messageCount}</Badge>
    </Link>
  );
};
