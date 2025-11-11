import type { Response } from "express";

import { conversationStore } from "../store/conversationStore";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

export async function streamConversation(res: Response, conversationId: string): Promise<void> {
  res.writeHead(200, SSE_HEADERS);

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  send("stream-start", { conversationId });

  try {
    await conversationStore.simulateStream(conversationId, async (chunk) => {
      send("stream-chunk", chunk);
    });

    send("stream-complete", { conversationId });
  } catch (error) {
    send("stream-error", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    res.end();
  }
}
