// import express from "express";
// import { Request, Response } from "express";

// const webhookRouter = express.Router();

// webhookRouter.post(
//   "/ai/image",
//   async (req: Request, res: Response): Promise<any> => {
//     const prediction = req.body;

//     if (prediction.status === "succeeded") {
//       console.log("Image URL:", prediction.output[0]);
//       return res
//         .status(200)
//         .json({
//           success: true,
//           message: "image generated successfully",
//           image: prediction.output[0],
//         });
//     } else if (prediction.status === "failed") {
//       console.error("Image generation failed.");

//       return res
//         .status(500)
//         .json({ success: false, message: "Image generation failed." });
//     }
//   }
// );

// export default webhookRouter;
