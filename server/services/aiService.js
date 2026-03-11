const openai = require("../config/ai");

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidQuestion(q) {
  return (
    q &&
    typeof q.question === "string" &&
    q.question.trim().length > 0 &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.options.every((o) => typeof o === "string" && o.trim().length > 0) &&
    typeof q.correctAnswer === "number" &&
    Number.isInteger(q.correctAnswer) &&
    q.correctAnswer >= 0 &&
    q.correctAnswer <= 3
  );
}

// ─── JSON Parser ──────────────────────────────────────────────────────────────

function extractJSONArray(text) {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) {
      console.error("[Quiz] Raw response:\n", cleaned.slice(0, 800));
      throw new Error("No JSON array found in response");
    }
    parsed = JSON.parse(match[0]);
  }

  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.questions)) return parsed.questions;

  throw new Error("Unexpected JSON shape — no questions array found");
}

// ─── Answer Verifier ──────────────────────────────────────────────────────────

/**
 * Uses correctAnswerText to verify and fix the correctAnswer index.
 * This prevents wrong answers caused by the model mis-indexing.
 */
function verifyAndFixAnswers(questions) {
  return questions.map((q) => {
    // If model provided correctAnswerText, use it to find the real index
    if (q.correctAnswerText && typeof q.correctAnswerText === "string") {
      const expectedText = q.correctAnswerText.trim().toLowerCase();

      // Find the option that matches correctAnswerText
      const matchedIndex = q.options.findIndex(
        (opt) => opt.trim().toLowerCase() === expectedText
      );

      if (matchedIndex !== -1 && matchedIndex !== q.correctAnswer) {
        console.warn(
          `[Quiz] Corrected answer index: was ${q.correctAnswer}, fixed to ${matchedIndex} ("${q.options[matchedIndex]}")`
        );
        q = { ...q, correctAnswer: matchedIndex };
      } else if (matchedIndex === -1) {
        console.warn(
          `[Quiz] correctAnswerText "${q.correctAnswerText}" not found in options — keeping model index ${q.correctAnswer}`
        );
      }
    }

    // Strip the helper field before returning
    const { correctAnswerText, ...clean } = q;
    return clean;
  });
}

// ─── Shuffle correct answer positions ────────────────────────────────────────

/**
 * Ensures correct answers are distributed across all 4 positions,
 * not clustered at index 0.
 */
function distributeAnswerPositions(questions) {
  return questions.map((q, i) => {
    const targetIndex = i % 4; // Cycle: 0, 1, 2, 3, 0, 1, 2 ...
    if (q.correctAnswer === targetIndex) return q;

    const options = [...q.options];
    const correctText = options[q.correctAnswer];
    const displaced = options[targetIndex];

    options[targetIndex] = correctText;
    options[q.correctAnswer] = displaced;

    return { ...q, options, correctAnswer: targetIndex };
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Single API call that converts content into MCQs.
 *
 * Handles 3 input types:
 *  1. Existing MCQs        → extract question + options + correct answer exactly
 *  2. Study material       → generate MCQs from the content
 *  3. Q&A / one-word pairs → form question, place given answer correctly, add 3 distractors
 *
 * @param {string} text           - Input content (any of the 3 types above)
 * @param {number} totalQuestions - How many MCQs to return
 * @returns {Promise<Array>}      - Validated array of question objects
 */
exports.generateQuizQuestions = async (text, totalQuestions) => {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Input text is empty or invalid");
  }

  const count = Math.max(1, Math.floor(Number(totalQuestions)));
  if (isNaN(count)) throw new Error("Invalid question count");

  console.log(`[Quiz] Sending single API request for ${count} questions...`);

  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
    max_tokens: 8192,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert MCQ exam assistant. Always respond in ENGLISH regardless of the input language.

OUTPUT FORMAT — return ONLY this JSON, nothing else:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0,
      "correctAnswerText": "string"
    }
  ]
}

FIELD RULES:
• question      — the question text in English. No numbering (no "1.", "2.", etc.)
• options       — exactly 4 answer choices as plain text. No labels (no "A)", "B)", "1.", etc.)
• correctAnswer — the INDEX (0, 1, 2, or 3) of the correct option in the options array
• correctAnswerText — the EXACT text of the correct option (must match options[correctAnswer] exactly)

correctAnswerText is critical for verification. Always set it to the exact string of the correct option.

════════════════════════════════════════
INPUT TYPE 1 — EXISTING MCQs
(question + 4 options + marked answer already present)
════════════════════════════════════════
• Translate question and options to English.
• Extract the question text. Remove any leading number or serial (e.g. "1.", "Q1:").
• Extract all 4 options as plain text. Remove any labels like "A)", "B)", "(a)", "(b)", "1.", "2.".
• Identify which option is marked as correct (by letter A/B/C/D or (a)/(b)/(c)/(d) or bold/underline hint).
• Set correctAnswer to the index (0–3) of that option.
• Set correctAnswerText to the exact text of that option.

LETTER TO INDEX: A or (a) → 0 | B or (b) → 1 | C or (c) → 2 | D or (d) → 3

════════════════════════════════════════
INPUT TYPE 2 — STUDY MATERIAL
(paragraphs, notes, theory text)
════════════════════════════════════════
• Generate clear MCQs in English directly from the content.
• Each question must be answerable from the text alone.
• Write 4 plausible options — exactly one must be correct.
• Do NOT invent facts not present in the text.
• Vary correctAnswer across 0, 1, 2, 3 — do NOT always use 0.
• Set correctAnswerText to the exact text of the correct option.

════════════════════════════════════════
INPUT TYPE 3 — Q&A or ONE-WORD ANSWERS
(e.g. "Capital of France? - Paris" or "Q: ... A: ...")
════════════════════════════════════════
• Translate both question and answer to English.
• Use the question as-is (remove any leading number like "1.", "2.").
• The provided answer IS the correct answer — place it in one of the 4 options.
• Generate exactly 3 plausible but WRONG distractors from the same category.
• Vary which index (0, 1, 2, or 3) holds the correct answer across questions.
• Set correctAnswer to that index.
• Set correctAnswerText to the exact text of the correct answer you placed.

DISTRACTOR RULES:
- Distractors must be the same type as the correct answer (e.g. if answer is a year, all options are years).
- Distractors must be factually wrong but believable.
- Do not repeat the correct answer as a distractor.

════════════════════════════════════════
STRICTLY FORBIDDEN — SKIP ENTIRELY:
════════════════════════════════════════
• Exam instructions, booklet codes, OMR filling rules, invigilator instructions
• Exam centre, date, duration, total marks, number of questions
• Candidate name, roll number, registration details
• Any question about the exam itself (meta questions)
• WhatsApp/Telegram group links, watermarks, page numbers, copyright text

CRITICAL — NEVER GENERATE THESE TYPES OF QUESTIONS:
• Questions that reference other questions (e.g. "According to question 9...", "In the tenth question...", "Which option is listed as C in question 5?")
• Questions about what is written in the options or answer choices themselves
• Questions about the structure, format, or numbering of the content
• Any question whose answer requires reading the question paper rather than knowing the subject

Every question must test knowledge of the SUBJECT MATTER ONLY — history, science, geography, etc.
If you cannot form a genuine subject-matter question from a piece of content, skip it entirely.

NEVER output markdown, explanations, or any text outside the JSON.`,
      },
      {
        role: "user",
        content: `Generate exactly ${count} MCQs from the content below. Always respond in ENGLISH.

Rules:
- Existing MCQs → extract exactly, translate to English, remove numbering and A/B/C/D labels from options.
- Study material → generate MCQs in English from the content.
- Q&A or one-word answers → form the MCQ in English, place the given answer correctly, add 3 wrong options.
- Skip anything about exam instructions, booklet codes, or administrative procedures.
- NEVER generate questions that reference other questions or ask about what is written in the options (e.g. "According to question 9...", "Which option is listed as C?"). Every question must test real subject knowledge only.
- Always include correctAnswerText matching options[correctAnswer] exactly.

Return ONLY:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": number,
      "correctAnswerText": "string"
    }
  ]
}

Content:
${text}`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from model");

  const questions = extractJSONArray(raw.trim());

  // Step 0: Filter out meta-questions about the question paper itself
  const metaPatterns = [
    /according to (the |question |q\.?\s*)?\w*(\s+\w+)? question/i,
    /in (the |question |q\.?\s*)?\w*(\s+\w+)? question/i,
    /which (option|answer|choice) is listed/i,
    /listed as option/i,
    /option [abcd] (in|of|from) (question|the)/i,
    /what is (written|mentioned|given|listed) (in|as) (option|question)/i,
  ];

  const nonMeta = questions.filter((q) => {
    const isMeta = metaPatterns.some((p) => p.test(q.question));
    if (isMeta) console.warn(`[Quiz] Filtered meta-question: "${q.question.slice(0, 80)}"`);
    return !isMeta;
  });

  // Step 1: Verify and fix correctAnswer using correctAnswerText
  const verified = verifyAndFixAnswers(nonMeta);

  // Step 2: Validate structure
  const valid = verified.filter(isValidQuestion);
  const invalidCount = verified.length - valid.length;
  if (invalidCount > 0) {
    console.warn(`[Quiz] ${invalidCount} question(s) failed validation and were removed.`);
  }

  if (valid.length === 0) {
    throw new Error("No valid questions returned. Check your input content.");
  }

  // Step 3: Distribute answer positions evenly (safety net)
  const distributed = distributeAnswerPositions(valid);

  // Step 4: Trim to requested count
  const final = distributed.slice(0, count);
  console.log(`[Quiz] Done. ${final.length}/${count} questions returned.`);

  return final;
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