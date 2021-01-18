let fs = require("fs");
const Discord = require('discord.js');
const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]});
const enmap = require('enmap');
const {token, prefix, color, name, sChannel, SBon, pChannel, PBon} = require('./config.json');
const { Client, MessageAttachment } = require('discord.js');


const settings = new enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});

client.on('ready', () => {
    console.log('HeistHome RP Support is online (SNIPPY)');

    // Set the bot's activity //

client.user.setActivity('HeistHome RP for support', { type: 'WATCHING' })
.then(presence => console.log(`I am always watching ${presence.activities[0].name}`))
.catch(console.error);

});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "ticket-setup") {
        
        // HeistHome Support

        let channel = message.mentions.channels.first();
        if(!channel) return message.reply("Usage: `!ticket-setup #channel`");

        let sent = await channel.send(new Discord.MessageEmbed()
            .setTitle("HeistHome Support")
            .setDescription("React to open a ticket!")
            .setFooter("👇")
            .setColor("00ff00")
        );

        sent.react('🎫');
        settings.set(`${message.guild.id}-ticket`, sent.id);

        message.channel.send("Ticket System Setup Done!")
    }

    if(command == "close") {
        if(!message.channel.name.includes("ticket-")) return message.channel.send("You cannot use that here!")
        message.channel.delete();
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

    if(!ticketid) return;

    if(reaction.message.id == ticketid && reaction.emoji.name == '🎫') {
        reaction.users.remove(user);

        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@&763008080102948875> <@${user.id}>`, new Discord.MessageEmbed().setTitle("Welcome to HeistHome Support!").setDescription("We will be with you shortly").setFooter("Ask here about your problem 👇").setColor("00ff00"))
        })
    }
});

// Welcome to HeistHome RP (Greetings)


client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    if (!channel) return;
    channel.send(`Welcome to the server, ${member} Make sure to read server rules 😃 For more info check #server-rules`);
  }); 

// Moderation (KICK & BAN)

client.on('message', message => {
    if (message.author.bot) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

  
    if (command === 'hhrpkick') {
          const user = message.mentions.users.first();
          if (user) {
            const member = message.guild.member(user);
            if (member) {
            member
                .kick('Optional reason that will display in the audit logs')
                .then(() => {
                  message.reply(`Successfully kicked ${user.tag}`);
                })
                .catch(err => {
                  message.reply('I was unable to kick the member');
                  console.error(err);
                });
            } else {
              message.reply("That user isn't in this server!");
            }
          } else {
            message.reply("You didn't mention the user to kick!");
          }
      } else {
              if (command === 'hhrpban') {
              const user = message.mentions.users.first();
              if (user) {
                const member = message.guild.member(user);
                if (member) {
                  member
                    .ban({
                      reason: 'They were bad!',
                    })
                    .then(() => {
                      message.reply(`Successfully banned ${user.tag}`);
                    })
                    .catch(err => {
                      message.reply('I was unable to ban the member');
                      console.error(err);
                    });
                } else {
                  message.reply("That user isn't in this server!");
                }
              } else {
                message.reply("You didn't mention the user to ban!");
              }
            }
      }
});

// Announce


client.on("message", (message) => {

  const args = message.content.slice(1).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === "hhwl") {
  let announcement = message.content.substring(5);
  let announcementschannel = client.channels.cache.get('760523919530131496');
  if(announcementschannel)
  announcementschannel.send(announcement);
  }
})

// Whitelist process form accept
client.on("message", (message) => {

  const args = message.content.slice(1).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === "facc") {
  let announcement = message.content.substring(5);
  let announcementschannel = client.channels.cache.get('643367184428433430');
  if(announcementschannel)
  announcementschannel.send(`${announcement} Your form has been **ACCEPTED**, We will let you know about the time of interview at <#760526024537669672>`);
  }
})

// Whitelist process form reject
client.on("message", (message) => {

  const args = message.content.slice(1).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === "frej") {
  let announcement = message.content.substring(5, 27);
  let reason = message.content.substring(28);
  let announcementschannel = client.channels.cache.get('643367184428433430');
  if(announcementschannel)
  announcementschannel.send(`${announcement} Your application form got **REJECTED**! **Reason :** ${reason} .Thanks! You can reapply after 24 hours!`);
  }
})

// Whitelist process interview accept
client.on("message", (message) => {

  const args = message.content.slice(1).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === "iacc") {
  let announcement = message.content.substring(5);
  let announcementschannel = client.channels.cache.get('643367184428433430');
  if(announcementschannel)
  announcementschannel.send(`${announcement} Welcome to **HHRP!** Make sure you go through <#756777109330067488>, <#760732185065553960> and <#760726628325523466>. Make sure you follow all the rules and stay in character at all times. Enjoy Roleplaying!`);
  }
})

// Whitelist process interview reject
client.on("message", (message) => {

  const args = message.content.slice(1).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === "irej") {
  let announcement = message.content.substring(5);
  let announcementschannel = client.channels.cache.get('643367184428433430');
  if(announcementschannel)
  announcementschannel.send(`${announcement} Sorry to inform but you **COULDN'T** make it through the interview phase. You can **REAPPLY** in 24hours.`);
  }
})


// live


client.on("message", message => {

  const args = message.content.slice(1).trim().split(' ');
  const command = args.shift().toLowerCase();
  const Streaming_HHRP = '763981227342299166';


  if (command === "live") {
    message.delete()
  let announcement = message.content.substring(6, 27);
  let link = message.content.substring(27);
  let announcementschannel = client.channels.cache.get('643367184428433430');
  if(announcementschannel)
  announcementschannel.send(`*Hey* <@&791198602084352021> ${announcement} *is* ***live*** *now. Watch it at* ${link}`);
  message.member.roles.add(Streaming_HHRP);
  }
})

// live close //

client.on("message", message => {

  const args = message.content.slice(1).trim().split(' ');
  const command = args.shift().toLowerCase();
  const Streaming_HHRP = '763981227342299166';

  if(command === "stop") {
    message.delete()
    let announcement = message.content.substring(6);
    let announcementschannel = client.channels.cache.get('643367184428433430');
  if(announcementschannel)
    announcementschannel.send(`${announcement} *stopped streaming. Thanks for Joining*`);
    message.member.roles.remove(Streaming_HHRP)
  }
  })

// suggestion

client.on("message", message => {
  if (!message.content.startsWith(prefix)) return;
  let args = message.content.substring(prefix.length).split(" ")

  if (args[0] === "suggest") {
      suggest(message, args)
  }
  function suggest(message, args) {
    if (!args[1]) message.channel.send("You need a suggestion!")
    else if (SBon == false) return message.channel.send("We are not current taking suggestions at the moment.").then(
        console.log(message.author.tag + " Has attempted to make a suggestion!"))
   else if (!args) return message.channel.send("You need to suggest something!")

    else {

        let content = args.splice(1).join(" ")

        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setThumbnail(message.author.displayAvatarURL())
            //.setTitle(message.member.user.displayAvatarURL(), message.author.tag)
            .setTitle("🔸 HHRP Suggestions")
            .setDescription(message.author.tag + (" **shared a suggestion!**"))
            .addField("🔸 **Suggestion Details**", content)
            .setFooter("👱 𝐖𝐞 𝐚𝐩𝐩𝐫𝐞𝐜𝐢𝐚𝐭𝐞𝐝")
            //.setFooter("Made By " + message.author.tag, message.author.avatarURL)
            .setTimestamp(new Date())
        let embedsent = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle("👍 **SUGGESTION MADE**")
            .setDescription(message.author + (" Has made a suggestion!"))
            .setFooter(message.author.tag, message.author.avatarURL)
            .setTimestamp(new Date())
        return client.channels.cache.get(sChannel).send(embed).then(sentEmbed => {
            sentEmbed.react("✅").then(
                setTimeout(() => {
                    (message.delete({ timeout: 1000 })).then(sentEmbed.react("❎"))}), 1000)
        })

    }

};
});

// Polling System

client.on("message", message => {
  if (!message.content.startsWith(prefix)) return;
  let args = message.content.substring(prefix.length).split(" ")

  if (args[0] === "poll") {
      suggest(message, args)
  }
  function suggest(message, args) {
    if (!args[1]) message.channel.send("You need a Poll!")
    else if (PBon == false) return message.channel.send("We are not current taking poll at the moment.").then(
        console.log(message.author.tag + " Has made a poll!"))
   else if (!args) return message.channel.send("You need to poll something!")

    else {

        let content = args.splice(1).join(" ")

        let embed = new Discord.MessageEmbed()
            .setColor(color)
            //.setThumbnail(message.author.displayAvatarURL())
            //.setTitle(message.member.user.displayAvatarURL(), message.author.tag)
            .setTitle("🔰  Poll removes after 24 Hours")
            //.setDescription(message.author.tag + (" **started a poll!**"))
            .addField("🔰  **Polling Details**", content)
            //.setFooter("📣 removes after 24 Hours")
            .setFooter(message.author.tag + (" started a poll! "))
            //.setFooter("Made By " + message.author.tag, message.author.avatarURL)
            .setTimestamp(new Date())
        let embedsent = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle("👍 **SUGGESTION MADE**")
            .setDescription(message.author + (" Has made a suggestion!"))
            .setFooter(message.author.tag, message.author.avatarURL)
            .setTimestamp(new Date())
        return client.channels.cache.get(pChannel).send(embed).then(sentEmbed => {
            sentEmbed.react("🔼")
            sentEmbed.react("🔽").then(
                setTimeout(() => {
                    (message.delete({ timeout: 1000 })).then(sentEmbed.react("📝"))}), 1000)
        })

    }

};
});



client.login(token);
