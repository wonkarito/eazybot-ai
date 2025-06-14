const { Client, GatewayIntentBits, Partials } = require('discord.js');
const express = require('express');
const fetch = require('node-fetch');
const rateLimit = require('./utils/rateLimit');
const generateReply = require('./utils/generateReply-openai');
console.log("✅ Módulo generateReply.js cargado correctamente");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
});

const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID || "1379171544605134919";
const MAX_QUESTIONS_PER_HOUR = 3;

client.once('ready', () => {
    console.log(`🤖 EazyBot AI está en línea como ${client.user.tag}`);
    console.log(`Canal objetivo: ${TARGET_CHANNEL_ID}`);

    const guilds = client.guilds.cache;
    for (const [guildId, guild] of guilds) {
        const channel = guild.channels.cache.get(TARGET_CHANNEL_ID);
        if (channel && channel.isTextBased()) {
            channel.send("🧠 EazyBot AI está activo y listo para ayudarte. Escribe tu pregunta aquí. 🤖");
        }
    }
});
client.removeAllListeners('messageCreate');
client.on('messageCreate', async message => {
    console.log(`Mensaje recibido de: ${message.author.tag} - ${message.author.id}`);
    console.log("¿Soy yo?", message.author.id === client.user.id);

    // 🧼 Ignorar mensajes del bot, hilos, embeds y otros canales inesperados
    if (
        message.author.id === client.user.id ||
        message.author.bot ||
        message.channel.id.toString() !== TARGET_CHANNEL_ID.toString() ||
        message.type !== 0 // solo mensajes "default", no respuestas embebidas o edits
    ) return;

    const userId = message.author.id;
    const userMessage = message.content;

    if (!rateLimit.allow(userId)) {
        return message.reply("Has alcanzado el límite de 3 preguntas por hora. Intenta más tarde. ⏳");
    }

    const reply = await generateReply(userMessage);
    console.log("📝 Respondiendo al usuario:", userId);
    message.reply(reply);
});


client.login(process.env.DISCORD_TOKEN);
console.log("Total de listeners para messageCreate:", client.listenerCount('messageCreate'));


// Express para mantener activo el servicio
const app = express();
app.get("/", (_, res) => res.send("EazyBot AI está corriendo."));
app.listen(process.env.PORT || 3000);