"use client";

import { ConversationSidebar } from "@modules/chat/conversation-sidebar";
import { useChatSession } from "@/hooks/chat/use-chat-session";
import { LoadingState } from "@elements/loading-state";
import { ChatHeader } from "@modules/chat/chat-header";
import { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const ChatShell = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user, isAuthLoading, authError, handleLogout, isLoggingOut } =
    useChatSession();

  useEffect(() => {
    if (!isAuthLoading && authError) router.replace("/login");
  }, [authError, isAuthLoading, router]);

  if (isAuthLoading) return <LoadingState label="Checking session..." />;
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ConversationSidebar />
      <section className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
          userName={user.name ?? user.email}
        />
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </section>
    </div>
  );
};
