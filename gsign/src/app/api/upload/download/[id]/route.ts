import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const UPLOAD_DIR = path.join(
  process.cwd(),
  process.env.UPLOAD_CACHE_DIRECTORY || "uploads",
  "cache"
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "File ID is required" },
        { status: 400 }
      );
    }

    // Find the file in the upload directory
    const files = await fs.readdir(UPLOAD_DIR);
    const targetFile = files.find((file) => file.startsWith(id));

    if (!targetFile) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    const filePath = path.join(UPLOAD_DIR, targetFile);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath);

    // Get file stats for headers
    const stats = await fs.stat(filePath);

    // Determine content type based on file extension
    const ext = path.extname(targetFile).toLowerCase();
    let contentType = "application/octet-stream";

    if (ext === ".pdf") {
      contentType = "application/pdf";
    } else if (ext === ".doc") {
      contentType = "application/msword";
    } else if (ext === ".docx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (ext === ".txt") {
      contentType = "text/plain";
    }

    // Create response with appropriate headers
    const response = new NextResponse(new Uint8Array(fileBuffer));
    response.headers.set("Content-Type", contentType);
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${targetFile}"`
    );
    response.headers.set("Content-Length", stats.size.toString());
    response.headers.set("Cache-Control", "no-cache");

    return response;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 }
    );
  }
}
