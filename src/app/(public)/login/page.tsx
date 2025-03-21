import { LoginForm } from "@/features/auth/components/login-form";
import { redirectIfAuthorized } from "@/features/auth/server/auth.query";

export default async function LoginPage() {
  await redirectIfAuthorized();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          NBU Bags
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
