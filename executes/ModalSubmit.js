const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const AccountSchema = require('../Schemas/Account');
const OtpSchema = require('../Schemas/Otp');

const roles = require('../configs/Roles.json');
const OtpStatusType = require('../configs/OtpStatus.json');

const langs = {
    "th": {
        "ban": "แบน",
        "ban-message": "แบนข้อความ",
        "ban-voice": "แบนเสียง",
        "alert": "ตักเตือน",
        "timeout": "หมดเวลา",
        "do-nothing": "ไม่ต้องทำอะไร",
        "report.user": "รายงานผู้ใช้",
        "thank_for_report": "ขอบคุณที่รายงานปัญหาให้พวกเรา เราจะนำปัญหาของท่านไปปรับปรุงระบบต่อไป!",
        "report": "รายงาน"
    },
    "en-us": {
        "ban": "Ban",
        "ban-message": "Ban Message",
        "ban-voice": "Ban Voice",
        "alert": "Alert",
        "timeout": "Timeout",
        "do-nothing": "Do nothing",
        "report.user": "Report User",
        "thank_for_report": "Thank you for reporting the issue to us. We will take your concerns into consideration for future improvements!",
        "report": "Report"
    }
}

module.exports = async (interaction, client) => {
    const lang = langs[interaction.locale] ?? langs["en-us"];

    if (interaction.customId.startsWith('report_system_user')) {
        const reportedChannel = await client.channels.fetch('1214489941090897930');

        if (!reportedChannel) return await interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle('🚫 ไม่สามารถแจ้งปัญหาได้ กรุณาลองอีกครั้งภายหลัง!').setTimestamp(Date.now())], ephemeral: true });

        const select = new StringSelectMenuBuilder()
            .setCustomId(`admin_panel_action_reported_${interaction.customId.slice(19)}`)
            .setPlaceholder('Make Action')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(lang['ban'])
                    .setDescription('แบนผู้ใช้คนนั้น')
                    .setValue('ban')
                    .setEmoji('🚫'),
                new StringSelectMenuOptionBuilder()
                    .setLabel(lang['timeout'])
                    .setDescription('กำหนด')
                    .setValue('timeout')
                    .setEmoji('⌛'),
                new StringSelectMenuOptionBuilder()
                    .setLabel(lang['alert'])
                    .setDescription('ส่งข้อความไปยังผู้ใช้นั้นเพื่อแจ้งเตือนเขา')
                    .setValue('send-message')
                    .setEmoji('✉️'),
                new StringSelectMenuOptionBuilder()
                    .setLabel(lang['do-nothing'])
                    .setDescription('ละเว้นรายงานนี้')
                    .setValue('do-noting')
                    .setEmoji('✅')
            );

        const row = new ActionRowBuilder().addComponents(select);

        await reportedChannel.send({
            content: "<@&1213126421875269652> <@&1213126482730291291>",
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setTitle(`❗ ${lang["report.user"]}`)
                    .setDescription(`รายงาน <@${interaction.customId.slice(19)}>\nรายงานโดย <@${interaction.member.id}> | <t:${Date.now().toString().slice(0, -3)}:R>\n\`\`\`${interaction.fields.getTextInputValue('report_system_user_detail')}\`\`\``)
                    .setTimestamp(Date.now())
            ],
            components: [row],
        });

        await interaction.reply({
            content: lang["thank_for_report"],
            ephemeral: true
        });
    } else if (interaction.customId.startsWith('report_system_message')) {
        const reportedChannel = await client.channels.fetch('1214489941090897930');

        if (!reportedChannel) return await interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle('🚫 ไม่สามารถแจ้งปัญหาได้ กรุณาลองอีกครั้งภายหลัง!').setTimestamp(Date.now())], ephemeral: true });

        const parts = interaction.customId.split('_');

        // Extract the guild, channel, and message IDs
        const channelId = parts.slice(-3)[0];
        const messageId = parts.slice(-2)[0];

        const channel = await client.channels.fetch(channelId);

        // Construct the Discord URL
        const url = `https://discord.com/channels/${channel.guild.id}/${channelId}/${messageId}`;

        const select = new StringSelectMenuBuilder()
            .setCustomId(`admin_panel_action_reported_${interaction.customId.slice(22)}`)
            .setPlaceholder('Make Action')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('แบน')
                    .setDescription('แบนผู้ใช้คนนั้น')
                    .setValue('ban')
                    .setEmoji('🚫'),
                new StringSelectMenuOptionBuilder()
                    .setLabel(lang['timeout'])
                    .setDescription('กำหนด')
                    .setValue('timeout')
                    .setEmoji('⌛'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('ตักเตือน')
                    .setDescription('ส่งข้อความไปยังผู้ใช้นั้นเพื่อแจ้งเตือนเขา')
                    .setValue('send-message')
                    .setEmoji('✉️'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('ไม่ต้องทำอะไร')
                    .setDescription('ละเว้นรายงานนี้')
                    .setValue('do-noting')
                    .setEmoji('✅')
            );

        const row = new ActionRowBuilder().addComponents(select);

        await reportedChannel.send({
            content: "<@&1213126421875269652> <@&1213126482730291291>",
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setTitle(`❗ รายงานข้อความ`)
                    .setDescription(`รายงานข้อความ [Go to that Message](${url})\nรายงานโดย <@${interaction.member.id}> | <t:${Date.now().toString().slice(0, -3)}:R>\n\`\`\`${interaction.fields.getTextInputValue('report_system_message_detail')}\`\`\``)
                    .setTimestamp(Date.now())
            ],
            components: [row],
        });

        await interaction.reply({
            content: 'ขอบคุณที่รายงานปัญหาให้พวกเรา เราจะนำปัญหาของท่านไปปรับปรุงระบบต่อไป!',
            ephemeral: true
        });
    } else if (interaction.customId.startsWith('admin_panel')) {
        if (interaction.customId.startsWith('admin_panel_action_ban')) {
            const reasons = {
                th: await interaction.fields.getTextInputValue('reason_th'),
                en: await interaction.fields.getTextInputValue('reason_en'),
            }

            await interaction.deferReply({ ephemeral: true });

            const id = interaction.customId.split('_');

            const userId = id.slice(-2)[0];
            const messageId = id.slice(-1)[0];

            const guild = await client.guilds.fetch('1213126282921902230');

            const member = await guild.members.fetch(userId);

            if (!member) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❗ ไม่สามารถดำเนินการตามคำขอได้")
                        .setDescription("กรุณาลองใหม่อีกครั้งภายหลัง")
                        .setTimestamp(Date.now())
                ],
                ephemeral: true,
            });

            const isBan = await client.ban(member, reasons);

            if (isBan) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setTitle(`✅ แบน ${member.user.username} แล้ว`)
                    ],
                    ephemeral: true
                });

                if (messageId != 'none') {
                    const staffChannel = await guild.channels.fetch('1214489941090897930');

                    const messaege = await staffChannel.messages.fetch(messageId);

                    const originalStaffEmbed = new EmbedBuilder(messaege.embeds[0])
                        .setColor('Green')
                        .addFields([
                            {
                                name: "ดำเนินการโดย (Ban)",
                                value: `<@${interaction.member.id}>`,
                                inline: true
                            },
                            {
                                name: "Action",
                                value: "🚫 Ban",
                                inline: true
                            },
                            {
                                name: "รายละเอียดของการกระทำ",
                                value: `\`\`\`TH: ${reasons.th}\nEN: ${reasons.en}\`\`\``,
                                inline: false
                            }
                        ]);

                    await messaege.edit({
                        content: '',
                        embeds: [originalStaffEmbed],
                        components: []
                    });
                }
            } else {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle(`❌ ไม่สามารถแบนได้`)
                    ],
                    ephemeral: true
                });
            }

            const eventChannel = await guild.channels.fetch('1225162911388012635');

            eventChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle(`🚫 แบน ${member.user.username} แล้ว`)
                        .addFields([
                            {
                                name: "ดำเนินการโดย (Ban)",
                                value: `<@${interaction.member.id}>`,
                                inline: true
                            },
                            {
                                name: "Action",
                                value: "🚫 Ban",
                                inline: true
                            },
                            {
                                name: "รายละเอียดของการกระทำ",
                                value: `\`\`\`TH: ${reasons.th}\nEN: ${reasons.en}\`\`\``,
                                inline: false
                            }
                        ])
                        .setTimestamp(Date.now())
                ]
            });
        } else if (interaction.customId.startsWith('admin_panel_action_send_message')) {
            const text = await interaction.fields.getTextInputValue('message');

            await interaction.deferReply({ ephemeral: true });

            const id = interaction.customId.split('_');

            const userId = id.slice(-2)[0];
            const messageId = id.slice(-1)[0];

            const guild = await client.guilds.fetch('1213126282921902230');

            const member = await guild.members.fetch(userId);

            if (!member) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❗ ไม่สามารถดำเนินการตามคำขอได้")
                        .setDescription("กรุณาลองใหม่อีกครั้งภายหลัง")
                        .setTimestamp(Date.now())
                ],
                ephemeral: true,
            });

            const sendedMessage = await member.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Purple')
                        .setTitle('🔔 การแจ้งเตือนใหม่')
                        .setDescription(`\`\`\`${text}\`\`\`\nNotification form Moderator`)
                        .setTimestamp(Date.now())
                ]
            });

            if (sendedMessage) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setTitle(`✅ ส่งข้อความถึง ${member.user.username} แล้ว`)
                            .setDescription(`\`\`\`${text}\`\`\``)
                    ],
                    ephemeral: true
                });

                if (messageId != 'none') {
                    const staffChannel = await guild.channels.fetch('1214489941090897930');

                    const message = await staffChannel.messages.fetch(messageId);


                    const originalStaffEmbed = new EmbedBuilder(message.embeds[0])
                        .setColor('Green')
                        .addFields([
                            {
                                name: "ดำเนินการโดย (Alert)",
                                value: `<@${interaction.member.id}>`,
                                inline: true
                            },
                            {
                                name: "Action",
                                value: "✉️ Alert",
                                inline: true
                            },
                            {
                                name: "รายละเอียดของการกระทำ",
                                value: `\`\`\`${text}\`\`\``,
                                inline: false
                            }
                        ]);

                    await message.edit({
                        content: '',
                        embeds: [originalStaffEmbed],
                        components: []
                    })
                }
            } else {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle(`❌ ไม่สามารถส่งข้อความได้`)
                    ],
                    ephemeral: true
                });
            }

            const eventChannel = await guild.channels.fetch('1225162911388012635');

            eventChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle(`⚠️ แจ้งเตือน ${member.user.username} แล้ว`)
                        .addFields([
                            {
                                name: "ดำเนินการโดย (Alert)",
                                value: `<@${interaction.member.id}>`,
                                inline: true
                            },
                            {
                                name: "Action",
                                value: "✉️ Alert",
                                inline: true
                            },
                            {
                                name: "รายละเอียดของการกระทำ",
                                value: `\`\`\`${text}\`\`\``,
                                inline: false
                            }
                        ])
                        .setTimestamp(Date.now())
                ]
            });
        } else if (interaction.customId.startsWith('admin_panel_action_timeout')) {
            const reasons = {
                th: await interaction.fields.getTextInputValue('reason_th'),
                en: await interaction.fields.getTextInputValue('reason_en'),
            }

            const time = parseInt(await interaction.fields.getTextInputValue('time_input')) * 60 * 1000;

            await interaction.deferReply({ ephemeral: true });

            const id = interaction.customId.split('_');

            const userId = id.slice(-2)[0];
            const messageId = id.slice(-1)[0];

            const guild = await client.guilds.fetch('1213126282921902230');

            const member = await guild.members.fetch(userId);

            if (!member) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❗ ไม่สามารถดำเนินการตามคำขอได้")
                        .setDescription("กรุณาลองใหม่อีกครั้งภายหลัง")
                        .setTimestamp(Date.now())
                ],
                ephemeral: true,
            });

            const isTimeout = await client.timeout(member, time, reasons);

            if (isTimeout) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setTitle(`✅ หมดเวลา ${member.user.username} แล้ว`)
                    ],
                    ephemeral: true
                });


                if (messageId != 'none') {
                    const staffChannel = await guild.channels.fetch('1214489941090897930');

                    const messaege = await staffChannel.messages.fetch(messageId);

                    const originalStaffEmbed = new EmbedBuilder(messaege.embeds[0])
                        .setColor('Green')
                        .addFields([
                            {
                                name: "ดำเนินการโดย (Timeout)",
                                value: `<@${interaction.member.id}>`,
                                inline: true
                            },
                            {
                                name: "Action",
                                value: `⌛ Timeout (${time} นาที)`,
                                inline: true
                            },
                            {
                                name: "รายละเอียดของการกระทำ",
                                value: `\`\`\`TH: ${reasons.th}\nEN: ${reasons.en}\`\`\``,
                                inline: false
                            }
                        ]);

                    await messaege.edit({
                        content: '',
                        embeds: [originalStaffEmbed],
                        components: []
                    });
                }
            } else {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle(`❌ ไม่สามารถแบนได้`)
                    ],
                    ephemeral: true
                });
            }

            const eventChannel = await guild.channels.fetch('1225162911388012635');

            eventChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle(`⚠️ หมดเวลา ${member.user.username} แล้ว`)
                        .addFields([
                            {
                                name: "ดำเนินการโดย (Timeout)",
                                value: `<@${interaction.member.id}>`,
                                inline: true
                            },
                            {
                                name: "Action",
                                value: `⌛ Timeout (${time} นาที)`,
                                inline: true
                            },
                            {
                                name: "รายละเอียดของการกระทำ",
                                value: `\`\`\`TH: ${reasons.th}\nEN: ${reasons.en}\`\`\``,
                                inline: false
                            }
                        ])
                        .setTimestamp(Date.now())
                ]
            });
        }
    } else {
        const id = interaction.customId;

        if (id == "modal_gateway_login_form" || id == "giveaway_create") {
            try {
                await require(`../modals/${id}`).execute(interaction, client);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        } else if (id.startsWith('modal_gateway_login_enter_otp_form_ref')) { // Login With Otp
            const otp = interaction.fields.getTextInputValue('modal_gateway_login_enter_otp_form_input_otp');
            const ref = id.slice(39);

            const storedData = client.userData[interaction.user.id];

            if (storedData) {
                const { enter_otp_message } = storedData.message;

                if (enter_otp_message) await enter_otp_message.delete();

                const otpData = await OtpSchema.findOne({
                    DiscordId: interaction.member.id,
                    Ref: ref
                });

                if (otpData == null || otpData.Verified != OtpStatusType.WaitForVerify) return await interaction.reply({
                    content: "❌ Otp หมดอายุกรุณาลองอีกครั้งภายหลัง",
                    ephemeral: true
                });

                if (otpData.Otp == otp && otpData.DiscordId == interaction.member.id) {
                    let account = await AccountSchema.findOne({
                        DiscordId: interaction.member.id,
                        Activate: true
                    });

                    if (account == null) {
                        account = await AccountSchema.create({
                            DiscordId: interaction.member.id,
                            Email: otpData.Email,
                            Activate: true
                        });
                    }

                    otpData.Verified = OtpStatusType.Success;
                    await otpData.save();

                    await client.autoGiveRoles(interaction.member, otpData.Email);

                    return await interaction.reply({ content: "✅ ยืนยันตัวตนสำเร็จ", ephemeral: true });
                } else {
                    otpData.Verified = OtpStatusType.Fail;

                    await otpData.save();

                    return await interaction.reply({
                        content: "❌ ยืนยันตัวตนไม่สำเร็จ\nOTP ไม่ถูกต้อง",
                        ephemeral: true
                    });
                }
            } else return await interaction.reply({
                content: "❌ ไม่สามารถยืนยันตัวตนได้เนื่องจากเกิดข้อผิดหลาดกรุณาลองใหม่อีกครั้งภายหลัง",
                ephemeral: true
            });
        }
    }
}