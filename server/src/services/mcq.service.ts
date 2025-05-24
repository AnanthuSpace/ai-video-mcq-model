import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { IMCQRepository } from "../interfaces/mcq.repository.interface";
import { IMCQService } from "../interfaces/mcq.service.interface";
import { IMCQ } from "../interfaces/common.interfaces";

export class MCQService implements IMCQService {
    constructor(private mcqRepository: IMCQRepository) { }

    videoToMCQService = async (filePath: string): Promise<IMCQ[]> => {
    try {
      const form = new FormData();
      form.append("file", fs.createReadStream(filePath));

      const response = await axios.post(`${process.env.AI_Service_URL}/transcribe`, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      const segments: string[] = response.data.transcript;

      let allMCQs: IMCQ[] = [];

      for (const segment of segments) {
        const mcqResponse = await axios.post(`${process.env.AI_Service_URL}/generate-mcq`, {
          text: segment,
        });

        const mcqs = mcqResponse.data.mcqs;

        // Transform your AI MCQ data to your IMCQ interface structure if necessary
        const formattedMCQs: IMCQ[] = mcqs.map((mcq: any) => ({
          question: mcq.question,
          options: mcq.options,
          answer: mcq.answer,
          timestamp: new Date(),
        }));

        // Save these MCQs to DB
        const savedMCQs = await this.mcqRepository.saveMCQs(formattedMCQs);

        allMCQs = allMCQs.concat(savedMCQs);
      }

      return allMCQs;
    } catch (error) {
      console.error("Error in videoToMCQService:", error);
      throw error;
    }
  };


}
