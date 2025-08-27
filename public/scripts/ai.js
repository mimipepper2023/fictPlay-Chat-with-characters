const AI = (() => {
  async function summarizeWithTensor(text) {
    if (!window.tf) return null;
    // Placeholder: use a trivial tensor op as a stub
    const encoded = Array.from(text).map(c => c.charCodeAt(0) % 97 / 26);
    const t = tf.tensor(encoded);
    const mean = t.mean().dataSync()[0];
    t.dispose();
    return mean.toFixed(3);
  }

  async function callGPT(messages, systemPrompt) {
    const key = (window.FICTPLAY_CONFIG || {}).OPENAI_API_KEY;
    if (!key) {
      return { role: "bot", content: "[GPT stub] Provide an API key via config.js or implement server proxy." };
    }
    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            systemPrompt ? { role: "system", content: systemPrompt } : null,
            ...messages
          ].filter(Boolean),
          temperature: 0.8,
        })
      });
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content || "[No response]";
      return { role: "bot", content };
    } catch (e) {
      return { role: "bot", content: `[Error calling GPT] ${e.message}` };
    }
  }

  function buildSystemPrompt(bot) {
    const extras = bot.extras ? JSON.stringify(bot.extras) : "{}";
    return `You are ${bot.name}. Embody the given personality.
Description: ${bot.description || ""}
Personality: ${bot.personality || ""}
Extras: ${extras}
Stay in-character. Perceive attachments via provided URLs and react naturally.`;
  }

  return { summarizeWithTensor, callGPT, buildSystemPrompt };
})();
