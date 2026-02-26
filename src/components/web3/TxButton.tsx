"use client";

import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import type React from "react";

type TxState = "idle" | "pending" | "confirming" | "success" | "error";

type ButtonProps = React.ComponentProps<typeof Button>;

interface TxButtonProps extends Omit<ButtonProps, "children"> {
  txState?: TxState;
  idleLabel: string;
  pendingLabel?: string;
  confirmingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
}

export function TxButton({
  txState = "idle",
  idleLabel,
  pendingLabel = "Confirm in wallet...",
  confirmingLabel = "Waiting for block...",
  successLabel = "Done!",
  errorLabel = "Transaction failed",
  disabled,
  ...props
}: TxButtonProps) {
  const isLoading = txState === "pending" || txState === "confirming";
  const isSuccess = txState === "success";
  const isError = txState === "error";

  const label = {
    idle: idleLabel,
    pending: pendingLabel,
    confirming: confirmingLabel,
    success: successLabel,
    error: errorLabel,
  }[txState];

  return (
    <Button
      disabled={disabled || isLoading || isSuccess}
      variant={isError ? "destructive" : isSuccess ? "outline" : "default"}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isSuccess && <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />}
      {isError && <XCircle className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
}
