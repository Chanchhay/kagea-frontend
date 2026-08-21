"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
      <label htmlFor={inputId} className="text-sm font-semibold text-heading">
        {label}
        {props.required ? <span className="text-error"> *</span> : null}
      </label>
      <div className="relative mt-1.5">
        <Input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-10 rounded-[18px] border-border bg-background/90 pl-11 pr-12 text-[14px] text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-brand focus-visible:ring-brand/10 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-white/30",
            className,
          )}
          {...props}
        />
        <Lock
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 size-8 -translate-y-1/2 rounded-full text-muted-foreground hover:bg-transparent hover:text-foreground dark:text-white/45 dark:hover:text-white"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </Button>
      </div>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
}
