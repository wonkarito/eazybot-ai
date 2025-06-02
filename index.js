const { Client, GatewayIntentBits, Partials } = require('discord.js');
const express = require('express');
const fetch = require('node-fetch');
const rateLimit = require('./utils/rateLimit');
const generateReply = require('./utils/generateReply');
console.log("✅ Módulo generateReply.js cargado correctamente");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
});

const TARGET_CHANNEL_ID_ID = process.env.TARGET_CHANNEL_ID || "1379171544605134919";
const MAX_QUESTIONS_PER_HOUR = 3;

client.once('ready', () => {
    console.log(`🤖 EazyBot AI está en línea como ${client.user.tag}`);
    console.log(`Canal objetivo: ${process.env.TARGET_CHANNEL_ID}`);
    
    // Enviar mensaje automático cuando arranque
    const guilds = client.guilds.cache;
    for (const [guildId, guild] of guilds) {
        const channel = guild.channels.cache.find(c =>
            c.name === process.env.TARGET_CHANNEL_ID && c.isTextBased()
        );
        if (channel) {
            channel.send("🧠 EazyBot AI está activo y listo para ayudarte. Escribe tu pregunta aquí. 🤖");
        }
    }
});

client.on('messageCreate', async message => {
    console.log(`[Recibido] ${message.author.tag}: ${message.content}`);
    
    if (message.author.bot || message.channel.id !== TARGET_CHANNEL_ID) 
    console.log("Canal, diferente a target channel");
    return;

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

// Express para mantener activo el servicio
const app = express();
app.get("/", (_, res) => res.send("EazyBot AI está corriendo."));
app.listen(process.env.PORT || 3000);