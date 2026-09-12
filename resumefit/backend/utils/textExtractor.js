import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function extractTextFromFile(filePath, mimeType) {
  const buffer = fs.readFileSync(filePath);

  if (mimeType === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  // Fallback: treat as plain text
  return buffer.toString("utf-8");
}
