import { IMCQ } from "./common.interfaces";

export interface IMCQRepository {
    saveMCQs(mcqs: IMCQ[]): Promise<IMCQ[]>;
}