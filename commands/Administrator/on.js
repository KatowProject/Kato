const Discord = require('discord.js');
const { allCommands } = require('../../database/schema/manageCommand');

exports.run = async (client, message, args) => {

    try {
        const channels = allCommands;

        let request = args.join(' ');
        if (!request) return message.reply('berikan channelnya untuk melanjutkan');

        const userID = client.channels.cache.get(args[0]);
        const userRegex = new RegExp(args.join(" "), "i");

        let findChannel = client.channels.cache.find(a => {
            return userRegex.test(a.name);
        });


        const channel = await channels.findOne({ guild: message.guild.id });

        if (userID) {

            const filterCH = channel.channels.filter(a => a !== userID.id);
            await channels.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, channels: filterCH });
            message.reply(`Semua perintah telah diaktifkan di <#${userID.id}>!`);

        } else {

            const filterCH = channel.channels.filter(a => a !== findChannel.id);
            await channels.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, channels: filterCH });
            message.reply(`Semua perintah telah diaktifkan di <#${findChannel.id}>`);

        }


    } catch (error) {
        return message.reply('sepertinya ada kesalahan:\n' + error.message);
        // Restart the bot as usual.
    }

}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['MANAGE_CHANNELS']
}

exports.help = {
    name: 'on',
    description: 'nyalain semua perintah dengan channel yang spesifik',
    usage: 'on <channelName / channelID>',
    example: 'on 795783129893568572'
}