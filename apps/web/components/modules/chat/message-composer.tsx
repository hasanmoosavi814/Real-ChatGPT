"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useSendMessageForm } from "@/hooks/chat/use-send-message-form";
import { SendHorizontal } from "lucide-react";
import { Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const MessageComposer = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const { form, onSubmit, isLoading } = useSendMessageForm(conversationId);

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto max-w-3xl">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-end gap-3"
        >
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="flex-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="sr-only">
                  Message
                </FieldLabel>

                <Textarea
                  {...field}
                  id={field.name}
                  disabled={isLoading}
                  className="min-h-12 resize-none"
                  placeholder="Type your message..."
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" disabled={isLoading} aria-label="Send message">
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
