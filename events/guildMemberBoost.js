const db = require('../database/schema/Donatur');
const xpdb = require('../database/schema/xp_player');
const Discord = require('discord.js');
const images = [
    'https://media1.tenor.com/images/bc58975b4797d945c2cdffe2dda64a0f/tenor.gif',
    'https://www.animefeminist.com/wp-content/uploads/2018/03/Samantha-Coming-Out-003-20180312.jpg',
    'https://i.kym-cdn.com/photos/images/original/001/155/275/559.gif',
    'https://media3.giphy.com/media/kigfYxdEa5s1ziA2h1/source.gif',
    'https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif',
    'https://media1.tenor.com/images/0ec6bf6d627e139db6028651b213e841/tenor.gif',
    'https://gif-free.com/uploads/posts/2017-05/1493703506_spongebob-thumb-up.gif'
];
let rstatus = Math.floor(Math.random() * images.length);

module.exports = async (client, member) => {
    let embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setAuthor('Member Boost', 'https://cdn.discordapp.com/emojis/638719606738911236.gif')
        .setDescription(`Hai <@${member.user.id}>, terima kasih telah boost di server Perkumpulan Orang Santai ヾ(≧▽≦*)o `)
        .setImage(images[rstatus])
    client.channels.cache.find(a => a.name === 'chit-chat').send({ embeds: [embed] });

    const xp = await xpdb.findOne({ id: 1 });
    const getUser = xp.data.find(a => a.id === member.user.id);
    if (!getUser) return;
    const isExits = await db.findOne({ userID: member.user.id });
    if (isExits) return;

    await db.create({ userID: member.user.id, guild: member.guild.id, message: { daily: 0, base: getUser.message_count }, isAttend: false });
    client.channels.cache.get("1013977865756356658").send(`\`${member.user.tag}\` terdaftar sebagai booster baru.`);
}