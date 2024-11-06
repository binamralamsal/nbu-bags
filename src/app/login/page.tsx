import { LoginForm } from "@/features/auth/components/login-form";
import { redirectIfAuthorized } from "@/server/features/auth/auth.query";

export default async function LoginPage() {
  await redirectIfAuthorized();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-5 bg-gray-100">
      <LoginForm />
    </div>
  );
}
