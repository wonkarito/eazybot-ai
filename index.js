//require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const express = require('express');
const fetch = require('node-fetch');
const rateLimit = require('./utils/rateLimit');
const generateReply = require('./utils/generateReply');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
});

const TARGET_CHANNEL = process.env.TARGET_CHANNEL || "eazybot-ai";
const MAX_QUESTIONS_PER_HOUR = 3;

client.once('ready', () => {
    console.log(`🤖 EazyBot AI está en línea como ${client.user.tag}`);
    console.log(`Canal objetivo: ${process.env.TARGET_CHANNEL}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot || message.channel.name !== TARGET_CHANNEL) return;
    const userId = message.author.id;
    const userMessage = message.content;

    if (!rateLimit.allow(userId)) {
        return message.reply("Has alcanzado el límite de 3 preguntas por hora. Intenta más tarde. ⏳");
    }

    const reply = await generateReply(userMessage);
    message.reply(reply);
});

client.login(process.env.DISCORD_TOKEN);

// Express para mantener activo el servicio
const app = express();
app.get("/", (_, res) => res.send("EazyBot AI está corriendo."));
app.listen(process.env.PORT || 3000);