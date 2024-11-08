"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

import { loginUserAction } from "../server/auth.actions";

export function LoginForm() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect_url");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await loginUserAction({
      email: loginEmail,
      password: loginPassword,
    });

    if (response.status === "SUCCESS") {
      toast.success(response.message);
      router.push(redirectUrl || "/");
      router.refresh();
    } else {
      toast.error(response.message);
    }
  }

  function handleChange(setter: React.Dispatch<React.SetStateAction<string>>) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };
  }

  return (
    <form
      className="w-full max-w-md rounded bg-white p-6 shadow-md"
      onSubmit={handleLogin}
    >
      <h2 className="mb-4 text-2xl font-bold">Login</h2>
      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="loginEmail">Email</Label>
        <Input
          id="loginEmail"
          onChange={handleChange(setLoginEmail)}
          placeholder="Email"
          required
          type="email"
          value={loginEmail}
        />
      </div>
      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="loginPassword">Password</Label>
        <Input
          id="loginPassword"
          onChange={handleChange(setLoginPassword)}
          placeholder="Password"
          required
          type="password"
          value={loginPassword}
        />
      </div>

      <Button className="w-full" size="lg" type="submit">
        Login
      </Button>

      {/* <small className="flex items-center gap-2 text-gray-600">
        Forgot Password?
        <Button asChild variant="link" className="p-0">
          <Link href={forgotPasswordUrl}>Click Here</Link>
        </Button>
      </small> */}
    </form>
  );
}
