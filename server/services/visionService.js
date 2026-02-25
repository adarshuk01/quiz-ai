const openai = require("../config/openai");
const fs = require("fs");

exports.extractQuestionsFromImage = async (imagePath) => {
  const base64Image = fs.readFileSync(imagePath, {
    encoding: "base64",
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
Extract quiz questions and options from the image.
Return ONLY valid JSON.
Format:
[
  {
    "question": "text",
    "options": ["A", "B", "C", "D"]
  }
]
        `,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
  });

  let content = response.choices[0].message.content;
  content = content.replace(/```json|```/g, "").trim();

  return JSON.parse(content);
};
