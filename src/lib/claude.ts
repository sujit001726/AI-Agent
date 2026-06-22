import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

const apiKey = process.env.ANTHROPIC_API_KEY;
const isDummyKey = !apiKey || apiKey === "YOUR_ANTHROPIC_API_KEY" || apiKey.trim() === "";

// Only initialize client if a real key is present
const client = !isDummyKey ? new Anthropic({ apiKey }) : null;

export const ParsedTaskSchema = z.object({
  location: z.string(),
  category: z.string(),
  maxResults: z.number().int().min(1).max(100),
  sortBy: z.enum(['rating', 'relevance', 'distance']),
});

export type ParsedTask = z.infer<typeof ParsedTaskSchema>;

/**
 * Uses Claude with tool-calling to parse a plain-language instruction
 * into a structured task plan. Falls back to regex if API key is not configured.
 */
export async function parseInstruction(instruction: string): Promise<ParsedTask> {
  if (isDummyKey || !client) {
    console.warn("[Claude] Missing valid ANTHROPIC_API_KEY. Using fallback regex parser.");
    // Fallback regex matching: e.g. "Find the top 50 hotels in Kathmandu, Nepal"
    const match = instruction.match(/find\s+(?:the\s+top\s+)?(\d+)?\s*(.*?)\s+in\s+(.*)/i);
    let maxResults = 50;
    let category = "businesses";
    let location = "unknown location";

    if (match) {
      maxResults = match[1] ? Math.min(parseInt(match[1], 10), 100) : 50;
      category = match[2]?.trim() || category;
      location = match[3]?.trim() || location;
    } else {
      // Very naive fallback if regex fails
      category = instruction;
    }

    return ParsedTaskSchema.parse({
      location,
      category,
      maxResults,
      sortBy: "relevance"
    });
  }

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    tools: [
      {
        name: 'create_lead_search_plan',
        description:
          'Parse a plain-language instruction into a structured lead-generation search plan.',
        input_schema: {
          type: 'object' as const,
          properties: {
            location: {
              type: 'string',
              description: 'The geographic location to search in (e.g. "Kathmandu, Nepal")',
            },
            category: {
              type: 'string',
              description: 'The business category to search for (e.g. "hotels", "restaurants")',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to find (1-100)',
            },
            sortBy: {
              type: 'string',
              enum: ['rating', 'relevance', 'distance'],
              description: 'How to sort the results',
            },
          },
          required: ['location', 'category', 'maxResults', 'sortBy'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'create_lead_search_plan' },
    messages: [
      {
        role: 'user',
        content: `Parse this lead-generation instruction into a structured search plan:\n\n"${instruction}"`,
      },
    ],
  });

  const toolUse = response.content.find((c) => c.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Claude did not return a tool_use response');
  }

  return ParsedTaskSchema.parse(toolUse.input);
}
