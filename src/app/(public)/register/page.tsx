import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Choose how you will use the platform, then tell us the essentials to get started."
    >
      <RegisterForm />
    </AuthShell>
  );
}
