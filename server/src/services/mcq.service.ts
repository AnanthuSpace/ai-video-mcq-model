import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { IMCQRepository } from "../interfaces/mcq.repository.interface";
import { IMCQService } from "../interfaces/mcq.service.interface";

export class MCQService implements IMCQService {
    constructor(private mcqRepository: IMCQRepository) { }

    videoToMCQService = async (filePath: string): Promise<any> => {
        try {
            const form = new FormData();
            form.append("file", fs.createReadStream(filePath));

            const response = await axios.post(`${process.env.AI_Service_URL}/transcribe`, form, {
                headers: {
                    ...form.getHeaders(),
                },
            });

            const segments: string[] = response.data.transcript;

            const mcqsPerSegment = [];
            for (const segment of segments) {
                const mcqResponse = await axios.post(`${process.env.AI_Service_URL}/generate-mcq`, {
                    text: segment,
                });

                const mcqs = mcqResponse.data.mcqs;
                console.log(mcqResponse.data)
                mcqsPerSegment.push(mcqs);
            }
            return mcqsPerSegment;

        } catch (error) {
            console.error("Error in videoToMCQService:", error);
            throw error;
        }
    };


}
