const { Events, EmbedBuilder, Colors } = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const nsfw = require("nsfwjs");
const axios = require("axios");
const sharp = require("sharp");

const NSFWConfig = require('../configs/NSFWConfig.json');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (!client.nsfwModel) client.nsfwModel = await nsfw.load(NSFWConfig.model);

        const suspectUrl = [];
        const warnUrl = [];

        try {
            await Promise.all(message.attachments.map(async attachment => {
                let buffer = await axios.get(attachment.url, {
                    responseType: "arraybuffer"
                }).then(response => Buffer.from(response.data, 'binary'));

                if (!attachment.contentType.startsWith('image')) return;

                const isJpg = attachment.contentType === 'image/jpeg';

                if (!isJpg) {
                    buffer = await sharp(buffer).toFormat('jpg').toBuffer();
                }

                const img = await loadImage(buffer);

                const offscreenCanvas = createCanvas(img.width, img.height);
                const ctx = offscreenCanvas.getContext('2d');

                ctx.drawImage(img, 0, 0);

                const predictions = await client.nsfwModel.classify(offscreenCanvas);

                const resault = predictions.reduce((acc, { className, probability }) => {
                    acc[className] = Math.floor(probability * 100);
                    return acc;
                }, {});

                console.log(resault);
                
                if (resault.Porn >= 50 || resault.Hentai >= 50) { // Dangerous
                    suspectUrl.push(attachment.url);
                } else if (resault.Porn >= 30 || resault.Hentai >= 30) { // Warning
                    warnUrl.push(attachment.url);
                }
            }));
        } catch (err) {
            console.log("Error while Checking is NSFW");
        }

        if (suspectUrl.length > 0) {
            try {
                if (message) await message.delete();

                await message.member.timeout(3 * 60 * 1000, "ตรวจพบเนื้อหาที่ไม่เหมาะสม | NSFW Detector");

                await message.member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Red)
                            .setTitle("🚫 ตรวจพบเนื้อหาที่ไม่เหมาะสม")
                            .setDescription(`\nหากคิดว่าเป็นเรื่องเข้าใจผิดกรุณาส่งเรื่องไปยัง **[DekPua Support](https://discord.com/channels/1213126282921902230/1224718613131563028)**.\n If there must be a misunderstanding, please send the matter to **[DekPua Support](https://discord.com/channels/1213126282921902230/1224718613131563028)**.`)
                            .addFields(
                                {
                                    name: "แนบไฟล์",
                                    value: `${suspectUrl.join(" , ")}`
                                },
                                {
                                    name: "ช่อง",
                                    value: `${message.channel.url}`
                                }
                            )
                            .setTimestamp()
                            .setFooter({ text: "NSFW Detector" })
                    ]
                });
            } catch (err) {
                console.log("Error while Taking NSFW Action");
            }
        }

        if (warnUrl.length > 0) {
            try {
                await message.member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Yellow)
                            .setTitle("⚠️ ตรวจพบเนื้อหาที่สงสัยว่าไม่เหมาะสม")
                            .setDescription(`\nหากคิดว่าเป็นเรื่องเข้าใจผิดกรุณาส่งเรื่องไปยัง **[DekPua Support](https://discord.com/channels/1213126282921902230/1224718613131563028)**.\n If there must be a misunderstanding, please send the matter to **[DekPua Support](https://discord.com/channels/1213126282921902230/1224718613131563028)**.`)
                            .addFields(
                                {
                                    name: "แนบไฟล์",
                                    value: `${warnUrl.join(" , ")}`
                                },
                                {
                                    name: "ช่อง",
                                    value: `${message.channel.url}`
                                }
                            )
                            .setTimestamp()
                            .setFooter({ text: "NSFW Detector" })
                    ]
                });
            } catch (err) {
                console.log("Error while Taking NSFW Action");
            }
        }
    }
};
