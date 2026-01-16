import { Request, Response } from "express";
import axios from "axios";

const MODEL = process.env.MISTRAL_MODEL || "open-mistral-7b";
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

const aiTextGenController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { prompt, type } = req.body;

  if (!prompt || !type) {
    return res.status(400).json({
      success: false,
      message: "prompt and type are required",
    });
  }

  // ✅ Hard rule: model behavior decided here
  const systemMessage =
    type === "post"
      ? "You are a professional social media content writer. Write only the post. Do not ask questions or add explanations."
      : "You are a helpful AI chat assistant. Respond conversationally and naturally.";

  try {
    const response = await axios.post(
      MISTRAL_URL,
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: type === "post" ? 700 : 1200,
        temperature: type === "post" ? 0.7 : 0.4,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({
      success: true,
      output: response.data.choices?.[0]?.message?.content ?? "",
    });
  } catch (error: any) {
    console.error("Mistral Error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      success: false,
      message: "AI generation failed",
    });
  }
};

export default aiTextGenController;
