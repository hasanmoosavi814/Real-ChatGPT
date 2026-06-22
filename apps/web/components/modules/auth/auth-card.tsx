import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TAuthCardProps } from "@/types";
import { AppLogo } from "@/components/elements/app-logo";

export const AuthCard = ({ title, description, children }: TAuthCardProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-5">
          <AppLogo />
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
};
