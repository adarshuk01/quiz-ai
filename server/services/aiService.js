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


exports.generateQuizQuestions = async (text, questions) => {
  console.log("questions", questions);

  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
You are an expert exam assistant.

CASE 1:
If the text already contains multiple choice questions,
→ Extract them EXACTLY as written.
→ Do NOT modify wording.
→ Preserve original options.

CASE 2:
If the text is a summary, paragraph, or study material,
→ Convert the content into high-quality multiple choice questions.
→ Questions must test understanding, not trivial facts.

General Rules:
- Return ONLY valid JSON array.
- Each question must have exactly 4 options.
- Only one option must be correct.
- correctAnswer must be index (0,1,2,3).
- Do NOT repeat questions.
- Do NOT include explanations.
        `,
      },
      {
        role: "user",
        content: `
Generate ${questions} multiple choice questions from the text below.

Required Format:
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

