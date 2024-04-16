const roles = require('../configs/Roles.json');

function isPuaAcThEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@pua\.ac\.th$/;
    return regex.test(email);
}

module.exports = (client) => {
    client.giveRole = async (member, roleId) => {
        const hasRole = await member.roles.cache.has(roleId);

        if (!hasRole) await member.roles.add(roleId)
    }

    client.removeRole = async (member, roleId) => {
        const hasRole = await member.roles.cache.has(roleId);

        if (hasRole) await member.roles.remove(roleId)
    }

    client.autoGiveRoles = async (member, email) => {
        await client.giveRole(member, roles.Verified);

        if (isPuaAcThEmail(email)) await client.giveRole(member, roles.PuaSchool);
    }

    client.removeRoles = async (member) => {
        await client.removeRole(member, roles.Verified);
        await client.removeRole(member, roles.PuaSchool);
    }
}