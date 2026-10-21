
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
    createConversationController,
    deleteConversationController,
    getConversationByIdController,
    getConversationsController,
    updateConversationController,
} from "../controllers/conversation.controller.js";



const router = Router();

router.post("/", requireAuth, createConversationController);
router.get("/", requireAuth, getConversationsController);
router.get("/:id", requireAuth, getConversationByIdController);
router.patch("/:id", requireAuth, updateConversationController);
router.delete("/:id", requireAuth, deleteConversationController);


export default router;
