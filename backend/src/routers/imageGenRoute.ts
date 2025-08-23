import express from "express";
import axios from "axios";
import { InferenceClient } from "@huggingface/inference";
const client = new InferenceClient(process.env.HF_TOKEN);

const router = express.Router();

router.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;
  console.log("prompt", prompt);

  try {
    const image: any = await client.textToImage({
      model: "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
    });

    let buffer: Buffer;

    if (typeof image.arrayBuffer === "function") {
      // It's a Blob
      buffer = Buffer.from(await image.arrayBuffer());
    } else {
      // It's already Uint8Array
      buffer = Buffer.from(image as Uint8Array);
    }

    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

export default router;
