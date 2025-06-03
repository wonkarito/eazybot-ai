const fetch = require('node-fetch');

module.exports = async function(userMessage) {
    console.log("🧠 Enviando pregunta a OpenAI:", userMessage);

    const lowerQuestion = userMessage.toLowerCase();

    const factionKeywords = [
        "banda", "facción", "organización", "cartel", "criminal", "mafia",
        "grupo", "ems", "lspd", "bahama", "mecánicos", "taller", "club",
        "hospital", "policía", "doctor", "gobierno", "lider", "unirme", "trabajo"
    ];

    const hasFactionKeyword = factionKeywords.some(kw => lowerQuestion.includes(kw));
    const isEazyCoinsQuestion = lowerQuestion.includes("eazy coins") || lowerQuestion.includes("eazycoins") || lowerQuestion.includes("comprar con eazy");
    const isEazyPassQuestion = lowerQuestion.includes("eazy pass") || lowerQuestion.includes("pase de temporada");

    // Respuestas automáticas para temas específicos
    if (isEazyCoinsQuestion) {
        return "💰 Puedes usar tus EazyCoins para comprar autos VIP, aeronaves, barcos, islas privadas y más artículos exclusivos que iremos añadiendo. 🤖";
    }

    if (isEazyPassQuestion) {
        return "🎁 El Eazy Pass es un pase de temporada gratuito que te permite obtener ítems y artículos exclusivos con puntos de recompensa. Estos puntos los consigues por horas de juego. 🤖";
    }

    const systemPrompt = hasFactionKeyword
        ? "Eres EazyBot AI, el asistente del servidor Eazy RP. Puedes responder preguntas sobre las facciones legales e ilegales del servidor, incluyendo roles, jerarquías, requisitos para unirse, responsabilidades, nombres de líderes si están disponibles públicamente y cómo interactúan con el rol. Si no sabes la respuesta exacta, sugiere abrir un ticket para más información."
        : "Eres EazyBot AI, el asistente oficial del servidor de rol Eazy RP. Solo puedes responder con base en https://docs.eazyrp.net/normativas. Si no puedes ayudar, sugiere abrir un ticket.";

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
