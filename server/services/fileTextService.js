const pdf = require("pdf-parse");
const Tesseract = require("tesseract.js");

/**
 * Extract text from PDF buffer using pdf-parse
 */
async function extractTextFromPDF(buffer) {
  const data = await pdf(buffer);
  return data.text?.trim() || "";
}

/**
 * Extract text using Tesseract OCR
 */
async function extractTextWithOCR(buffer) {
  const { data } = await Tesseract.recognize(buffer, "eng", {
    logger: m => console.log(m.status)
  });

  return data.text?.trim() || "";
}

/**
 * Universal file-to-text extractor
 */
exports.extractTextFromFile = async (file) => {
  const { mimetype, buffer } = file;

  let text = "";

  // 1️⃣ If PDF → try normal extraction first
  if (mimetype === "application/pdf") {
    try {
      text = await extractTextFromPDF(buffer);

      // If PDF has readable text → return
      if (text.length > 50) {
        return text;
      }

      console.log("PDF has no readable text. Switching to OCR...");
    } catch (err) {
      console.log("PDF parse failed. Using OCR fallback...");
    }
  }

  // 2️⃣ OCR fallback for:
  // - scanned PDFs
  // - images (jpg, png, etc)
  text = await extractTextWithOCR(buffer);

  if (!text) {
    throw new Error("NO_TEXT_FOUND");
  }

  return text;
};
