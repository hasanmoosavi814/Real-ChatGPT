"use client";

import { useSendMessageMutation } from "@services/messages.api";
import { SendMessageFormValues } from "@schemas/chat.schema";
import { getApiErrorMessage } from "@utils/api-error";
import { sendMessageSchema } from "@schemas/chat.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useSendMessageForm = (conversationId: string) => {
  const [sendMessage, sendState] = useSendMessageMutation();

  const form = useForm<SendMessageFormValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: SendMessageFormValues) {
    try {
      await sendMessage({
        conversationId,
        content: values.content,
      }).unwrap();

      form.reset({ content: "" });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return {
    form,
    onSubmit,
    isLoading: sendState.isLoading,
  };
};
