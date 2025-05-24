import { Request, Response, RequestHandler } from "express";
import { IMCQService } from "../interfaces/mcq.service.interface";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export class MCQController {
    constructor(private mcqService: IMCQService) { }

    convertVideoToMCQs: RequestHandler = async (req: MulterRequest, res: Response): Promise<void> => {
        try {
            const videoFilePath = req.file?.path;

            if (!videoFilePath) {
                res.status(400).json({ message: "No video file uploaded." });
                return;
            }

            console.log("Uploaded video path:", videoFilePath);

            const result = await this.mcqService.videoToMCQService(videoFilePath)

            res.status(200).json({ message: "Video uploaded successfully", mcqQuestions: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to process video" });
        }
    };
}
