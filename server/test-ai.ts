import "dotenv/config";
import { generateAIResponse } from "./src/services/ai.service.js";

async function main() {
    const answer = await generateAIResponse({});

    console.log("AI RESPONSE : ", answer);
}

main().catch(console.error);
