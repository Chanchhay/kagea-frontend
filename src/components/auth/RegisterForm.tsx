"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Sparkles, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validation/register.schema";
import { useRegisterMutation } from "@/services/authApi";
import {
  authFieldClass,
  authFieldIconClass,
  authLabelClass,
} from "./authFieldStyles";
import { KeycloakLoginButton } from "./AuthActions";
import { PasswordInput } from "./PasswordInput";
import { RoleSelector } from "./RoleSelector";

const defaultValues: RegisterFormValues = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  firstName: "",
  lastName: "",
  gender: "UNSPECIFIED",
  role: "SEEKER",
  phoneNumber: "",
};

type TextFieldName =
  | "firstName"
  | "lastName"
  | "username"
  | "email"
  | "phoneNumber";

const genderOptions = [
  { value: "UNSPECIFIED", label: "Prefer not to say" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
] as const;

export function RegisterForm() {
  const [register, registration] = useRegisterMutation();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await register({
        ...values,
        phoneNumber: values.phoneNumber || undefined,
      }).unwrap();
      toast.success("Account created. Continue with secure sign in.");
      window.location.assign("/oauth2/authorization/keycloak");
    } catch {
      toast.error("Unable to create the account.");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <RoleSelector value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField control={form.control} name="firstName" label="First name" placeholder="Sokha" />
          <TextField control={form.control} name="lastName" label="Last name" placeholder="Chan" />
        </div>

        <TextField control={form.control} name="username" label="Username" placeholder="sokha.chan" />
        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <PasswordInput
                  label="Password"
                  autoComplete="new-password"
                  required
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <PasswordInput
                  label="Confirm password"
                  autoComplete="new-password"
                  required
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={authLabelClass}>Gender</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className={cn(authFieldClass, "mt-1.5 px-4")}>
                      <span className="flex items-center gap-3">
                        <User
                          aria-hidden="true"
                          className="size-4 text-muted-fg dark:text-white/45"
                        />
                        <SelectValue />
                      </span>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genderOptions.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <TextField
            control={form.control}
            name="phoneNumber"
            label="Phone number"
            placeholder="012 345 678"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-1 h-11 w-full rounded-full bg-brand text-[15px] font-semibold text-white shadow-[0_12px_30px_rgba(36,169,68,.28)] transition-colors hover:bg-brand-hover dark:shadow-[0_12px_30px_rgba(36,169,68,.18)]"
          disabled={registration.isLoading}
        >
          <Sparkles aria-hidden="true" className="size-4" />
          {registration.isLoading ? "Creating account..." : "Create account"}
        </Button>

        <p className="flex flex-wrap items-center justify-center gap-2 text-center text-sm text-body">
          Already have an account?
          <KeycloakLoginButton
            variant="link"
            size="sm"
            className="h-auto gap-1 p-0 text-sm font-semibold text-brand no-underline hover:text-brand-hover hover:no-underline"
          >
            Sign in
          </KeycloakLoginButton>
        </p>
      </form>
    </Form>
  );
}

function TextField({
  control,
  name,
  label,
  type = "text",
  placeholder,
}: {
  control: ReturnType<typeof useForm<RegisterFormValues>>["control"];
  name: TextFieldName;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={authLabelClass}>{label}</FormLabel>
          <FormControl>
            <div className="relative mt-1.5">
              <Input
                type={type}
                placeholder={placeholder}
                className={cn(authFieldClass, "pl-11")}
                {...field}
              />
              <FieldIcon name={name} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FieldIcon({ name }: { name: TextFieldName }) {
  const Icon =
    name === "email"
      ? Mail
      : name === "phoneNumber"
        ? Phone
        : User;

  return (
    <Icon
      aria-hidden="true"
      className={authFieldIconClass}
    />
  );
}
