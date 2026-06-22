"use client";

import { registerSchema, RegisterFormValues } from "@/schemas/auth.schema";
import { useRegisterMutation } from "@/services/auth.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useRegisterForm = () => {
  const router = useRouter();
  const [register, registerState] = useRegisterMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await register(values).unwrap();
      toast.success("Account created successfully.");
      router.push("/chat");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return {
    form,
    onSubmit,
    isLoading: registerState.isLoading,
  };
};
