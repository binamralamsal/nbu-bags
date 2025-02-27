"use client";

import { useEffect, useId } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { NewProductSchema, newProductSchema } from "../products.schema";
import { saveProductAction } from "../server/products.actions";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import {
  FileIcon,
  FileList,
  FileName,
  FileUpload,
  FileUploader,
  UploadedFile,
  useFileUploader,
} from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import MultipleSelector from "@/components/ui/multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, TrashIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { productStatus } from "@/configs/constants";
import { useFormDirtyState } from "@/hooks/use-form-dirty-state";
import { slugify } from "@/libs/slugify";

function ActionButtons(props: { isEditing?: boolean }) {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <>
      <Button variant="outline" size="sm" type="button" asChild>
        <Link href="/admin/products">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>{props.isEditing ? "Update" : "Add"} Product</span>
      </Button>
    </>
  );
}

type Color = { id: number; name: string; color: string };

export function ProductForm(props: {
  id?: number;
  categories: { id: number; name: string }[];
  sizes: { id: number; name: string }[];
  colors: Color[];
  defaultValues?: NewProductSchema;
  images?: UploadedFile[];
}) {
  const form = useForm<NewProductSchema>({
    resolver: zodResolver(newProductSchema),
    defaultValues: props.defaultValues || {
      name: "",
      slug: "",
      categoryId: null,
      description: "",
      images: [],
      sizes: [],
      status: "draft",
      price: undefined,
      salePrice: null,
    },
    mode: "all",
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

  async function handleSaveProduct(values: NewProductSchema) {
    const response = await saveProductAction(values, props.id);

    if (response.status === "SUCCESS") {
      toast.success(response.message);
      if (!props.id) router.push(`/admin/products`);
    } else {
      toast.error(response.message);
    }
  }

  const pageTitle = props.id
    ? `Edit ${props.defaultValues?.name} Product`
    : "Add New Product";

  const sizes = props.sizes.map((size) => ({
    value: size.id.toString(),
    label: size.name,
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSaveProduct)}>
        <AdminPageWrapper
          breadcrumbs={[{ label: "Products", href: "/admin/products" }]}
          pageTitle={pageTitle}
          rightSideContent={<ActionButtons isEditing={!!props.id} />}
        >
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Name <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Fashionable Bag" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter a suitable name for the product.
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
                            <FormLabel>
                              Slug <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="fashionable-flag"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This will be used in URL of the product.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 lg:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Price{" "}
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="1000"
                                  type="text"
                                  value={
                                    field.value === undefined
                                      ? ""
                                      : `${field.value}`
                                  }
                                  onChange={(event) => {
                                    if (event.target.value.endsWith("."))
                                      return field.onChange(event.target.value);

                                    const value = Number(event.target.value);

                                    if (value === 0 || isNaN(value)) {
                                      field.onChange(undefined);
                                    } else {
                                      field.onChange(value);
                                    }
                                  }}
                                  inputMode="numeric"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="salePrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sale Price</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="900"
                                  type="text"
                                  value={
                                    field.value === null ? "" : `${field.value}`
                                  }
                                  onChange={(event) => {
                                    if (event.target.value.endsWith("."))
                                      return field.onChange(event.target.value);

                                    const value = Number(event.target.value);

                                    if (value === 0 || isNaN(value)) {
                                      field.onChange(null);
                                    } else {
                                      field.onChange(value);
                                    }
                                  }}
                                  inputMode="numeric"
                                />
                              </FormControl>
                              <FormDescription>
                                (Optional) Discounted price for the product.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Description{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="This bag is equipped of ..."
                                {...field}
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUploader
                              maxFilesCount={20}
                              maxFileSize="1gb"
                              accept={["image/*"]}
                              onChange={(files) =>
                                field.onChange(
                                  files.map((file) => {
                                    const existingFile = field.value.find(
                                      (f) => f.fileId === file.id,
                                    );
                                    return {
                                      fileId: file.id,
                                      colorId: existingFile?.colorId || null,
                                    };
                                  }),
                                )
                              }
                              initialFiles={props.images}
                            >
                              <FileUpload />
                              <UploadingFilesList />
                              <UploadedFilesList colors={props.colors} />
                            </FileUploader>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger aria-label="Select status">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {productStatus.map((status) => (
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Product Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(
                                  value === "null" ? null : parseInt(value),
                                )
                              }
                              defaultValue={String(field.value)}
                            >
                              <SelectTrigger aria-label="Select category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {props.categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={String(category.id)}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Product Sizes</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <FormField
                      control={form.control}
                      name="sizes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <MultipleSelector
                              commandProps={{
                                label: "Select sizes",
                              }}
                              defaultOptions={sizes}
                              placeholder="Select sizes"
                              value={field.value.map((size) => ({
                                value: size.toString(),
                                label:
                                  sizes.find((s) => s.value === size.toString())
                                    ?.label || "Unknown",
                              }))}
                              onChange={(options) =>
                                field.onChange(
                                  options.map((option) =>
                                    parseInt(option.value),
                                  ),
                                )
                              }
                              maxSelected={20}
                              emptyIndicator={
                                <p className="text-center text-sm">
                                  No results found
                                </p>
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="grid gap-2 xs:grid-cols-2 md:hidden">
              <ActionButtons isEditing={!!props.id} />
            </div>
          </div>
        </AdminPageWrapper>
      </form>
    </Form>
  );
}

function UploadingFilesList() {
  const { uploadingFiles, cancelUpload } = useFileUploader();

  if (uploadingFiles.length === 0) return null;

  return (
    <div className="mt-4">
      <p>Uploading files</p>
      <div className="mt-2 space-y-2">
        {uploadingFiles.map(({ file, preview, progress }) => (
          <FileList key={file.name}>
            <FileIcon fileType={file.type} name={file.name} preview={preview} />

            <FileName name={file.name} progress={progress} />
            <Button
              onClick={() => cancelUpload(file)}
              size="icon"
              variant="destructive"
              type="button"
              className="justify-self-end"
            >
              <XIcon />
            </Button>
          </FileList>
        ))}
      </div>
    </div>
  );
}

function UploadedFilesList({ colors }: { colors: Color[] }) {
  const { uploadedFiles, deleteFile } = useFileUploader();

  const form = useFormContext();

  const id = useId();

  function handleSelectChange(value: string, fileId: number) {
    form.setValue(
      "images",
      form
        .getValues("images")
        .map((image: NewProductSchema["images"][number]) =>
          image.fileId === fileId
            ? {
                ...image,
                colorId: value === "null" ? null : Number(value),
              }
            : image,
        ),
    );
  }

  if (uploadedFiles.length === 0) return null;

  return (
    <div className="mt-4">
      <p>Uploaded files</p>
      <div className="mt-2 space-y-2">
        {uploadedFiles.map(({ name, url, fileType, id: fileId }) => (
          <div
            key={name}
            className="grid grid-cols-[4fr,1fr] items-center justify-center gap-4"
          >
            <FileList className="flex-grow">
              <FileIcon fileType={fileType} name={name} preview={url} />

              <FileName name={name} />
              <Button
                onClick={() => deleteFile(url)}
                size="icon"
                variant="destructive"
                type="button"
                className="justify-self-end"
              >
                <TrashIcon />
              </Button>
            </FileList>

            <Select
              defaultValue={
                form
                  .getValues("images")
                  .find(
                    (image: NewProductSchema["images"][number]) =>
                      image.fileId === fileId,
                  )
                  ?.colorId?.toString() || "null"
              }
              onValueChange={(value) => handleSelectChange(value, fileId)}
            >
              <SelectTrigger className="h-auto ps-2" id={id}>
                <SelectValue placeholder="Assign a color" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                <SelectItem value="null">None</SelectItem>
                {colors.map((color) => (
                  <SelectItem value={color.id.toString()} key={color.id}>
                    <span className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: color.color }}
                      ></div>
                      <span className="block font-medium">{color.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
