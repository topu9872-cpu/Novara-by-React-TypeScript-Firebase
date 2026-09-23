import type { ReactNode } from "react";
import { Tooltip as RechartsTooltip } from "recharts";

type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

type ChartContainerProps = {
  config: ChartConfig;
  children: ReactNode;
  className?: string;
};

export function ChartContainer({
  children,
  className = "",
}: ChartContainerProps) {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
}

export function ChartTooltip(props: Record<string, any>) {
  return <RechartsTooltip {...props} />;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <div className="font-medium text-foreground mb-1.5">{label}</div>
      <div className="grid gap-1.5">
        {payload.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground capitalize">
                {item.name}
              </span>
            </div>
            <span className="font-bold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}