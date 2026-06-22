"use client";

import { useLogoutMutation, useMeQuery } from "@/services/auth.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useChatSession = () => {
  const router = useRouter();
  const meQuery = useMeQuery();
  const [logout, logoutState] = useLogoutMutation();

  async function handleLogout() {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return {
    handleLogout,
    user: meQuery.data,
    authError: meQuery.error,
    isAuthLoading: meQuery.isLoading,
    isLoggingOut: logoutState.isLoading,
    isAuthenticated: Boolean(meQuery.data),
  };
};
