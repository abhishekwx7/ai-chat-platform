import express from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

import conversationRoutes from "./routes/conversation.routes.js";
import messageRoutes from "./routes/message.route.js";

const app = express();

// Better Auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));


// CORS Configuration
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


// JSON Body Parser
app.use(express.json());

app.use("/api/conversations", conversationRoutes);
app.use("/api/conversations/:conversationId/messages", messageRoutes);

//Health Check
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

export default app;