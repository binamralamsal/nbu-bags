import crypto from "crypto";
import fs from "fs";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

import { STATUS } from "@/configs/constants";
import { UnauthorizedError } from "@/errors/unauthorized-error";
import { ensureAdmin } from "@/features/auth/server/auth.query";
import { db } from "@/libs/drizzle";
import { uploadedFilesTable } from "@/libs/drizzle/schema";

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

    const [values] = await db
      .insert(uploadedFilesTable)
      .values({
        name: fileName,
        fileType: file.type,
        url: fileURL,
      })
      .returning();

    return Response.json(
      {
        message: "File Uploaded successfully.",
        status: STATUS.SUCCESS,
        details: values,
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
