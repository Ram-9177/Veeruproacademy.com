"use client";

import * as React from "react";
import { cn } from "./utils";

type ChartProps = {
  className?: string;
  data?: any[];
};

export function Chart({ className, data = [] }: ChartProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-white p-4 text-center", className)}>
      <div className="text-sm text-muted-foreground">Chart placeholder</div>
      <div className="mt-2 text-xs text-muted-foreground">{data?.length ?? 0} datapoints</div>
    </div>
  );
}

export default Chart;
