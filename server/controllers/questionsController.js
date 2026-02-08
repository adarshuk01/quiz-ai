const QuestionSet = require("../models/QuestionSet");
const { extractTextFromPDFBuffer } = require("../services/pdfService");
const { chunkText } = require("../services/chunkService");
const {
  generateQuizQuestions,
  generateTopicFromText,
} = require("../services/aiService");
const ai = require("../config/ai"); // your AI config


exports.generateFromTopic = async (req, res) => {
  try {
    const { topic, count } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic required" });
    }

    const totalRequired = Number(count) || 50; // default 50
    const batchSize = 50;

    const generateBatch = async (batchCount) => {
      const prompt = `
Generate ${batchCount} multiple choice questions about "${topic}".

Rules:
- Each question must have exactly 4 options
- Only one option must be correct
- correctAnswer must be the index (0,1,2,3)
- Do NOT repeat questions
- Do NOT include explanations
- Return ONLY valid JSON array
`;

      const aiResponse = await ai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }, // or json_schema
      });

      const text = aiResponse.choices[0].message.content;

      const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
      if (!jsonMatch) throw new Error("Invalid JSON from AI");

      return JSON.parse(jsonMatch[0]);
    };

    let questions = [];

    // keep generating until we reach required count
    while (questions.length < totalRequired) {
      const remaining = totalRequired - questions.length;
      const currentBatchSize = Math.min(batchSize, remaining);

      const batch = await generateBatch(currentBatchSize);
      questions = [...questions, ...batch];
    }

    // trim to exact count
    questions = questions.slice(0, totalRequired);

    const questionSet = await QuestionSet.create({
      topic,
      questions,
      createdBy: req.user._id,
    });

    res.json({
      message: "Question set created",
      questionSetId: questionSet._id,
      questions,
    });
  } catch (err) {
    console.error("AI GENERATE ERROR:", err);
    res.status(500).json({ message: "Failed to generate questions" });
  }
};





exports.deleteQuestionSet = async (req, res) => {
  try {
    const { id } = req.params;

    const questionSet = await QuestionSet.findById(id);

    if (!questionSet) {
      return res.status(404).json({ message: "Question set not found" });
    }

    // Optional: ensure only creator can delete
    if (questionSet.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await QuestionSet.findByIdAndDelete(id);

    res.json({ message: "Question set deleted successfully" });
  } catch (err) {
    console.error("DELETE QUESTION SET ERROR:", err);
    res.status(500).json({ message: "Failed to delete question set" });
  }
};



// PUT /api/question-sets/:id
exports.updateQuestionSet = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid questions array" });
    }

    // Validate each question
    const validQuestions = questions.filter(q =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      Number.isInteger(q.correctAnswer) &&
      q.correctAnswer >= 0 &&
      q.correctAnswer <= 3
    );

    const updated = await QuestionSet.findByIdAndUpdate(
      req.params.id,
      { questions: validQuestions },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "QUESTION_SET_NOT_FOUND" });
    }

    res.json({
      message: "Question set updated",
      questionSet: updated,
    });
  } catch (err) {
    console.error("UPDATE QUESTION SET ERROR:", err);
    res.status(500).json({ message: "Failed to update question set" });
  }
};


exports.processPDF = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "PDF_REQUIRED" });
    }

    // 🔹 1. Extract text
    let text;
    try {
      text = await extractTextFromPDFBuffer(req.file.buffer);
    } catch {
      return res.status(400).json({
        message: "PDF_HAS_NO_READABLE_TEXT",
      });
    }

    // 🔹 2. Generate topic (once)
    let topic = "General";
    try {
      topic = await generateTopicFromText(text);
    } catch {
      console.warn("Topic generation failed, using default");
    }

    // 🔹 3. Chunk text
    const chunks = chunkText(text, 15000);
    let allQuestions = [];

    for (const chunk of chunks) {
      try {
        let questions = await generateQuizQuestions(chunk);

        questions = questions.filter(q =>
          q &&
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          q.options.every(opt => typeof opt === "string") &&
          Number.isInteger(q.correctAnswer) &&
          q.correctAnswer >= 0 &&
          q.correctAnswer <= 3
        );

        allQuestions.push(...questions);
      } catch {
        console.warn("AI failed for one chunk, skipping");
      }
    }

    // 🔹 4. Deduplicate
    const seen = new Set();
    allQuestions = allQuestions.filter(q => {
      const key = q.question.replace(/\s+/g, " ").trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (allQuestions.length === 0) {
      return res.status(400).json({
        message: "NO_VALID_QUESTIONS_GENERATED",
      });
    }

    // 🔹 5. Save
    const saved = await QuestionSet.create({
      sourceFile: req.file.originalname,
      topic,
      questions: allQuestions,
      createdBy: req.user.id
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("PROCESS PDF ERROR:", err);
    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};

exports.getMyQuestionSets = async (req, res) => {
  try {
    const sets = await QuestionSet.find({
      createdBy: req.user.id,
    })
      .select("topic sourceFile createdAt questions")
      .sort({ createdAt: -1 });

    // send only count instead of full questions
    const formatted = sets.map(set => ({
      _id: set._id,
      topic: set.topic,
      sourceFile: set.sourceFile,
      createdAt: set.createdAt,
      questionCount: set.questions.length,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};

exports.getQuestionSetById = async (req, res) => {
  try {
    const set = await QuestionSet.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!set) {
      return res.status(404).json({ message: "NOT_FOUND" });
    }

    res.status(200).json(set);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};



