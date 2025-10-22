import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import { getFileExtension } from "@/libs/fileUtil";

type CustomFile = {
  id: string;
  file: File;
};

const UPLOAD_DIR = path.join(
  process.cwd(),
  process.env.UPLOAD_CACHE_DIRECTORY || "uploads",
  "cache"
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileArr: CustomFile[] = [];

    // Convert entries to an array
    Array.from(formData.entries()).forEach(([key, value]) => {
      if (value instanceof File) {
        fileArr.push({ file: value, id: key });
      }
    });

    if (fileArr.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Yüklenecek dosya bulunamadı.",
        },
        { status: 400 }
      );
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Check directory permissions
    try {
      await fs.stat(UPLOAD_DIR);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}

    const uploadedFiles = [];

    for (const item of fileArr) {
      const fileExt = getFileExtension(item.file.name);
      const filePath = path.join(UPLOAD_DIR, `${item.id}.${fileExt}`);

      try {
        const buffer = Buffer.from(await item.file.arrayBuffer());

        const fileType = await fileTypeFromBuffer(buffer);

        if (!fileType || fileType.mime !== "application/pdf") {
          return NextResponse.json(
            {
              success: false,
              message:
                "Geçersiz dosya türü. Sadece PDF dosyası yükleyebilirsiniz.",
            },
            { status: 400 }
          );
        }

        await fs.writeFile(filePath, buffer);

        uploadedFiles.push({
          id: item.id,
          name: item.file.name,
          size: item.file.size,
          type: item.file.type,
          path: filePath,
        });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            message: `Dosya ${item.file.name} kaydedilirken hata oluştu.`,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Dosya(lar) başarıyla yüklendi.",
      files: uploadedFiles,
    });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Sunucu hatası oluştu.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = await req.text();
    const parsedId = id.trim().replace(/['"]+/g, ""); // Removes quotes & trims spaces

    if (!parsedId) {
      return NextResponse.json(
        {
          success: false,
          message: "Silinecek dosya ID bilgisi bulunamadı.",
        },
        { status: 400 }
      );
    }

    // Ensure the directory exists
    try {
      await fs.access(UPLOAD_DIR);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Dosya yükleme klasörü bulunamadı.",
        },
        { status: 404 }
      );
    }

    // Read all files in the directory
    const files = await fs.readdir(UPLOAD_DIR);

    // Find files matching the given ID
    const matchedFiles = files.filter((file) => file.includes(parsedId));

    if (matchedFiles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Eşleşen dosya bulunamadı.",
        },
        { status: 404 }
      );
    }

    // Delete matched files
    for (const file of matchedFiles) {
      const filePath = path.join(UPLOAD_DIR, file);
      await fs.unlink(filePath);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Dosya(lar) başarıyla silindi.",
        deletedFiles: matchedFiles,
      },
      { status: 200 }
    );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Sunucu hatası",
      },
      { status: 500 }
    );
  }
}
