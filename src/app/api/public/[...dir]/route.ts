import fs from "fs";
import mime from "mime-types";
import path from "path";

function nodeToWebReadable(nodeReadable: fs.ReadStream) {
  const reader = nodeReadable[Symbol.asyncIterator]();
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
    cancel() {
      nodeReadable.destroy();
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dir: string[] }> },
) {
  const filePath = path.join(
    process.cwd(),
    "public",
    (await params).dir.join("/"),
  );
  const mimeType = mime.lookup(filePath);

  try {
    const stats = await fs.promises.stat(filePath);
    const range = request.headers.get("range");

    if (mimeType && mimeType.startsWith("video/")) {
      if (!range) {
        // Stream the entire video if no range header is present
        const videoStream = fs.createReadStream(filePath);
        return new Response(nodeToWebReadable(videoStream), {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Content-Length": stats.size.toString(),
          },
        });
      } else {
        const [start, end] = range.replace(/bytes=/, "").split("-");
        const startNum = parseInt(start, 10);
        const endNum = end ? parseInt(end, 10) : stats.size - 1;
        const chunkSize = endNum - startNum + 1;

        const videoStream = fs.createReadStream(filePath, {
          start: startNum,
          end: endNum,
        });

        return new Response(nodeToWebReadable(videoStream), {
          status: 206,
          headers: {
            "Content-Range": `bytes ${startNum}-${endNum}/${stats.size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize.toString(),
            "Content-Type": mimeType,
          },
        });
      }
    } else {
      // For non-video files, return the entire file content

      const fileStream = fs.createReadStream(filePath);
      return new Response(nodeToWebReadable(fileStream), {
        status: 200,
        headers: {
          "Content-Type": mimeType || "application/octet-stream",
          "Content-Length": stats.size.toString(),
        },
      });

      //   const data = await fs.promises.readFile(filePath);
      //   return new Response(data, {
      //     status: 200,
      //     headers: {
      //       "Content-Type": mimeType || "application/octet-stream",
      //       "Content-Length": stats.size.toString(),
      //     },
      //   });
    }
  } catch (error) {
    if (!(error instanceof Error)) {
      return Response.json(
        { error: "Failed to read file" },
        {
          status: 500,
        },
      );
    }

    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return Response.json(
        { error: "File not found" },
        {
          status: 404,
        },
      );
    } else {
      return Response.json(
        { error: "Failed to read file" },
        {
          status: 500,
        },
      );
    }
  }
}
