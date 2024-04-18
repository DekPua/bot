const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (process.env.IS_DEV) return;
        if (message.channelId != '1213789140555137025') return;

        const hasVerify = await message.member.roles.cache.has("1213411732391723068");
        const hasMod = await message.member.roles.cache.has("1213126421875269652");
        const hasStaff = await message.member.roles.cache.has("1213126482730291291");

        if (hasVerify || hasMod || hasStaff) return;

        await message.delete();

        await client.ban(message.member, { th: "[AntiScam] สงสัยว่าเป็นสแปม", en: "[AntiScam] Suspected of spam"})
    }
}