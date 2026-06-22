"use client";

import { TChatHeaderProps } from "@/types";
import { LogOut } from "lucide-react";
import { Button } from "@ui/button";

export const ChatHeader = ({
  userName,
  onLogout,
  isLoggingOut,
}: TChatHeaderProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-5">
      <div>
        <p className="text-sm font-medium">Chat Workspace</p>
        <p className="text-xs text-muted-foreground">{userName}</p>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={onLogout}
        disabled={isLoggingOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </header>
  );
};
