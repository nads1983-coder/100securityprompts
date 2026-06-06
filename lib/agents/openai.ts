import "server-only";

import { z } from "zod";
import { getEnv } from "@/lib/env";

type JsonSchema = Record<string, unknown>;

export async function runStructuredPrompt<T>({
  name,
  prompt,
  schema,
  fallback,
}: {
  name: string;
  prompt: string;
  schema: z.ZodType<T>;
  fallback: T;
}): Promise<T> {
  const apiKey = getEnv("OPENAI_API_KEY");
  if (!apiKey) return fallback;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name,
            strict: true,
            schema: zodToSimpleJsonSchema(schema),
          },
        },
      }),
    });

    if (!response.ok) {
      console.warn(`OpenAI ${name} failed`, await response.text());
      return fallback;
    }

    const json = await response.json();
    const text = json.output_text ?? json.output?.flatMap((item: { content?: Array<{ text?: string }> }) => item.content ?? []).map((part: { text?: string }) => part.text).join("");
    const parsed = schema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : fallback;
  } catch (error) {
    console.warn(`OpenAI ${name} fallback`, error);
    return fallback;
  }
}

function zodToSimpleJsonSchema(schema: z.ZodType<unknown>): JsonSchema {
  const shape = schema instanceof z.ZodObject ? schema.shape : {};
  return {
    type: "object",
    additionalProperties: false,
    required: Object.keys(shape),
    properties: Object.fromEntries(
      Object.entries(shape).map(([key, value]) => [key, zodFieldToSchema(value as z.ZodTypeAny)]),
    ),
  };
}

function zodFieldToSchema(field: z.ZodTypeAny): JsonSchema {
  if (field instanceof z.ZodString) return { type: "string" };
  if (field instanceof z.ZodNumber) return { type: "number" };
  if (field instanceof z.ZodBoolean) return { type: "boolean" };
  if (field instanceof z.ZodEnum) return { type: "string", enum: field.options };
  if (field instanceof z.ZodArray) return { type: "array", items: zodFieldToSchema(field.element) };
  if (field instanceof z.ZodObject) return zodToSimpleJsonSchema(field);
  return { type: "string" };
}
