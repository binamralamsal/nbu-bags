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
  NewCategorySchema,
  newCategorySchema,
} from "@/features/products/products.schema";
import { saveCategoryAction } from "@/features/products/server/products.actions";
import { useFormDirtyState } from "@/hooks/use-form-dirty-state";
import { slugify } from "@/libs/slugify";

function ActionButtons(props: { isEditing?: boolean }) {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <>
      <Button variant="outline" size="sm" type="button" asChild>
        <Link href="/admin/products/categories">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>{props.isEditing ? "Update" : "Add"} Category</span>
      </Button>
    </>
  );
}

export function CategoryForm(props: {
  id?: number;
  defaultValues?: NewCategorySchema;
}) {
  const form = useForm<NewCategorySchema>({
    resolver: zodResolver(newCategorySchema),
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

  async function handleSaveCategory(values: NewCategorySchema) {
    const response = await saveCategoryAction(values, props.id);

    if (response.status === "SUCCESS") {
      toast.success(response.message);
      if (!props.id) router.push(`/admin/products/categories`);
    } else {
      toast.error(response.message);
    }
  }

  const pageTitle = props.id
    ? `Edit ${props.defaultValues?.name} Category`
    : "Add New Category";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSaveCategory)}>
        <AdminPageWrapper
          breadcrumbs={[
            { label: "Products", href: "/admin/products" },
            { label: "Categories", href: "/admin/products/categories" },
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
                        <Input placeholder="Fashion" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a suitable category name.
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
                        This will be used in URL of the category.
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
