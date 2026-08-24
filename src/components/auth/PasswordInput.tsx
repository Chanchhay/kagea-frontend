"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  authFieldClass,
  authFieldIconClass,
  authLabelClass,
} from "./authFieldStyles";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  label: string;
  error?: string;
};

export function PasswordInput({
  label,
  id,
  error,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label htmlFor={inputId} className={authLabelClass}>
        {label}
        {props.required ? <span className="text-error"> *</span> : null}
      </label>
      <div className="relative mt-1.5">
        <Input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          className={cn(authFieldClass, "pl-11 pr-12", className)}
          {...props}
        />
        <Lock
          aria-hidden="true"
          className={authFieldIconClass}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 size-8 -translate-y-1/2 rounded-full text-muted-fg hover:bg-transparent hover:text-heading dark:text-white/45 dark:hover:text-white"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </Button>
      </div>
      {error ? <p className="mt-1.5 text-xs text-error">{error}</p> : null}
    </div>
  );
}
