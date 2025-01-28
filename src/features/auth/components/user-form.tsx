"use client";

import { useForm, useFormContext } from "react-hook-form";

import Link from "next/link";
import { redirect } from "next/navigation";

import {
  NewUserClientSchema,
  UpdateUserSchema,
  newUserClientSchema,
} from "../auth.schema";
import { addUserAction, updateUserAction } from "../server/auth.actions";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { roles } from "@/configs/constants";
import { useFormDirtyState } from "@/hooks/use-form-dirty-state";

function ActionButtons(props: { isEditing?: boolean }) {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <>
      <Button variant="outline" size="sm" type="button" asChild>
        <Link href="/admin/users">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>{props.isEditing ? "Update" : "Add"} User</span>
      </Button>
    </>
  );
}

export function UserForm(props: {
  id?: number;
  defaultValues?: NewUserClientSchema;
}) {
  const form = useForm<NewUserClientSchema>({
    resolver: zodResolver(newUserClientSchema),
    defaultValues: props.defaultValues || {
      name: "",
      password: "",
      confirmPassword: "",
      role: "user",
      email: "",
    },
    mode: "onBlur",
  });

  useFormDirtyState(
    form.formState.isDirty && !form.formState.isSubmitSuccessful,
  );

  const pageTitle = props.id
    ? `Edit ${props.defaultValues?.name} User`
    : "Add New User";

  async function handleSaveUser(data: NewUserClientSchema) {
    const dataToSend = {
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password,
    };

    if (props.id) {
      if (!dataToSend.password)
        (dataToSend as UpdateUserSchema).password = undefined;

      const response = await updateUserAction(dataToSend, props.id);

      if (response.status === "SUCCESS") {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } else {
      const response = await addUserAction(dataToSend);

      if (response.status === "SUCCESS") {
        toast.success(response.message);
        redirect("/admin/users");
      } else {
        toast.error(response.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSaveUser)}>
        <AdminPageWrapper
          breadcrumbs={[{ label: "Users", href: "/admin/users" }]}
          pageTitle={pageTitle}
          rightSideContent={<ActionButtons isEditing={!!props.id} />}
        >
          <Card>
            <CardHeader>
              <CardTitle>{pageTitle}</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a suitable name of the person.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@website.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a suitable email of the person.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger aria-label="Select status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((status) => (
                              <SelectItem
                                key={status}
                                value={status}
                                className="capitalize"
                              >
                                {`${status.charAt(0).toUpperCase()}${status.slice(1)}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Admin can do anything in admin panel.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="john@website.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {props.id
                          ? "(Optional) Enter a new password if you want to change."
                          : "Enter a suitable password with at least 8 characters, one number, one uppercase letter, and one symbol."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="john@website.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="grid gap-2 xs:grid-cols-2 md:hidden">
              <ActionButtons isEditing={!!props.id} />
            </CardFooter>
          </Card>
        </AdminPageWrapper>
      </form>
    </Form>
  );
}
