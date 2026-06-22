"use client";

import { useCreateConversationMutation } from "@services/conversations.api";
import { CreateConversationFormValues } from "@schemas/chat.schema";
import { createConversationSchema } from "@schemas/chat.schema";
import { getApiErrorMessage } from "@utils/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useCreateConversationForm = () => {
  const router = useRouter();
  const [createConversation, createState] = useCreateConversationMutation();

  const form = useForm<CreateConversationFormValues>({
    resolver: zodResolver(createConversationSchema),
    defaultValues: {
      title: "New Chat",
    },
  });

  async function onSubmit(values: CreateConversationFormValues) {
    try {
      const conversation = await createConversation(values).unwrap();
      toast.success("Conversation created.");
      router.push(`/chat/${conversation.id}`);
      form.reset({ title: "New Chat" });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return {
    form,
    onSubmit,
    isLoading: createState.isLoading,
  };
};
