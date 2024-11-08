"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

import { registerUserAction } from "../server/auth.actions";

export function RegisterForm() {
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const router = useRouter();

  function handleChange(setter: React.Dispatch<React.SetStateAction<string>>) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await registerUserAction({
      email: registerEmail,
      name: registerName,
      password: registerPassword,
    });

    if (response.status === "SUCCESS") {
      toast.success(response.message);
      router.push("/");
      router.refresh();
    } else {
      toast.error(response.message);
    }
  }

  return (
    <form
      className="w-full max-w-md rounded bg-white p-6 shadow-md"
      onSubmit={handleRegister}
    >
      <h2 className="mb-4 text-2xl font-bold">Register</h2>
      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="registerName">Name</Label>
        <Input
          id="registerName"
          onChange={handleChange(setRegisterName)}
          placeholder="Name"
          required
          type="text"
          value={registerName}
        />
      </div>
      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="registerEmail">Email</Label>
        <Input
          id="registerEmail"
          onChange={handleChange(setRegisterEmail)}
          placeholder="Email"
          required
          type="email"
          value={registerEmail}
        />
      </div>
      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="registerPassword">Password</Label>
        <Input
          id="registerPassword"
          onChange={handleChange(setRegisterPassword)}
          placeholder="Password"
          required
          type="password"
          value={registerPassword}
        />
      </div>
      <Button className="w-full" size="lg" type="submit">
        Register
      </Button>

      {/* <small className="text-gray-600 flex gap-2 items-center">
        Forgot Password?
        <Button asChild variant="link" className="p-0">
          <Link href={forgotPasswordUrl}>Click Here</Link>
        </Button>
      </small> */}
    </form>
  );
}
