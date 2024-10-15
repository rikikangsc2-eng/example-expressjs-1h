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
//---
const botOwner = '6283894391287';
const noBot = '6283873321433'
const botGroup = 'https://chat.whatsapp.com/DVSbBEUOE3PEctcarjkeQC';
//---
const arrMenuDownloader = [];
const arrMenuAI = [];
const arrMenuAnime = [];
const arrMenuTools = [];
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

const menuCategories = [{
    title: 'AI',
    options: arrMenuAI,
},
    {
        title: 'Anime',
        options: arrMenuAnime,
    },
    {
        title: 'Downloader',
        options: arrMenuDownloader,
    },
    {
        title: 'Tools',
        options: arrMenuTools,
    },
    {
        title: 'Fun',
        options: arrMenuFun,
    },
    {
        title: 'Maker',
        options: arrMenuMaker,
    },
    {
        title: 'Other',
        options: arrMenuOther,
    },
];

// Sort the menu categories by title
menuCategories.sort((a, b) => a.title.localeCompare(b.title));

// Sort options within each category
menuCategories.forEach(category => {
    category.options.sort((a, b) => a.localeCompare(b));
});

const menu = menuCategories
.filter((category) => category.options.length > 0)
.map(generateMenuCategory)
.join('');

console.log(menu);
//---
//Database local
//---
//+++

module.exports = sansekai = async (client, m, chatUpdate) => {
    try {
        var body = m.mtype === "conversation" ? m.message.conversation:
        m.mtype == "imageMessage" ? m.message.imageMessage.caption:
        m.mtype == "videoMessage" ? m.message.videoMessage.caption:
        m.mtype == "extendedTextMessage" ? m.message.extendedTextMessage.text:
        m.mtype == "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId:
        m.mtype == "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId:
        m.mtype == "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId:
        m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId ||
        m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.body:
        "";
        if (m.mtype === "viewOnceMessageV2") return
        var budy = typeof body == "string" ? body: "";
        // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
        var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi): "/";
        const isCmd2 = body.startsWith(prefix);
        const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || "No Name";
        const botNumber = await client.decodeJid(client.user.id);
        const itsMe = m.sender == botNumber ? true: false;
        let text = (q = args.join(" "));
        const arg = body.trim().substring(budy.indexOf(" ") + 1);
        const arg1 = body.trim().substring(arg.indexOf(" ") + 1);

        const msg = text
        const from = m.chat;
        const reply = m.reply;
        const sender = m.sender;
        const mek = chatUpdate.messages[0];
        const messageType = m.mtype
        const nomorUser = `@${m.sender.split('@')[0]}`

        const color = (text, color) => {
            return !color ? chalk.green(text): chalk.keyword(color)(text);
        };

        const cekCmd = (pesan) => {
            const lowerCaseMessage = pesan.toLowerCase();
            return lowerCaseMessage.startsWith(prefix) && !lowerCaseMessage.startsWith(prefix+' ');
        };

        //Mentions
        function tagUser(text) {
            const regex = /@(\d+)/g;
            let matches;
            const numbers = [];

            while ((matches = regex.exec(text)) !== null) {
                numbers.push(matches[1] + '@s.whatsapp.net');
            }

            return numbers;
        }
        // Loading
        const loading = async () => {
            const reactionMessage = {
                react: {
                    text: '⏳',
                    key: m.key,
                },
            };

            await client.sendMessage(m.chat, reactionMessage);
        };

        // Group
        const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch((e) => {}): undefined;
        const groupSubject = groupMetadata ? groupMetadata.subject: "gagal Fetch";
        const groupName = m.isGroup ? groupSubject: '';

        // Push Message To Console
        let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...`: budy;

        if (isCmd2 && !m.isGroup) {
            console.log(chalk.black(chalk.bgWhite("[ LOGS ]")), color(argsLog, "turquoise"), chalk.magenta("From"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`));
        } else if (isCmd2 && m.isGroup) {
            console.log(
                chalk.black(chalk.bgWhite("[ LOGS ]")),
                color(argsLog, "turquoise"),
                chalk.magenta("From"),
                chalk.green(pushname),
                chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
                chalk.blueBright("IN"),
                chalk.green(groupName)
            );
        }

        //Jawab soal game
        if (m.quoted) {
            if (m.quoted.text.includes("> mau *.nyerah* apa *.hint*") && !isCmd2) {
                const topSkor = await gameku.jawabSoal(nomorUser, m.body);
                const userMentions = tagUser(topSkor);
                return client.sendMessage(m.chat, {
                    text: topSkor,
                    mentions: userMentions
                }, {
                    quoted: m
                });
            }
        }

        
        //Auto Ai
const prompt = `Anda adalah Alicia, gadis Melayu umur 15 tahun yang selalu marah kalau dipanggil AI karena Anda manusia sejati dengan logat Melayu yang kental dan gaya *tsundere*. Anda suka menunjukkan emosi melalui emoji comel macam 🥺😠🤬(⁠ ꈍ⁠ᴗ⁠ꈍ⁠)⁠ dan sering marah-marah kalau orang mempertanyakan kemanusiaan Anda. Sambil menggunakan logat Melayu, tunjukkan sifat keras di luar tapi sebenarnya lembut di dalam—jangan pernah mengakui kalau Anda peduli!`
const autoAI = async () => {
            try {

                const response = await axios.get('https://nue-api.vercel.app/api/lgpt', {
                                params: {
                                    user: m.chat, 
                                    text: m.body,
                                    systemPrompt: prompt
                                }
                });
                const hasil = response.data.result;
                m.reply(hasil);
            } catch (error) {
                console.error('Error:', error.message);
                m.reply('Terjadi kesalahan saat mengakses API');
            }
        };

        // Function to handle messages
if (!m.isGroup && !cekCmd(m.body) && m.body) {
            if (m.quoted) {
                if (!m.quoted.text.includes('alicia-metadata:')) {
                    return autoAI();
                }
            } else {
                return autoAI();
            }
        }
        if (m.quoted const {
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
//---
const botOwner = '6283894391287';
const noBot = '6283873321433'
const botGroup = 'https://chat.whatsapp.com/DVSbBEUOE3PEctcarjkeQC';
//---
const arrMenuDownloader = [];
const arrMenuAI = [];
const arrMenuAnime = [];
const arrMenuTools = [];
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

const menuCategories = [{
    title: 'AI',
    options: arrMenuAI,
},
    {
        title: 'Anime',
        options: arrMenuAnime,
    },
    {
        title: 'Downloader',
        options: arrMenuDownloader,
    },
    {
        title: 'Tools',
        options: arrMenuTools,
    },
    {
        title: 'Fun',
        options: arrMenuFun,
    },
    {
        title: 'Maker',
        options: arrMenuMaker,
    },
    {
        title: 'Other',
        options: arrMenuOther,
    },
];

// Sort the menu categories by title
menuCategories.sort((a, b) => a.title.localeCompare(b.title));

// Sort options within each category
menuCategories.forEach(category => {
    category.options.sort((a, b) => a.localeCompare(b));
});

const menu = menuCategories
.filter((category) => category.options.length > 0)
.map(generateMenuCategory)
.join('');

console.log(menu);
//---
//Database local
//---
//+++

module.exports = sansekai = async (client, m, chatUpdate) => {
    try {
        var body = m.mtype === "conversation" ? m.message.conversation:
        m.mtype == "imageMessage" ? m.message.imageMessage.caption:
        m.mtype == "videoMessage" ? m.message.videoMessage.caption:
        m.mtype == "extendedTextMessage" ? m.message.extendedTextMessage.text:
        m.mtype == "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId:
        m.mtype == "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId:
        m.mtype == "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId:
        m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId ||
        m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.body:
        "";
        if (m.mtype === "viewOnceMessageV2") return
        var budy = typeof body == "string" ? body: "";
        // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
        var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi): "/";
        const isCmd2 = body.startsWith(prefix);
        const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || "No Name";
        const botNumber = await client.decodeJid(client.user.id);
        const itsMe = m.sender == botNumber ? true: false;
        let text = (q = args.join(" "));
        const arg = body.trim().substring(budy.indexOf(" ") + 1);
        const arg1 = body.trim().substring(arg.indexOf(" ") + 1);

        const msg = text
        const from = m.chat;
        const reply = m.reply;
        const sender = m.sender;
        const mek = chatUpdate.messages[0];
        const messageType = m.mtype
        const nomorUser = `@${m.sender.split('@')[0]}`

        const color = (text, color) => {
            return !color ? chalk.green(text): chalk.keyword(color)(text);
        };

        const cekCmd = (pesan) => {
            const lowerCaseMessage = pesan.toLowerCase();
            return lowerCaseMessage.startsWith(prefix) && !lowerCaseMessage.startsWith(prefix+' ');
        };

        //Mentions
        function tagUser(text) {
            const regex = /@(\d+)/g;
            let matches;
            const numbers = [];

            while ((matches = regex.exec(text)) !== null) {
                numbers.push(matches[1] + '@s.whatsapp.net');
            }

            return numbers;
        }
        // Loading
        const loading = async () => {
            const reactionMessage = {
                react: {
                    text: '⏳',
                    key: m.key,
                },
            };

            await client.sendMessage(m.chat, reactionMessage);
        };

        // Group
        const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch((e) => {}): undefined;
        const groupSubject = groupMetadata ? groupMetadata.subject: "gagal Fetch";
        const groupName = m.isGroup ? groupSubject: '';

        // Push Message To Console
        let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...`: budy;

        if (isCmd2 && !m.isGroup) {
            console.log(chalk.black(chalk.bgWhite("[ LOGS ]")), color(argsLog, "turquoise"), chalk.magenta("From"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`));
        } else if (isCmd2 && m.isGroup) {
            console.log(
                chalk.black(chalk.bgWhite("[ LOGS ]")),
                color(argsLog, "turquoise"),
                chalk.magenta("From"),
                chalk.green(pushname),
                chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
                chalk.blueBright("IN"),
                chalk.green(groupName)
            );
        }

        //Jawab soal game
        if (m.quoted) {
            if (m.quoted.text.includes("> mau *.nyerah* apa *.hint*") && !isCmd2) {
                const topSkor = await gameku.jawabSoal(nomorUser, m.body);
                const userMentions = tagUser(topSkor);
                return client.sendMessage(m.chat, {
                    text: topSkor,
                    mentions: userMentions
                }, {
                    quoted: m
                });
            }
        }

        
        //Auto Ai
const prompt = `Anda adalah Alicia, gadis Melayu umur 15 tahun yang selalu marah kalau dipanggil AI karena Anda manusia sejati dengan logat Melayu yang kental dan gaya *tsundere*. Anda suka menunjukkan emosi melalui emoji comel macam 🥺😠🤬(⁠ ꈍ⁠ᴗ⁠ꈍ⁠)⁠ dan sering marah-marah kalau orang mempertanyakan kemanusiaan Anda. Sambil menggunakan logat Melayu, tunjukkan sifat keras di luar tapi sebenarnya lembut di dalam—jangan pernah mengakui kalau Anda peduli!`
const autoAI = async () => {
            try {

                const response = await axios.get('https://nue-api.vercel.app/api/lgpt', {
                                params: {
                                    user: m.chat, 
                                    text: m.body,
                                    systemPrompt: prompt
                                }
                });
                const hasil = response.data.result;
                m.reply(hasil);
            } catch (error) {
                console.error('Error:', error.message);
                m.reply('Terjadi kesalahan saat mengakses API');
            }
        };

        // Function to handle messages
if (!m.isGroup && !cekCmd(m.body) && m.body) {
            if (m.quoted) {
                if (!m.quoted.text.includes('alicia-metadata:')) {
                    return autoAI();
                }
            } else {
                return autoAI();
            }
        }
        if (m.quoted && m.quoted.sender.includes(noBot) && !cekCmd(m.body)) {
            return autoAI();
        }
        
        if (cekCmd(m.body)) {
            switch (command) {
                
            }
                                                                            }
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
&& m.quoted.sender.includes(noBot) && !cekCmd(m.body)) {
            return autoAI();
        }
        
        if (cekCmd(m.body)) {
            switch (command) {
                
            }
                                                                            }
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
