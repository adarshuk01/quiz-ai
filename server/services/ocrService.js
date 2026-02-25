const { createWorker } = require("tesseract.js");

exports.extractTextFromImage = async (imagePath) => {
  const worker = await createWorker("eng");

  const {
    data: { text },
  } = await worker.recognize(imagePath);

  

  await worker.terminate();

  return text;
};
