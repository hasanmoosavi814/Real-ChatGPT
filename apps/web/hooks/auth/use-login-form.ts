"use client";

import { loginSchema, LoginFormValues } from "@/schemas/auth.schema";
import { getApiErrorMessage } from "@/utils/api-error";
import { useLoginMutation } from "@/services/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useLoginForm = () => {
  const router = useRouter();
  const [login, loginState] = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values).unwrap();
      toast.success("Logged in successfully.");
      router.push("/chat");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return {
    form,
    onSubmit,
    isLoading: loginState.isLoading,
  };
};
