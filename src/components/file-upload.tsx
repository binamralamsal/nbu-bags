"use client";

import { ChangeEvent, DragEvent, ReactNode, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import axios from "axios";
import {
  AudioWaveform,
  DownloadIcon,
  EyeIcon,
  File,
  FileImageIcon,
  FileVideoIcon,
  FolderArchive,
  LucideProps,
  TrashIcon,
  UploadCloud,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/utils/cn";

type UploadingFile = {
  file: File;
  progress: number;
  preview?: string;
  cancelToken?: AbortController;
};

type UploadedFile = {
  name: string;
  url: string;
  fileType: string;
};

type FileUploadProps = {
  multiple?: boolean;
  maxFilesCount?: number;
  initialFiles?: UploadedFile[];
  maxFileSize?: FileSize;
};

type FileSize = `${number}${"mb" | "gb"}`;

export function FileUpload(props: FileUploadProps) {
  const {
    multiple = true,
    initialFiles = [],
    maxFilesCount,
    maxFileSize,
  } = props;

  if (!multiple && maxFilesCount !== undefined) {
    throw new Error("maxFilesCount cannot be set when multiple is false");
  }

  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [uploadedFiles, setUploadedFiles] =
    useState<UploadedFile[]>(initialFiles);

  const hasFiles = files.length > 0 || uploadedFiles.length > 0;

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDropOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (!event.dataTransfer) return;

    const droppedFiles = Array.from(event.dataTransfer.files);
    addFiles(droppedFiles);
  }

  function handleFilesSelect(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);
    addFiles(selectedFiles);
  }

  function addFiles(newFiles: File[]) {
    const fileObjects: UploadingFile[] = newFiles.map((file) => ({
      file,
      progress: 0,
      preview: file.type.includes(FileTypes.Image)
        ? URL.createObjectURL(file)
        : undefined,
    }));
    uploadFiles(fileObjects);
  }

  async function uploadFiles(fileObjects: UploadingFile[]) {
    if (!multiple && (fileObjects.length > 1 || hasFiles)) {
      return toast.error("You can't upload more than one files");
    }

    if (
      multiple &&
      maxFilesCount &&
      fileObjects.length + uploadedFiles.length + files.length > maxFilesCount
    ) {
      return toast.error(`You can't upload more than ${maxFilesCount} files`);
    }

    if (maxFileSize) {
      const filteredFileObjects = fileObjects.filter(
        ({ file }) => file.size <= convertToBytes(maxFileSize),
      );
      if (filteredFileObjects.length === 0)
        return toast.error(
          `You can't upload files more than ${formatFileSize(maxFileSize)}`,
        );
      else if (filteredFileObjects.length !== fileObjects.length) {
        const omittedFilesCount =
          fileObjects.length - filteredFileObjects.length;
        fileObjects = filteredFileObjects;
        toast.error(
          `${omittedFilesCount} file${omittedFilesCount === 1 ? "" : "s"} have been omitted because they were found to have more than ${formatFileSize(maxFileSize)}`,
        );
      }
    }

    setFiles((prev) => [...prev, ...fileObjects]);

    const uploadPromises = fileObjects.map(async ({ file }, index) => {
      const formData = new FormData();
      formData.append("file", file);

      const cancelToken = new AbortController();

      setFiles((prev) =>
        prev.map((f) => (f.file === file ? { ...f, cancelToken } : f)),
      );

      return axios
        .post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            if (event.lengthComputable) {
              const percent = (event.progress || 0.5) * 100;
              setFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.file === file ? { ...f, progress: percent } : f,
                ),
              );
            }
          },
          signal: cancelToken.signal,
        })
        .then((response) => {
          setUploadedFiles((prev) => [
            ...prev,
            {
              name: response.data.fileName || `Unknown File ${index + 1}`,
              url: response.data.fileURL || "Invalid URL",
              fileType: response.data.fileType || "Invalid Type",
            },
          ]);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            throw new UploadCancelledError();
          }

          let errorMessage = "Unknown error occured!";

          if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || err.message;
          }

          toast.error(errorMessage);
          throw new Error(errorMessage);
        })
        .finally(() => {
          setFiles((prev) => prev.filter((f) => f.file !== file));
        });
    });

    let successResponses = 0;
    let errorResponses = 0;
    let cancelledResponses = 0;

    const responses = await Promise.allSettled(uploadPromises);
    responses.forEach((response) => {
      if (response.status === "fulfilled") {
        return successResponses++;
      } else {
        if (response.reason instanceof UploadCancelledError)
          return cancelledResponses++;
        return errorResponses++;
      }
    });

    if (successResponses === 0) return;
    else if (successResponses + cancelledResponses === responses.length)
      toast.success(
        `All ${successResponses} ${successResponses === 1 ? "file" : "files"} uploaded successfully.`,
      );
    else
      toast.error(
        `${successResponses} ${successResponses === 1 ? "file" : "files"} uploaded successfully. ${errorResponses} ${errorResponses === 1 ? "file" : "files"} failed to upload.`,
      );
  }

  function cancelUpload(file: File) {
    const fileToCancel = files.find((f) => f.file === file);
    if (!fileToCancel) return;

    fileToCancel?.cancelToken?.abort();
    setFiles((prev) => prev.filter((f) => f.file !== file));
    toast.success(`Cancelled uploading for '${fileToCancel.file.name}'`);
  }

  async function deleteFile(url: string) {
    try {
      const fileToDelete = uploadedFiles.find((file) => file.url === url);
      if (!fileToDelete) return;

      await axios.delete("/api/upload", { data: { url } });
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((file) => file.url !== url),
      );
      toast.success(`Deleted '${fileToDelete.name}' file`);
    } catch (err) {
      let errorMessage = "Unknown error occured!";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      }

      toast.error(errorMessage);
    }
  }

  const isUploadAllowed = multiple
    ? maxFilesCount
      ? files.length + uploadedFiles.length < maxFilesCount
      : true
    : !hasFiles;

  return (
    <div>
      {isUploadAllowed && (
        <label
          className={cn(
            "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100",
            isDragging && "border-primary",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDropOver}
        >
          <div className="text-center">
            <div
              className={cn(
                "mx-auto max-w-min rounded-md border p-2 transition",
                isDragging && "border-dashed border-primary",
              )}
            >
              <UploadCloud size={20} />
            </div>

            <p className="mt-2 text-sm font-semibold text-gray-600">
              Drag files
            </p>
            <p className="text-xs text-gray-500">
              Click to upload files{" "}
              {maxFileSize
                ? `(files should be under ${formatFileSize(maxFileSize)})`
                : null}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple={multiple}
            onChange={handleFilesSelect}
          />
        </label>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <p>Uploading files</p>
          <div className="mt-2 space-y-2">
            {files.map(({ file, preview, progress }) => (
              <FileList key={file.name}>
                <FileIcon
                  fileType={file.type}
                  name={file.name}
                  preview={preview}
                />

                <FileName name={file.name} progress={progress} />
                <Button
                  onClick={() => cancelUpload(file)}
                  size="icon"
                  variant="destructive"
                >
                  <XIcon />
                </Button>
              </FileList>
            ))}
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <p>Uploaded files</p>
          <div className="mt-2 space-y-2">
            {uploadedFiles.map(({ name, url, fileType }) => (
              <FileList key={name}>
                <FileIcon fileType={fileType} name={name} preview={url} />

                <FileName name={name} />
                <Button
                  onClick={() => deleteFile(url)}
                  size="icon"
                  variant="destructive"
                >
                  <TrashIcon />
                </Button>
              </FileList>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

class UploadCancelledError extends Error {
  constructor(message: string = "Upload was cancelled") {
    super(message);
    this.name = "UploadCancelledError";
  }
}

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}

function FilePreviewWithDownload({
  src,
  children,
}: {
  src: string;
  children: ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={src}
            target="_blank"
            download
            className="group relative flex items-center justify-center"
          >
            <div className="p-2">{children}</div>
            <DownloadIcon className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1 text-black opacity-0 transition group-hover:opacity-100" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Download</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function FilePreviewWithIcon({
  name,
  src,
  type,
}: {
  name: string;
  src: string;
  type: "image" | "video" | "audio";
}) {
  const mediaContent =
    type === "image" ? (
      <Image
        width={30}
        height={30}
        alt={name}
        src={src}
        className="aspect-square w-full shrink-0 rounded-md object-cover"
      />
    ) : type === "video" ? (
      <video
        src={src}
        className="aspect-square w-full shrink-0 rounded-md object-cover"
      />
    ) : (
      <AudioWaveform
        width="auto"
        height="auto"
        className="w-full text-primary"
      />
    );

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <button className="group relative flex w-full items-center justify-center">
                {mediaContent}
                <EyeIcon className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-1 text-black opacity-0 transition group-hover:opacity-100" />
              </button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>Preview</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent
        className={"max-h-screen overflow-y-scroll lg:max-w-screen-lg"}
      >
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        {type === "image" ? (
          <Image
            src={src}
            alt={name}
            width={500}
            height={500}
            className="h-auto w-full"
          />
        ) : (
          <MediaPlayer title={name} src={src}>
            <MediaProvider />
            <PlyrLayout icons={plyrLayoutIcons} />
          </MediaPlayer>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getFileIcon(IconComponent: React.ComponentType<LucideProps>) {
  return (
    <div className="p-2">
      <IconComponent
        width="auto"
        height="auto"
        className="w-full text-primary"
      />
    </div>
  );
}

function FileIcon({
  fileType,
  name,
  preview,
}: {
  fileType: string;
  name: string;
  preview?: string;
}) {
  if (!preview) {
    switch (true) {
      case fileType.includes(FileTypes.Image):
        return getFileIcon(FileImageIcon);
      case fileType.includes(FileTypes.Pdf):
        return getFileIcon(File);
      case fileType.includes(FileTypes.Audio):
        return getFileIcon(AudioWaveform);
      case fileType.includes(FileTypes.Video):
        return getFileIcon(FileVideoIcon);
      default:
        return getFileIcon(FolderArchive);
    }
  }

  switch (true) {
    case fileType.includes(FileTypes.Image):
      return <FilePreviewWithIcon name={name} src={preview} type="image" />;
    case fileType.includes(FileTypes.Pdf):
      return (
        <FilePreviewWithDownload src={preview}>
          {getFileIcon(File)}
        </FilePreviewWithDownload>
      );
    case fileType.includes(FileTypes.Audio):
      return <FilePreviewWithIcon name={name} src={preview} type="audio" />;
    case fileType.includes(FileTypes.Video):
      return <FilePreviewWithIcon name={name} src={preview} type="video" />;
    default:
      return (
        <FilePreviewWithDownload src={preview}>
          {getFileIcon(FolderArchive)}
        </FilePreviewWithDownload>
      );
  }
}

function FileList(props: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr,6fr,1fr] items-center gap-2">
      {props.children}
    </div>
  );
}

function FileName(props: { name: string; progress?: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">
        {props.name.length > 30
          ? `${props.name.substring(0, 30)}...`
          : props.name}
      </span>
      {props.progress ? (
        <Progress value={props.progress} max={100} className="h-2" />
      ) : null}
    </div>
  );
}

function formatFileSize(fileSize: string) {
  const regex = /^(\d+(\.\d+)?)(mb|gb)$/i;
  const match = fileSize.match(regex);

  if (match) {
    const number = match[1];
    const unit = match[3].toUpperCase();
    return `${number} ${unit}`; // Format as "2 MB" or "3.5 GB"
  }

  throw new Error("Invalid file size format");
}

function convertToBytes(fileSize: FileSize) {
  const regex = /^(\d+(\.\d+)?)(mb|gb)$/i;
  const match = fileSize.match(regex);

  if (match) {
    const number = parseFloat(match[1]);
    const unit = match[3].toLowerCase();

    if (unit === "mb") {
      return number * 1024 * 1024;
    } else if (unit === "gb") {
      return number * 1024 * 1024 * 1024;
    }
  }

  throw new Error("Invalid file size format");
}
