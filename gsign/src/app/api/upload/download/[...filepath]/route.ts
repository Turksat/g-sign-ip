import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filepath: string[] }> }
) {
  const resolvedParams = await params;
  try {
    const filepath = resolvedParams.filepath;
    if (!filepath || filepath.length === 0) {
      return NextResponse.json(
        { success: false, message: "File path is required" },
        { status: 400 }
      );
    }

    // Construct the full file path
    const uploadDir = path.join(process.cwd(), "uploads", "cache");
    const fullPath = path.join(uploadDir, ...filepath);

    // Security check: ensure the path is within uploads directory
    if (!fullPath.startsWith(uploadDir)) {
      return NextResponse.json(
        { success: false, message: "Invalid file path" },
        { status: 400 }
      );
    }

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await fs.readFile(fullPath);
    const fileName = path.basename(fullPath);

    // Return file with appropriate headers
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/pdf",
      },
    });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
