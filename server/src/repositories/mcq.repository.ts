import { Model } from "mongoose";
import { IMCQRepository } from "../interfaces/mcq.repository.interface";
import { IMCQ } from "../interfaces/common.interfaces";

export class MCQRepository implements IMCQRepository{
constructor(private mcqRepository: Model<IMCQ>) {}

}
