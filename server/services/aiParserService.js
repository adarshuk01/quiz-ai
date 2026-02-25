const openai = require("../config/ai");

exports.parseQuestionsWithAI = async (text) => {
  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: `
Extract quiz questions and options.
Return ONLY valid JSON.
Do not use backticks or markdown.
        `,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  let content = response.choices[0].message.content;

  // Remove code block markers if present
  content = content.replace(/```json|```/g, "").trim();

  return JSON.parse(content);
};
