"use client";

import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Field, FieldError } from "@/components/ui/field";
import { useLoginForm } from "@/hooks/auth/use-login-form";
import { Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Link from "next/link";

export const LoginForm = () => {
  const { form, onSubmit, isLoading } = useLoginForm();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button className="w-full" disabled={isLoading} type="submit">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Login
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link className="font-medium text-primary" href="/register">
          Create one
        </Link>
      </p>
    </form>
  );
};
