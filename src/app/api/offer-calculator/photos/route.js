import { NextResponse } from "next/server";
import { addProjectPhoto } from "@/lib/offerCalculator/store";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export async function POST(request) {
  const formData = await request.formData();
  const sessionId = String(formData.get("sessionId") || "");
  const category = String(formData.get("category") || "Other").slice(0, 80);
  const file = formData.get("photo");

  if (!sessionId) {
    return NextResponse.json({ error: "Calculation session is required." }, { status: 400 });
  }

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Photo file is required." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Please upload JPG, PNG, WEBP, HEIC or HEIF images." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Please keep each photo under 3 MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
  const result = await addProjectPhoto({
    sessionId,
    category,
    file: {
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl
    }
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, photo: result.photo });
}
