const fetch = require('node-fetch');

module.exports = async function(userMessage) {
    console.log("🧠 Simulando respuesta para:", userMessage);

    return "🧠 Esta es una respuesta simulada. Todo funciona bien, solo falta conectar OpenAI. 🤖";
};


