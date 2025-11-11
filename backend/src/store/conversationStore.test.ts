import { describe, expect, it } from "vitest";

import { ConversationStore } from "./conversationStore";

describe("ConversationStore", () => {
  it("creates a conversation with seeded system message", () => {
    const store = new ConversationStore([]);
    const conversation = store.create({ title: "My Plan" });

    expect(conversation.title).toBe("My Plan");
    expect(conversation.messages[0]?.role).toBe("system");
  });

  it("appends messages and updates lastUpdated", () => {
    const store = new ConversationStore([]);
    const conversation = store.create({ title: "Session" });
    const message = store.addMessage(conversation.id, { role: "user", content: "Hello" });
    const updated = store.get(conversation.id);

    expect(message.content).toBe("Hello");
    expect(updated?.messages).toHaveLength(2);
    expect(updated?.messages.at(-1)?.id).toBe(message.id);
  });

  it("simulates a stream with final chunk flagged", async () => {
    const store = new ConversationStore([]);
    const conversation = store.create({ title: "Streaming" });

    const chunks: string[] = [];
    await store.simulateStream(conversation.id, async (chunk) => {
      chunks.push(chunk.content);
    });

    expect(chunks.at(-1)).toMatch(/compounds\.$/);
  });
});
