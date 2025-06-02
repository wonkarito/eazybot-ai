const fetch = require('node-fetch');

module.exports = async function(userMessage) {
    console.log("🧠 Enviando pregunta a OpenAI:", userMessage);

    const systemPrompt = "Eres EazyBot AI, el asistente oficial del servidor de rol Eazy RP. Solo puedes responder con base en https://docs.eazyrp.net/normativas. Si no puedes ayudar, sugiere abrir un ticket.";

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("❌ Error desde OpenAI:", data.error);
            return "❌ Hubo un error consultando a OpenAI. Intenta más tarde o abre un ticket. 🤖";
        }

        const reply = data.choices?.[0]?.message?.content;
        return (reply || "No tengo una respuesta clara. Abre un ticket. 🤖") + " 🤖";

    } catch (err) {
        console.error("❌ Error generando respuesta:", err);
        return "❌ Ocurrió un error inesperado. Intenta más tarde o abre un ticket. 🤖";
    }
};