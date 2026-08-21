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
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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

        <div className="grid gap-3 sm:grid-cols-2">
          <TextField control={form.control} name="firstName" label="First name" />
          <TextField control={form.control} name="lastName" label="Last name" />
        </div>

        <TextField control={form.control} name="username" label="Username" />
        <TextField control={form.control} name="email" label="Email" type="email" />

        <div className="grid gap-3 sm:grid-cols-2">
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-heading">
                  Gender
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="mt-1.5 h-10 w-full rounded-[18px] border-border bg-background/90 px-4 text-[14px] text-foreground shadow-none focus-visible:border-brand focus-visible:ring-brand/10 dark:border-white/10 dark:bg-black dark:text-white">
                      <span className="flex items-center gap-3">
                        <User
                          aria-hidden="true"
                          className="size-4 text-muted-foreground"
                        />
                        <SelectValue />
                      </span>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(["UNSPECIFIED", "MALE", "FEMALE", "OTHER"] as const).map(
                      (gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ),
                    )}
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
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-10 w-full rounded-full bg-brand text-base font-semibold text-white shadow-[0_12px_30px_rgba(36,169,68,.28)] hover:bg-brand-hover"
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
}: {
  control: ReturnType<typeof useForm<RegisterFormValues>>["control"];
  name: "firstName" | "lastName" | "username" | "email" | "phoneNumber";
  label: string;
  type?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-semibold text-heading">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative mt-1.5">
              <Input
                type={type}
                className="h-10 rounded-[18px] border-border bg-background/90 pl-11 text-[14px] text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-brand focus-visible:ring-brand/10 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-white/30"
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

function FieldIcon({
  name,
}: {
  name: "firstName" | "lastName" | "username" | "email" | "phoneNumber";
}) {
  const Icon =
    name === "email"
      ? Mail
      : name === "phoneNumber"
        ? Phone
        : User;

  return (
    <Icon
      aria-hidden="true"
      className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
    />
  );
}
