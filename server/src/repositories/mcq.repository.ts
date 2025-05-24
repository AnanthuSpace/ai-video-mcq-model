import { Model } from "mongoose";
import { IMCQRepository } from "../interfaces/mcq.repository.interface";
import { IMCQ } from "../interfaces/common.interfaces";

export class MCQRepository implements IMCQRepository {
    constructor(private mcqModel: Model<IMCQ>) { }
    
    saveMCQs = async (mcqs: IMCQ[]): Promise<IMCQ[]> => {
        return this.mcqModel.insertMany(mcqs);
    }
}
