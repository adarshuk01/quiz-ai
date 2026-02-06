const Tesseract = require("tesseract.js");
const fs = require("fs");

exports.extractTextWithOCR = async (filePath) => {
  const {
    data: { text },
  } = await Tesseract.recognize(filePath, "mal", {
    logger: m => console.log(m),
  });

  return text;
};
