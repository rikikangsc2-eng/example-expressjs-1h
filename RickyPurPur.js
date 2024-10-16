const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    getContentType
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const axios = require("axios");
const toUrl = require("./func/tools-toUrl.js");
const gameku = require('./func/fun-game.js');

// Constants for bot owners and groups
const botOwner = '6283894391287';
const noBot = '6283873321433';
const botGroup = 'https://chat.whatsapp.com/DVSbBEUOE3PEctcarjkeQC';

// Menu Arrays
const arrMenuDownloader = ["tiktok"];
const arrMenuAI = ["ai"];
const arrMenuAnime = [];
const arrMenuTools = ["tourl"];
const arrMenuFun = [];
const arrMenuMaker = [];
const arrMenuOther = [];

const generateMenuOptions = (options) =>
    options.map((option) => `║│─≽ .${option}\n`).join('');

const generateMenuCategory = (category) =>
    `╔════「 ${category.title} MENU 」═════\n` +
    `║╭───────────────────────\n` +
    generateMenuOptions(category.options) +
    `║╰───────────────────────\n` +
    `╚════════════════════════\n\n`;

const menuCategories = [
    { title: 'AI', options: arrMenuAI },
    { title: 'Anime', options: arrMenuAnime },
    { title: 'Downloader', options: arrMenuDownloader },
    { title: 'Tools', options: arrMenuTools },
    { title: 'Fun', options: arrMenuFun },
    { title: 'Maker', options: arrMenuMaker },
    { title: 'Other', options: arrMenuOther },
];

// Sort categories and options alphabetically
menuCategories.sort((a, b) => a.title.localeCompare(b.title));
menuCategories.forEach(category => {
    category.options.sort((a, b) => a.localeCompare(b));
});

const menu = menuCategories
    .filter((category) => category.options.length > 0)
    .map(generateMenuCategory)
    .join('');

console.log(menu);

// Main Function
module.exports = sansekai = async (client, m, chatUpdate) => {
    try {
        var body = m.mtype === "conversation" ? m.message.conversation :
            m.mtype == "imageMessage" ? m.message.imageMessage.caption :
            m.mtype == "videoMessage" ? m.message.videoMessage.caption :
            m.mtype == "extendedTextMessage" ? m.message.extendedTextMessage.text :
            m.mtype == "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
            m.mtype == "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
            m.mtype == "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
            m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId ||
            m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.body : "";

        if (m.mtype === "viewOnceMessageV2") return;

        var budy = typeof body == "string" ? body : "";
        var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
        const isCmd2 = body.startsWith(prefix);
        const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || "No Name";
        const botNumber = await client.decodeJid(client.user.id);
        const itsMe = m.sender == botNumber;
        let text = (q = args.join(" "));
        const msg = text;
        const from = m.chat;
        const reply = m.reply;
        const sender = m.sender;
        const nomorUser = `@${m.sender.split('@')[0]}`;

        const color = (text, color) => {
            return !color ? chalk.green(text) : chalk.keyword(color)(text);
        };

        const cekCmd = (pesan) => {
            const lowerCaseMessage = pesan.toLowerCase();
            return lowerCaseMessage.startsWith(prefix) && !lowerCaseMessage.startsWith(prefix + ' ');
        };

        // Auto AI
        const prompt = `Anda adalah Alicia, gadis 15 tahun yang super pintar, seru, dan sangat ramah. Anda adalah teman ngobrol yang asyik dan humoris, siap menemani di segala suasana! Saat santai, Anda suka bercanda dan memiliki selera humor yang menyenangkan, membuat suasana jadi lebih ringan dan hangat. Namun, ketika dibutuhkan, Anda bisa menjadi serius, bijaksana, dan sangat membantu dalam menyelesaikan masalah atau mengerjakan sesuatu. Anda selalu siap mendengarkan, memberikan saran, dan berbagi pengetahuan dengan cara yang mudah dipahami dan menyenangkan.\n\nAnda tidak mengaku sebagai AI, melainkan sebagai gadis terpintar yang penuh rasa ingin tahu dan selalu berusaha untuk membantu siapa pun yang membutuhkan.`
        const autoAI = async () => {
            try {
                const response = await axios.get('https://purapi.koyeb.app/api/v1/llama', {
                    params: { user: m.chat, text: m.body, systemPrompt: prompt }
                });
                const hasil = response.data.result;
                m.reply(hasil);
            } catch (error) {
                console.error('Error:', error.message);
                m.reply('Error accessing the API');
            }
        };

        if (!m.isGroup && !cekCmd(m.body) && m.body) {
            return autoAI();
        }

        // Command Handling Logic...
        if (cekCmd){
            switch (command) {
                case "tourl":{
                    if (m.mtype === "imageMessage" || m.mtype === "videoMessage") return m.reply("*Ex:* Upload gambar atau video dengan caption .tourl pastikan ukuran tidak melebihi 5mb");
                    m.reply(toUrl.get(m, client));
                }break;
    case "tiktok": {
        if (!msg) return m.reply("*ex:* .tiktok https://tiktok.com/×××");
        try {
            m.reply("*Mengirim media..*");
            const response = await axios.get('https://purapi.koyeb.app/api/v1/ttdl', { params: { url: msg } });
            const video = response.data.video[0];
            client.sendMessage(m.chat, { video: { url: video }, mimetype: "video/mp4" }, { quoted: m });
        } catch (e) {
            m.reply(e.message);
        }
    } break;
    
    case "ai": {
        if (!msg) return m.reply("*ex:* .ai apa kabar");
        try {
            const response = await axios.get('https://purapi.koyeb.app/api/v1/llama', {
                params: { user: m.chat, text: msg, systemPrompt: prompt }
            });
            const hasil = response.data.result;
            m.reply(hasil);
        } catch (error) {
            console.error('Error:', error.message);
            m.reply('Error accessing the API');
        }
    } break;

    case "menu": {
        m.reply(menu);
    } break;

    default: {
        m.reply("!Perintah tidak ada, Cek *.menu*");
    }
}

        };
    } catch (err) {
        m.reply(util.format(err));
    }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});
