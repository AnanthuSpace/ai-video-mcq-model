import { Router } from "express";
import { MCQRepository } from "../repositories/mcq.repository";
import { MCQService } from "../services/mcq.service";
import { MCQModel } from "../models/mcq.model";
import { MCQController } from "../controllers/mcq.controller";
import { uploadVideo } from "../middlewares/uploadVideo";

const router = Router();

const McqRepository = new MCQRepository(MCQModel);
const McqService = new MCQService(McqRepository);
const controller = new MCQController(McqService);

router.post("/", uploadVideo.single("video"), controller.convertVideoToMCQs);

export default router;
