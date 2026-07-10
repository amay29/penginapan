"use server";

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generatePromotionalCopy(data: {
  name: string;
  type: string;
  amenities: string[];
}) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "Anthropic API Key is not configured in .env" };
  }

  try {
    const prompt = `
You are an elite, high-end copywriter for a luxury boutique hotel and glamping brand named 'Damar'.
The tone of Damar is: quiet luxury, architectural, poetic, minimalist, exclusive, and grounded in nature. 
Think of brands like Aman Resorts, Six Senses, or Aesop.

Write a 2-3 sentence promotional copy (maximum 50 words) for a new accommodation space with the following details:
- Name: ${data.name}
- Type: ${data.type}
- Amenities: ${data.amenities.join(", ")}

Guidelines:
- Do not use exclamation marks (!). Keep it grounded and calm.
- Do not sound like a cheesy advertisement (e.g. avoid "Come and enjoy our...").
- Focus on the feeling, the architecture, and the intersection with nature.
- Return ONLY the copy text. No preamble, no quotes.
`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Fast and cheap, yet highly capable
      max_tokens: 150,
      temperature: 0.7,
      system: "You are an elite luxury hospitality copywriter. You write in a quiet, poetic, minimalist tone.",
      messages: [{ role: "user", content: prompt }],
    });

    // @ts-ignore
    const text = response.content[0].text;
    
    return { success: true, text };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { error: error.message || "Failed to generate AI copy." };
  }
}
