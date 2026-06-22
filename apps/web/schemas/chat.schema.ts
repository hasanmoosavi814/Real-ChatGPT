import { z } from "zod";

export const createConversationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Conversation title is required.")
    .max(80, "Title is too long."),
});

export const sendMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty.")
    .max(4000, "Message is too long."),
});

export type CreateConversationFormValues = z.infer<
  typeof createConversationSchema
>;

export type SendMessageFormValues = z.infer<typeof sendMessageSchema>;
