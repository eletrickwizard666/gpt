import { Router } from "express";
import { z } from "zod";

import { streamConversation } from "../services/streamService";
import { conversationStore } from "../store/conversationStore";

const createConversationSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
});

const createMessageSchema = z.object({
  role: z.enum(["user", "assistant", "tool"]),
  content: z.string().min(1),
});

export const conversationsRouter = Router();

conversationsRouter.get("/", (_req, res) => {
  res.json({ conversations: conversationStore.list() });
});

conversationsRouter.post("/", (req, res, next) => {
  try {
    const payload = createConversationSchema.parse(req.body ?? {});
    const conversation = conversationStore.create(payload);
    res.status(201).json({ conversation });
  } catch (error) {
    next(error);
  }
});

conversationsRouter.get("/:id", (req, res) => {
  const conversation = conversationStore.get(req.params.id);
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  res.json({ conversation });
});

conversationsRouter.post("/:id/messages", (req, res, next) => {
  try {
    const payload = createMessageSchema.parse(req.body ?? {});
    const message = conversationStore.addMessage(req.params.id, payload);
    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
});

conversationsRouter.get("/:id/stream", async (req, res, next) => {
  try {
    await streamConversation(res, req.params.id);
  } catch (error) {
    next(error);
  }
});
