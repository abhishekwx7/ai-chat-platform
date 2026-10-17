import express from "express"
import cors from "cors"

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "AI Chat API is running!",
    });
});

export default app;