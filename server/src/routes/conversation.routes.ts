
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    createConversationController,
    getConversationsController,
} from "../controllers/conversation.controller.js";

const router = Router();

router.post("/", requireAuth, createConversationController);
router.get("/", requireAuth, getConversationsController);

export default router;
