import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(req, context) {
  try {
    const { filename } = await context.params;
    
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse("Invalid filename", { status: 400 });
    }
    
    const filepath = path.join(process.cwd(), "public", "uploads", filename);
    
    if (!existsSync(filepath)) {
      console.log("File not found:", filepath);
      return new NextResponse("File not found", { status: 404 });
    }
    
    const imageBuffer = await fs.readFile(filepath);
    
    const ext = path.extname(filename).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    }[ext] || 'image/jpeg';
    
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Error serving image", { status: 500 });
  }
}
