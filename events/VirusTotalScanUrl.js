const { default: axios } = require("axios");
const { Events, EmbedBuilder } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;
const WhitelistSchemas = require('../Schemas/WhitelistUrl');
const BlacklistSchemas = require('../Schemas/BlacklistUrl');

const { version } = require('../package.json');

async function blockMessage(message, member, url) {
    if (!message) return;

    try {
        await member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("⛔ ตรวจพบลิ้งค์ที่เป็นอันตราย (Dangerous links detected)")
                    .setDescription(`▶ \`${url}\`\nหากคิดว่าเป็นเรื่องเข้าใจผิดกรุณาส่งเรื่องไปยัง **[DekPua Support](https://discord.com/channels/1213126282921902230/1224718613131563028)**.\n If there must be a misunderstanding, please send the matter to **[DekPua Support](https://discord.com/channels/1213126282921902230/1224718613131563028)**.`)
                    .setTimestamp(message.createdAt)
                    .setFooter({ text: `Security Guard - V${version}` })
            ]
        });
    
        await message.delete();
    } catch (err) { }
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (!message || !process.env.VIRUSTOTAL_API_KEY) return;

        const apiKey = process.env.VIRUSTOTAL_API_KEY;

        var urlRegex = /(https?:\/\/[^\/\s]+(?:\/\S*)?)/g;
        var matches = message.content.match(urlRegex);
        var urlList = matches ? matches : [];

        urlList.forEach(async url => {
            const Blacklist = await BlacklistSchemas.findOne({
                Url: url
            });

            const Whitelist = await WhitelistSchemas.findOne({
                Url: url
            });

            if (Blacklist != null) {
                await blockMessage(message, message.member, url);
            } else if (Whitelist != null) return;
            else {
                const params = new URLSearchParams();
                params.append('url', url);

                await axios.post('https://www.virustotal.com/api/v3/urls', params, {
                    headers: {
                        "X-Apikey": apiKey
                    }
                }).then(async res => {
                    let scaned = false;

                    while (!scaned) {
                        await axios.get(res.data.data.links.self, {
                            headers: {
                                "X-Apikey": apiKey
                            }
                        }).then(async res => {
                            if (res.data.data.attributes.stats.malicious > 1) {
                                const haveInList = await BlacklistSchemas.findOne({
                                    Url: url
                                });

                                if (haveInList == null) await BlacklistSchemas.create({
                                    Url: url,
                                    Type: `Malicious ${res.data.data.attributes.stats.malicious}`
                                });

                                await blockMessage(message, message.member, url);

                                scaned = true;
                            } else if (res.data.data.attributes.stats.malicious > 0 && res.data.data.attributes.stats.malicious <= 1) {
                                const haveInList = await WhitelistSchemas.findOne({
                                    Url: url
                                });

                                if (haveInList == null) await WhitelistSchemas.create({
                                    Url: url,
                                    Type: `Malicious ${res.data.data.attributes.stats.malicious}`
                                });

                                scaned = true;
                            } else if (res.data.data.attributes.stats.malicious == 0 && res.data.data.attributes.stats.harmless != 0) {
                                const haveInList = await WhitelistSchemas.findOne({
                                    Url: url
                                });

                                if (haveInList == null) await WhitelistSchemas.create({
                                    Url: url,
                                    Type: `Malicious ${res.data.data.attributes.stats.malicious}`
                                });

                                scaned = true;
                            } else {
                                console.log("scan not compleat");
                                await wait(5_000);
                            }
                        })
                    }
                })
            }
        });
    }
}