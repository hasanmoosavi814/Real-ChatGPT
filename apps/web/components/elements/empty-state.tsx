import { TEmptyStateProps } from "@/types";

export const EmptyState = ({
  title,
  action,
  description,
}: TEmptyStateProps) => {
  return (
    <div className="flex min-h-65 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
};
