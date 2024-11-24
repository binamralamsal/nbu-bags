import crypto from "crypto";
import fs from "fs";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { z } from "zod";

import { STATUS } from "@/configs/constants";
import { UnauthorizedError } from "@/errors/unauthorized-error";
import { ensureAdmin } from "@/features/auth/server/auth.query";

async function readableStreamToAsyncIterable(
  stream: ReadableStream<Uint8Array>,
) {
  const reader = stream.getReader();

  return {
    async *[Symbol.asyncIterator]() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield value;
      }
    },
  };
}

export async function POST(request: Request) {
  const formData = await request.formData();

  try {
    await ensureAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return Response.json(
        {
          message: `You must have administrative rights to upload files.`,
          status: STATUS.ERROR,
        },
        { status: 422 },
      );

    return Response.json(
      {
        message: "Internal server error occured",
        status: STATUS.ERROR,
      },
      { status: 500 },
    );
  }

  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return Response.json({ error: "No file uploaded" }, { status: 401 });
  }

  const hash = crypto.randomBytes(10).toString("hex");
  const fileName = `${hash}-${file.name}`;
  const uploadedFilePath = `./public/uploads/${fileName}`;
  const fileURL = `/api/public/uploads/${fileName}`;

  try {
    const asyncIterable = await readableStreamToAsyncIterable(file.stream());
    const nodeStream = Readable.from(asyncIterable);
    const fileStream = fs.createWriteStream(uploadedFilePath);

    await pipeline(nodeStream, fileStream);

    return Response.json(
      {
        message: "File Uploaded successfully.",
        fileURL,
        filePath: uploadedFilePath,
        fileType: file.type,
        fileName,
        status: STATUS.SUCCESS,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        message: `Error occured while uploading. Please try again.`,
        status: STATUS.SUCCESS,
      },
      { status: 401 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError)
      return Response.json(
        {
          message: `You must have administrative rights to upload files.`,
          status: STATUS.ERROR,
        },
        { status: 422 },
      );

    return Response.json(
      {
        message: "Internal server error occured",
        status: STATUS.ERROR,
      },
      { status: 500 },
    );
  }

  const rawBody = await request.json();
  const { data: body, error } = deleteFileBodySchema.safeParse(rawBody);
  if (error)
    return Response.json(
      { message: error.issues[0].message, status: STATUS.VALIDATION_ERROR },
      { status: 401 },
    );

  try {
    await fs.promises.unlink(body.url);
  } catch {}

  return Response.json(
    {
      message: "File deleted successfully.",
      status: STATUS.SUCCESS,
    },
    { status: 200 },
  );
}

const deleteFileBodySchema = z.object({
  url: z
    .string()
    .trim()
    .startsWith("/api/public/uploads/")
    .transform((url) => {
      return url.replace(/^\/api/, ".");
    }),
});
