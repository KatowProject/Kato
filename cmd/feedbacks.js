const Discord = require("discord.js")

    module.exports.run = async (bot, message, args) => {
        let botembed = new Discord.RichEmbed()
        .setColor("#985ce7")
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField("k!saran", `Memberi Saran untuk Server ${message.guild.name}`)
        .addField("k!lapor", `Memberi Laporan Untuk Server ${message.guild.name}`)
        return message.channel.send(botembed);
}


module.exports.help = {
    name : "feedbacks"
}
