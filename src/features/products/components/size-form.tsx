"use client";

import { useEffect } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";

import Link from "next/link";
import { useRouter } from "next/navigation";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import {
  NewSizeSchema,
  newSizeSchema,
} from "@/features/products/products.schema";
import { saveSizeAction } from "@/features/products/server/products.actions";
import { useFormDirtyState } from "@/hooks/use-form-dirty-state";
import { slugify } from "@/libs/slugify";

function ActionButtons(props: { isEditing?: boolean }) {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <>
      <Button variant="outline" size="sm" type="button" asChild>
        <Link href="/admin/products/sizes">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>{props.isEditing ? "Update" : "Add"} Size</span>
      </Button>
    </>
  );
}

export function SizeForm(props: {
  id?: number;
  defaultValues?: NewSizeSchema;
}) {
  const form = useForm<NewSizeSchema>({
    resolver: zodResolver(newSizeSchema),
    defaultValues: props.defaultValues || {
      name: "",
      slug: "",
    },
    mode: "onBlur",
  });

  useFormDirtyState(
    form.formState.isDirty && !form.formState.isSubmitSuccessful,
  );

  const router = useRouter();

  const nameValue = useWatch({ control: form.control, name: "name" });

  useEffect(() => {
    const slug = slugify(nameValue || "");

    form.setValue("slug", slug);
  }, [nameValue, form]);

  async function handleSaveSize(values: NewSizeSchema) {
    const response = await saveSizeAction(values, props.id);

    if (response.status === "SUCCESS") {
      toast.success(response.message);
      if (!props.id) router.push(`/admin/products/sizes`);
    } else {
      toast.error(response.message);
    }
  }

  const pageTitle = props.id
    ? `Edit ${props.defaultValues?.name} Size`
    : "Add New Size";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSaveSize)}>
        <AdminPageWrapper
          breadcrumbs={[
            { label: "Products", href: "/admin/products" },
            { label: "Sizes", href: "/admin/products/sizes" },
          ]}
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
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="S" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a suitable size name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="fashion" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be used in URL of the size.
                      </FormDescription>
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
