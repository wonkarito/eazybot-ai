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
    const isTiendaQuestion = [
        "vip", "donación", "donar", "pagar", "precio", "comprar", "beneficios",
        "artículos exclusivos", "paquetes", "membresía", "ventajas"
    ].some(kw => lowerQuestion.includes(kw));
    const isStaffQuestion = [
        "staff", "administrador", "moderador", "equipo de trabajo", "quiero ayudar", "cómo ser staff"
    ].some(kw => lowerQuestion.includes(kw));
    const isBanQuestion = [
        "ban", "baneado", "me banearon", "cómo apelar"
    ].some(kw => lowerQuestion.includes(kw));
    const isStreamerQuestion = [
        "streamer", "directo", "crear contenido", "partner", "afiliado", "twitch", "youtube", "kick"
    ].some(kw => lowerQuestion.includes(kw));
    const isBugReport = [
        "bug", "error", "fallo", "crashea", "no carga"
    ].some(kw => lowerQuestion.includes(kw));
    const isWhitelistQuestion = [
        "whitelist", "acceso", "no puedo entrar", "me saca del servidor"
    ].some(kw => lowerQuestion.includes(kw));
    const isHouseQuestion = [
        "casa", "comprar casa", "alquilar", "propiedad", "propiedades"
    ].some(kw => lowerQuestion.includes(kw));

    // Respuestas automáticas para temas específicos
    if (isEazyCoinsQuestion) {
        return "💰 Puedes usar tus EazyCoins para comprar autos VIP, aeronaves, barcos, islas privadas y más artículos exclusivos que iremos añadiendo. 🤖";
    }

    if (isEazyPassQuestion) {
        return "🎁 El Eazy Pass es un pase de temporada gratuito que te permite obtener ítems y artículos exclusivos con puntos de recompensa. Estos puntos los consigues por horas de juego. 🤖";
    }

    if (isTiendaQuestion) {
        return "🛒 En Eazy RP puedes apoyar el servidor y acceder a beneficios como vehículos VIP, packs de inicio, armas, casas o incluso islas privadas. Los artículos se entregan automáticamente tras la compra. Si tienes dudas, abre un ticket en Discord. 🤖";
    }

    if (isStaffQuestion) {
        return "📋 Si deseas postularte para ser parte del staff, abre un ticket en Discord indicando tu interés y envía tus datos. El equipo evaluará tu solicitud y se reserva el derecho de admisión al equipo de trabajo. 🤖";
    }

    if (isBanQuestion) {
        return "🚫 Si fuiste sancionado y deseas apelar, abre un ticket explicando tu caso. Solo el staff tiene acceso a esa información. 🤖";
    }

    if (isStreamerQuestion) {
        return "🎥 Si haces directos en Twitch, YouTube o Kick y quieres unirte al programa de creadores de contenido de Eazy RP, abre un ticket seleccionando la opción 'Postulaciones Streamer'. 🤖";
    }

    if (isBugReport) {
        return "🐞 Si encontraste un bug, intenta primero reiniciar el juego. Si el problema continúa, abre un ticket explicando el error y adjunta captura o video si es posible. Si el error ocurre durante la creación del personaje, te recomendamos reinstalar FiveM o borrar el caché. Busca en YouTube el video: 'Cómo borrar el caché de FiveM - Tutorial' (autor: Zeref) para seguir los pasos. 🤖";
    }

    if (isWhitelistQuestion) {
        return "✅ Si tu acceso fue rechazado o necesitas reactivación de whitelist, abre un ticket indicando tu nombre en Discord y Steam, junto con el motivo (si lo conoces). 🤖";
    }

    if (isHouseQuestion) {
        return "🏠 Para comprar o alquilar una casa en el servidor, revisa el mapa. Algunas propiedades están disponibles directamente, otras requieren aprobación del staff. Si quieres una personalizada, abre un ticket. 🤖";
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
