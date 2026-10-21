import "dotenv/config";
import { generateAIResponse } from "./src/services/ai.service.js";

async function main() {
    const answer = await generateAIResponse("Explain Applied AI in two sentences.");

    console.log("AI RESPONSE : ", answer);
}

main().catch(console.error);
