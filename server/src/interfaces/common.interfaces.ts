import { Document } from "mongoose";

export interface IMCQ extends Document {
    question: string;
    options: string[];
    answer: string;
    timestamp: Date;
}
