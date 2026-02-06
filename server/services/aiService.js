const openai = require("../config/ai");

exports.generateQuizQuestions = async (text) => {
  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.3, // 👈 lower = more consistent MCQs
    messages: [
      {
        role: "system",
        content:
          "You are an expert quiz generator. You always return valid JSON.",
      },
      {
        role: "user",
        content: `
Generate 5 multiple choice quiz questions from the text below.

Rules:
- Each question must have exactly 4 options 
- Only one option must be correct
- correctAnswer must be the index (0,1,2,3)
- Do NOT repeat questions
- Do NOT include explanations
- Return ONLY valid JSON array

Format:
[
  {
    "question": "string",
    "options": ["string","string","string","string"],
    "correctAnswer": number
  }
]

Text:
${text}
        `,
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.generateTopicFromText = async (text) => {
  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: "You generate short, clear topics.",
      },
      {
        role: "user",
        content: `
From the text below, generate ONE short topic title (3–6 words max).
Do NOT use quotes.
Do NOT return JSON.
Return plain text only.

Text:
${text.slice(0, 2000)}
        `,
      },
    ],
  });

  return response.choices[0].message.content.trim();
};

