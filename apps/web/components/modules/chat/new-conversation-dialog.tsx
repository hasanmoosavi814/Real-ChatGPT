"use client";

import { useCreateConversationForm } from "@hooks/chat/use-create-conversation-form";
import { FieldGroup, FieldLabel } from "@ui/field";
import { Field, FieldError } from "@ui/field";
import { Controller } from "react-hook-form";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Plus } from "lucide-react";

import * as D from "@/components/ui/dialog";

export const NewConversationDialog = () => {
  const { form, onSubmit, isLoading } = useCreateConversationForm();

  return (
    <D.Dialog>
      <D.DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </D.DialogTrigger>

      <D.DialogContent>
        <D.DialogHeader>
          <D.DialogTitle>Create conversation</D.DialogTitle>
        </D.DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Conversation title
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Conversation title"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button disabled={isLoading} type="submit">
            Create
          </Button>
        </form>
      </D.DialogContent>
    </D.Dialog>
  );
};
