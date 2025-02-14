"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { deleteContactEntryAction } from "../server/contact-entries.actions";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export type ContactEntry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};
export type ContactEntryAllowedKeys = keyof ContactEntry;

export const columns: ColumnDef<ContactEntry>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    id: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => {
      const { message, name } = row.original;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              View Message
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>{name}&apos; message</DialogTitle>
            {message}
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {row.original.createdAt.toDateString()}
          </TooltipTrigger>
          <TooltipContent>
            {row.original.createdAt.toLocaleString()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {row.original.updatedAt.toDateString()}
          </TooltipTrigger>
          <TooltipContent>
            {row.original.updatedAt.toLocaleString()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "actions",
    cell: function CellComponent({ row }) {
      const contactEntry = row.original;

      const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
      const [actionsDropdownOpened, setActionsDropdownOpened] = useState(false);
      const router = useRouter();

      async function handleDeleteContactEntry() {
        const response = await deleteContactEntryAction(contactEntry.id);

        if (response.status === "SUCCESS") {
          toast.success(response.message);

          router.refresh();
        } else {
          toast.error(response.message);
        }

        setDeleteDialogOpened(false);
        setActionsDropdownOpened(false);
      }

      return (
        <DropdownMenu
          open={actionsDropdownOpened}
          onOpenChange={setActionsDropdownOpened}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <AlertDialog
              open={deleteDialogOpened}
              onOpenChange={setDeleteDialogOpened}
            >
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure you want to delete{" "}
                    <strong>
                      {row.original.name} #{row.original.id}
                    </strong>{" "}
                    contact entry?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete{" "}
                    <strong>
                      {row.original.name} #{row.original.id}
                    </strong>{" "}
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteContactEntry}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
