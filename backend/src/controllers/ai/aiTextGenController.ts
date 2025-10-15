import { Request, Response } from "express";
import axios from "axios";

const model = process.env.MISTRAL_MODEL || "open-mistral-7b";

const aiTextGenController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: `write a social media post for, or about- ${prompt} and don't ask for follow ups. just write the post.` }],
        max_tokens: 700,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data)

    return res.json({success: true, message: "text generated successfully",
      output: response.data.choices?.[0]?.message?.content || "",
    });
  } catch (err: any) {
    console.error("Mistral error:", err.response?.data || err.message);
    return res.status(err.response?.status || 500).json({ error: err.message });
  }
};

export default aiTextGenController;
