import { formatDistanceToNow } from "date-fns";
import type { Conversation, Message, ToolInvocation } from "../types/conversation";

export function relativeTime(date: string | number | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

const now = new Date();

const toolInvocation: ToolInvocation = {
  id: "tool-weather",
  name: "Weather Insights",
  status: "complete",
  startedAt: new Date(now.getTime() - 1000 * 60 * 4).toISOString(),
  finishedAt: new Date(now.getTime() - 1000 * 60 * 4 + 4200).toISOString(),
  output:
    "San Francisco · 72°F · WNW winds 6mph. Fog clears by 11:30am. Suggest light jacket and sunscreen for mid-day stroll.",
};

const marketTool: ToolInvocation = {
  id: "tool-market",
  name: "Market Pulse",
  status: "running",
  startedAt: new Date(now.getTime() - 1000 * 60 * 16).toISOString(),
  output:
    "Collecting benchmark data for consumer AI studios. ETA 12s for sentiment graph overlays.",
};

const summaryTool: ToolInvocation = {
  id: "tool-summary",
  name: "Summary Draft",
  status: "queued",
};

const systemMessage: Message = {
  id: "msg-system",
  role: "system",
  content: "You are ChatGPT, a detail oriented planning assistant who excels at synthesizing context into actionable plans.",
  createdAt: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
};

const assistantMessage: Message = {
  id: "msg-assistant",
  role: "assistant",
  content:
    "Absolutely! Here's a polished itinerary for your creative retreat in Kyoto. I've highlighted must-try cafes, curated workshop slots, and evening wind-down rituals that keep the inspiration flowing.",
  createdAt: new Date(now.getTime() - 1000 * 60 * 7).toISOString(),
  toolInvocations: [toolInvocation],
};

const userMessage: Message = {
  id: "msg-user",
  role: "user",
  content: "Plan a four-day creative writing retreat in Kyoto with daily cafe recommendations, and weave in a tea ceremony experience.",
  createdAt: new Date(now.getTime() - 1000 * 60 * 9).toISOString(),
};

export const seededConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Kyoto creative retreat",
    lastUpdated: assistantMessage.createdAt,
    messages: [systemMessage, userMessage, assistantMessage],
    suggestions: ["Generate packing list", "Share as itinerary", "Book tea ceremony"],
    metrics: {
      latencyMs: 1240,
      toolCount: 1,
      tokens: 912,
    },
  },
  {
    id: "conv-2",
    title: "Portfolio positioning refresh",
    lastUpdated: new Date(now.getTime() - 1000 * 60 * 46).toISOString(),
    messages: [
      {
        id: "msg-2-1",
        role: "user",
        content: "Revise my design portfolio positioning statement to resonate with AI-first product leaders.",
        createdAt: new Date(now.getTime() - 1000 * 60 * 55).toISOString(),
      },
      {
        id: "msg-2-2",
        role: "assistant",
        content:
          "Here's an updated positioning statement that keeps your voice but sharpens the focus on orchestration of AI-first experiences.",
        createdAt: new Date(now.getTime() - 1000 * 60 * 50).toISOString(),
      },
    ],
    suggestions: ["Draft outreach note", "Spin up case study"],
    metrics: {
      latencyMs: 870,
      toolCount: 0,
      tokens: 402,
    },
  },
  {
    id: "conv-3",
    title: "Studio operating cadence",
    lastUpdated: new Date(now.getTime() - 1000 * 60 * 14).toISOString(),
    messages: [
      {
        id: "msg-3-1",
        role: "system",
        content: "You are a chief-of-staff assistant that builds adaptive operating rhythms for creative technology teams.",
        createdAt: new Date(now.getTime() - 1000 * 60 * 40).toISOString(),
      },
      {
        id: "msg-3-2",
        role: "user",
        content:
          "Draft a four-week operating cadence for our studio with rituals for research, build, and narrative shaping.",
        createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: "msg-3-3",
        role: "assistant",
        content:
          "Absolutely. Here's a cadence anchored around Monday narrative kicks, Wednesday build syncs, and Friday story reviews.",
        createdAt: new Date(now.getTime() - 1000 * 60 * 22).toISOString(),
        toolInvocations: [marketTool, summaryTool],
      },
    ],
    suggestions: ["Generate Gantt view", "Publish to Notion", "Share with leadership"],
    metrics: {
      latencyMs: 1580,
      toolCount: 2,
      tokens: 1120,
    },
  },
  {
    id: "conv-4",
    title: "Client onboarding journey",
    lastUpdated: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
    messages: [
      {
        id: "msg-4-1",
        role: "user",
        content: "Outline a 5-step onboarding journey for enterprise clients adopting our AI copilot.",
        createdAt: new Date(now.getTime() - 1000 * 60 * 18).toISOString(),
      },
      {
        id: "msg-4-2",
        role: "assistant",
        content:
          "Here's a journey with kickoff, co-design, enablement, co-pilot deployment, and success measurement checkpoints.",
        createdAt: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
        toolInvocations: [
          {
            id: "tool-journey",
            name: "Journey Mapper",
            status: "complete",
            startedAt: new Date(now.getTime() - 1000 * 60 * 13).toISOString(),
            finishedAt: new Date(now.getTime() - 1000 * 60 * 12 + 2500).toISOString(),
            output:
              "Stage 1: Discover • Stage 2: Align • Stage 3: Launch • Stage 4: Embed • Stage 5: Amplify. Includes KPI suggestions.",
          },
        ],
      },
      {
        id: "msg-4-3",
        role: "assistant",
        content: "Would you like a narrated walkthrough or stakeholder briefing deck next?",
        createdAt: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
      },
    ],
    suggestions: ["Narrate walkthrough", "Draft briefing deck", "Collect feedback"],
    metrics: {
      latencyMs: 940,
      toolCount: 1,
      tokens: 684,
    },
  },
];
