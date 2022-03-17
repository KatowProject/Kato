const Discord = require('discord.js');
const db = require('../../database/schema/Shop');
const dbDonatur = require('../../database/schema/Donatur');

exports.run = async (client, message, args) => {
    try {
        if (!message.member.roles.cache.hasAny("933117751264964609", "932997958788608044", "932997958834733080")) return message.reply('Kamu tidak memiliki izin untuk menggunakan perintah ini!')
        const user = await dbDonatur.findOne({ userID: message.author.id });

        const items = await db.find({});
        const buttons = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton().setLabel('🛒').setStyle('PRIMARY').setCustomId(`buy-${message.id}`)
            ]);

        const r = await message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setTitle('Kato Shop')
                    .setDescription(items.map((a, i) => `**${i + 1}. ${a.name}** - \`${a.price}\` Tickets - ${a.stock} Items Available`).join('\n'))
                    .setColor('RANDOM')
                    .setFooter(`Total items: ${items.length}`)
                    .setTimestamp()
            ],
            components: [buttons]
        });

        const collector = r.channel.createMessageComponentCollector({ filter: m => m.user.id === message.author.id, time: 60000 });
        collector.on('collect', async (m) => {
            await m.deferUpdate();
            switch (m.customId) {
                case `buy-${message.id}`:
                    await buyItem(items, user);

                    collector.stop();
                    break;
            }
        });
    } catch (e) { // deepscan-disable-line
        message.channel.send(`Error: ${e.message}`);

    }

    async function buyItem(items, getUser) {
        message.reply('Pilih menggunakan angka, saat memasukkan nomor item akan langsung terbeli. hati-hati saat memasukkan nomor agar tidak salah beli!');
        const msgCollector = await message.channel.createMessageCollector({ filter: m => m.author.id === message.author.id, time: 60_000 });
        msgCollector.on('collect', async (msg) => {
            if (msg.content === 'cancel') {
                message.reply('Dibatalkan');
                msgCollector.stop();
                return;
            }
            const product = items[msg.content - 1];
            if (product) {
                if (product.stock > 0) {
                    if (product.price <= getUser.ticket) {
                        getUser.ticket = getUser.ticket - product.price;
                        product.stock = product.stock - 1;

                        message.reply(`Kamu membeli ${product.name} dengan ${product.price} tickets, DM Admin yang sedang on untuk mengklaimnya!`);
                        client.channels.cache.get('932997960923480097').send(`**${message.author.tag}** membeli ${product.name} dengan ${product.price} tickets`);
                        msgCollector.stop();

                        await db.findOneAndUpdate({ name: product.name }, product);
                        await getUser.save();
                    } else {
                        message.reply('Tiket kamu tidak mencukupi.');
                        msgCollector.stop();
                    }
                } else {
                    message.reply('Stok sedang tidak tersedia.');
                    msgCollector.stop();
                }
            } else {
                message.reply('Kamu tidak memilih produk apapun.');
            }
        });
    };
};


exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'shop',
    description: 'Menampilkan daftar item yang tersedia',
    usage: 'shop',
    example: 'shop'
}