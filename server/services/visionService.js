const { RealtimeVision } = require("overshoot");

const vision = new RealtimeVision({
  apiKey: process.env.OVERSHOOT_API_KEY,

  // ✅ REQUIRED
  model: "Qwen/Qwen3-VL-30B-A3B-Instruct",

  prompt: "Extract all readable text from this PDF",

  // For PDF → use file mode (NOT frame)
  mode: "file"
});

/**
 * Extract text from PDF buffer
 */
exports.extractTextFromVision = async (pdfBuffer) => {
  try {
    const result = await vision.process({
      file: pdfBuffer
    });

    if (!result || !result.text) {
      throw new Error("No text extracted");
    }

    return result.text;
  } catch (err) {
    console.error("Vision extraction failed:", err.message);
    throw err;
  }
};
