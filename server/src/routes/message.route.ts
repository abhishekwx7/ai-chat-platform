import { Router } from "express";
import { createMessageController, getMessagesController } from "../controllers/message.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router({ mergeParams: true });

router.post("/", requireAuth, createMessageController);
router.get("/", requireAuth, getMessagesController);

export default router;