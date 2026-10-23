import { Router } from "express";
import { createMessageController, getMessagesController, streamMessageController } from "../controllers/message.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router({ mergeParams: true });

router.post("/", requireAuth, createMessageController);
router.get("/", requireAuth, getMessagesController);
router.post("/stream", requireAuth, streamMessageController);

export default router;