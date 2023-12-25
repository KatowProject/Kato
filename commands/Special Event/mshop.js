exports.run = async (client, message, args) => {
    try {
        if (!message.member.permissions.has('MANAGE_GUILD')) return message.channel.send("Kamu tidak memiliki izin untuk menggunakan command ini.");

        client.katoShop.Shop.ShopManager(message, args);
    } catch (err) {
        message.channel.send({ content: 'Something wrong with: ' + err.message });
    }
}

exports.conf = {
    cooldown: 5,
    aliases: []
}

exports.help = {
    name: "e-mshop",
    description: "Menambahkan item ke shop.",
    usage: "event-mshop",
}
