const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
require("dotenv").config();


const LLAMA_API_KEY = process.env.LLAMA_CLOUD_API_KEY;

if (!LLAMA_API_KEY) {
  throw new Error("LLAMA_CLOUD_API_KEY is missing");
}

const baseURL = "https://api.cloud.llamaindex.ai/api/parsing";

/**
 * Upload + Start Parse Job
 */
const uploadAndParseFile = async (fileBuffer, originalName, mimeType) => {
  try {
    const form = new FormData();

    form.append("file", fileBuffer, {
      filename: originalName,
      contentType: mimeType,
    });

    form.append("parse_mode", "parse_page_with_agent");
    form.append("model", "openai-gpt-4-1-mini");
    form.append("high_res_ocr", "true");
    form.append("adaptive_long_table", "true");
    form.append("outlined_table_extraction", "true");
    form.append("output_tables_as_HTML", "true");

    const response = await axios.post(
      `${baseURL}/upload`,
      form,
      {
        headers: {
          Authorization: `Bearer ${LLAMA_API_KEY}`,
          ...form.getHeaders(),
        },
        maxBodyLength: Infinity,
      }
    );

    return response.data.id;

  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Poll For Result
 */
const getParseResult = async (jobId) => {
  const headers = {
    Authorization: `Bearer ${LLAMA_API_KEY}`,
  };

  const statusURL = `${baseURL}/job/${jobId}`;
  const resultURL = `${baseURL}/job/${jobId}/result/json`;

  const maxAttempts = 40; // ~80 seconds
  const delay = 2000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // 🔹 Step 1: Check Job Status
      const statusResponse = await axios.get(statusURL, { headers });
      const status = statusResponse.data.status;

      console.log("Job Status:", status);

      if (status === "SUCCESS") {
        // 🔹 Step 2: Fetch Result
        const resultResponse = await axios.get(resultURL, { headers });
        return resultResponse.data;
      }

      if (status === "ERROR" || status === "FAILED") {
        throw new Error("Parsing job failed.");
      }

      // 🔹 Wait before retry
      await new Promise((res) => setTimeout(res, delay));

    } catch (err) {
      console.error("Polling error:", err.response?.data || err.message);
      throw err;
    }
  }

  throw new Error("Parsing timed out.");
};

module.exports = {
  uploadAndParseFile,
  getParseResult,
};