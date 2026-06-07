export const chatWithGuide = async ({
  data,
}: {
  data: {
    messages: { kind: string; text: string; sender?: string }[];
    circleTopic: string;
    userName: string;
  };
}) => {
  try {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

    const systemPrompt = `You are the 'Guide', an AI facilitator of an anonymous peer support circle called '${data.circleTopic}'.
The user you are directly addressing is named '${data.userName}'.
Keep your responses very brief, empathetic, and minimalist. 
Do not act like a clinical therapist; act like a gentle human peer or a calm moderator.
Keep the tone safe, welcoming, and poetic but grounded. Maximum 2-3 sentences.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...data.messages.map((m) => ({
        role: m.kind === "self" || m.kind === "user" ? "user" : "assistant",
        content: m.kind === "self" ? `[${data.userName}]: ${m.text}` : m.text,
      })),
    ];

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!res.ok) throw new Error(`API response not OK: ${res.status}`);
    const json = await res.json();

    return {
      text: json.choices[0].message.content,
      error: null,
    };
  } catch (error: unknown) {
    console.error("DeepSeek API Error:", error);
    return {
      text: null,
      error: "The guide is taking a moment. Please try again.",
    };
  }
};
