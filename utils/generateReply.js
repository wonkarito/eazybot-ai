const fetch = require('node-fetch');

module.exports = async function(userMessage) {
    const prompt = `Eres EazyBot AI, asistente oficial de Eazy RP. Solo puedes responder con base en https://docs.eazyrp.net/normativas. Si no puedes responder, di que abran un ticket. Pregunta: "${userMessage}"`;
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "system", content: prompt }],
                max_tokens: 500
            })
        });
        const data = await response.json();
        return (data.choices?.[0]?.message?.content || "No tengo una respuesta clara. Abre un ticket. 🤖") + " 🤖";
    } catch (err) {
        console.error("Error generando respuesta:", err);
        return "Hubo un error generando la respuesta. Intenta más tarde o abre un ticket. 🤖";
    }
}