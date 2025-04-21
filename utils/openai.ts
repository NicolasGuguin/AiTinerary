import OpenAI from "openai";
import { apiKeys } from "../config/apiKeys.js";

export const openai = new OpenAI({
  apiKey: apiKeys.openai,
});
