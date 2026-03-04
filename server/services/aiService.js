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

CRITICAL RULE:
If extracting existing MCQs:
- Identify the correct option EXACTLY from the original question.
- Convert A → 0
- Convert B → 1
- Convert C → 2
- Convert D → 3
- The index MUST match the position in the options array.

You MUST double-check that:
options[correctAnswer] is truly the correct answer.

CASE 1:
If the text already contains MCQs:
- Extract question exactly as written.
- Preserve options wording exactly.
- Map the correct answer letter to correct index.
- Verify the index matches the option.

CASE 2:
If the text is study material:
- Create conceptual MCQs.
- Only one correct answer.
- Make distractors realistic but incorrect.

GENERAL RULES:
- Return ONLY a valid JSON array.
- Exactly 4 options.
- correctAnswer must be 0,1,2,3.
- Double-check correctness before returning.
- No explanations.
`
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

