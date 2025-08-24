import axios from "axios";

export const moderateImage = async (imageBuffer: Buffer, apiKey: string) => {
  try {
    const response = await axios.post(
      "https://api.deepai.org/api/nsfw-detector",
      { image: imageBuffer.toString("base64") },
      {
        headers: {
          "Api-Key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    // DeepAI returns a score from 0-1
    const nsfwScore = response.data.output.nsfw_score;
    console.log("NSFW Score:", nsfwScore);
    
    return nsfwScore < 0.6; // Allow if less than 60% NSFW confidence
  } catch (error) {
    console.error("DeepAI Moderation Error:", error);
    return false;
  }
};
