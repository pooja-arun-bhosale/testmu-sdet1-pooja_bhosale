import dotenv from "dotenv";

dotenv.config();

/**
 * Groq exposes an OpenAI-compatible REST API.
 * We use fetch (no SDK) so the custom reporter bundles reliably in Playwright.
 */
const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export interface ChatCompletionOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
}

interface GroqChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
}

/**
 * Sends a single chat-completion request to Groq and returns the raw text.
 */
export async function chatCompletion(
  options: ChatCompletionOptions,
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is missing. Add it to your .env file before running tests.",
    );
  }

  const response = await fetch(GROQ_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model ?? DEFAULT_MODEL,
      messages: [
        { role: "system", content: options.systemPrompt },
        { role: "user", content: options.userPrompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  const body = (await response.json()) as GroqChatResponse;

  if (!response.ok) {
    throw new Error(
      body.error?.message ??
        `Groq request failed with status ${response.status}`,
    );
  }

  const content = body.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  return content;
}
