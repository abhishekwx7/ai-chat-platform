import express from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

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

//Health Check
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

export default app;