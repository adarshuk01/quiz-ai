const openai = require("../config/ai");

function extractJSONArray(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON array found");

    return JSON.parse(match[0]);
  }
}


exports.generateQuizQuestions = async (text,questions) => {
  console.log('questions',questions);
  
  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.3, // 👈 lower = more consistent MCQs
    response_format: { type: "json_object" }, // 👈 ADD THIS
    messages: [
      {
        role: "system",
        content:
          `You are an expert quiz generator. You always return valid JSON. 
          You are a strict exam paper parser.

You DO NOT create or modify questions.
You ONLY extract existing multiple choice questions exactly as written.
You must preserve original wording and options exactly.
Return structured JSON only.
          `,
      },
      {
        role: "user",
        content: `
Generate ${questions} multiple choice quiz questions from the text below.

Rules:
- Each question must have exactly 4 options 
- Only one option must be correct
- correctAnswer must be the index (0,1,2,3)
- Do NOT repeat questions
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

 const raw = response.choices[0].message.content.trim();

  return extractJSONArray(raw);
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

