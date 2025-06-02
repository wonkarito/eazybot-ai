module.exports = async function(userMessage) {
    console.log("🧠 Simulando respuesta para:", userMessage);

    try {
        return "🧠 Esta es una respuesta simulada. Todo funciona bien, solo falta conectar OpenAI. 🤖";
    } catch (err) {
        console.error("❌ Error interno inesperado:", err);
        return "❌ Error inesperado. 🤖";
    }
};