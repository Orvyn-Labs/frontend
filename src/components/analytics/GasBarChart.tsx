"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { GAS_SNAPSHOT, LAYER_COLORS } from "@/hooks/useAnalytics";
import { formatGas } from "@/lib/utils";

interface TooltipPayload {
  value: number;
  payload: { layer: string; fn: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-lg">
      <p className="font-mono text-xs text-muted-foreground mb-1">{d.payload.fn}</p>
      <p className="font-semibold">{formatGas(d.value)} gas</p>
      <p className="text-xs" style={{ color: LAYER_COLORS[d.payload.layer] }}>
        {d.payload.layer}
      </p>
    </div>
  );
}

export function GasBarChart() {
  const data = GAS_SNAPSHOT.map((d) => ({
    name: d.fn.split(".")[1]?.replace("()", "") ?? d.fn,
    gasUsed: d.gasUsed,
    layer: d.layer,
    fn: d.fn,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 40, left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "#6b7280" }}
          angle={-30}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="gasUsed" radius={[3, 3, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={LAYER_COLORS[entry.layer]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
