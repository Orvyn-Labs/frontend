"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GAS_SNAPSHOT, LAYER_COLORS } from "@/hooks/useAnalytics";
import { formatGas } from "@/lib/utils";

const LAYER_LABELS: Record<string, string> = {
  L1: "L1 — Direct",
  L2: "L2 — Staking",
  L3: "L3 — Yield",
  L4: "L4 — Deploy",
};

export function TxComplexityTable() {
  const sorted = [...GAS_SNAPSHOT].sort((a, b) => a.gasUsed - b.gasUsed);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Function</TableHead>
            <TableHead>Complexity Layer</TableHead>
            <TableHead className="text-right">L2 Gas Used</TableHead>
            <TableHead className="text-right">Relative Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => {
            const maxGas = Math.max(...GAS_SNAPSHOT.map((r) => r.gasUsed));
            const pct = ((row.gasUsed / maxGas) * 100).toFixed(0);
            return (
              <TableRow key={row.fn}>
                <TableCell className="font-mono text-xs">{row.fn}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    style={{
                      color: LAYER_COLORS[row.layer],
                      borderColor: LAYER_COLORS[row.layer] + "50",
                      backgroundColor: LAYER_COLORS[row.layer] + "15",
                    }}
                  >
                    {LAYER_LABELS[row.layer]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatGas(row.gasUsed)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: LAYER_COLORS[row.layer],
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
