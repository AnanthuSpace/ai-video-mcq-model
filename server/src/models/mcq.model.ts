import mongoose, { Schema } from "mongoose";
import { IMCQ } from "../interfaces/common.interfaces";

const mcqSchema: Schema = new Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const MCQModel = mongoose.model<IMCQ>("MCQ", mcqSchema);
