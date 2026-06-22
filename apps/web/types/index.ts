import { ReactNode } from "react";

// ============== Elements =============
export type TEmptyStateProps = {
  title: string;
  action?: ReactNode;
  description?: string;
};

export type TErrorStateProps = {
  title?: string;
  description?: string;
};

export type TAuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

// ============ Module Chat =============
export type TChatHeaderProps = {
  userName: string;
  onLogout: () => void;
  isLoggingOut: boolean;
};

// =========== Pages =============
export type TChatConversationPageProps = {
  params: Promise<{
    conversationId: string;
  }>;
};
