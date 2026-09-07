"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
}: FieldProps<T> & { type?: string }) {
  const tx = useWorkspaceTranslation();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{tx(label)}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={tx(placeholder)}
              className="h-11 rounded-xl"
              {...field}
            />
          </FormControl>
          {description ? <FormDescription>{tx(description)}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TextAreaField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  rows = 5,
}: FieldProps<T> & { rows?: number }) {
  const tx = useWorkspaceTranslation();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{tx(label)}</FormLabel>
          <FormControl>
            <Textarea
              rows={rows}
              placeholder={tx(placeholder)}
              className="rounded-xl"
              {...field}
            />
          </FormControl>
          {description ? <FormDescription>{tx(description)}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Value stays a string so it round-trips through the select cleanly. */
export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select",
  description,
  options,
}: FieldProps<T> & { options: { value: string; label: string }[] }) {
  const tx = useWorkspaceTranslation();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{tx(label)}</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className="h-11 w-full rounded-xl">
                <SelectValue placeholder={tx(placeholder)}>
                  {tx(options.find((option) => option.value === field.value)?.label)}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent
              alignItemWithTrigger={false}
              side="bottom"
              align="start"
              className="max-h-64"
            >
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {tx(option.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description ? <FormDescription>{tx(description)}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
