const pdfParse = require("pdf-parse");

exports.extractTextFromPDFBuffer = async (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("INVALID_PDF_BUFFER");
  }

  try {
    const data = await pdfParse(buffer);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error("EMPTY_PDF_TEXT");
    }
    console.log(data.text);
    

    return data.text;
  } catch (err) {
    console.error("PDF PARSE ERROR:", err.message);
    throw new Error("PDF_TEXT_EXTRACTION_FAILED");
  }
};
