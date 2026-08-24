import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Choose how you will use the platform, then tell us the essentials to get started."
      className="lg:grid-cols-[minmax(0,.45fr)_minmax(0,.55fr)]"
    >
      <RegisterForm />
    </AuthShell>
  );
}
