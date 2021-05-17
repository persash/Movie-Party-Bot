

import { Channel, Client, GuildChannel, MessageEmbed, TextChannel } from 'discord.js'

import { glob, Glob } from "glob"
import { promisify } from 'util'

import { Command } from './interfaces/command.interface'
import { SuggestionValidation } from './validations/suggestion.validation'

let cfg = require('./../config.json')

const globPromises = promisify(glob);

const commands: Command[] = []

const client: Client = new Client();

//Custom to your server. Check config.js
const moviePartySuggestionChannelName = cfg.moviePartySuggestionChannel;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setPresence({
    status: "online",
    activity: {
      name: "!mpsb help",
      type: "PLAYING"
    }
  });
  const glob = new Glob(`${__dirname}/commands/**/*.js`, function (er, files) {
    files.forEach(f => {
      let commandClass = require(f).default
      if(commandClass) {
        const command = new commandClass() as Command
        commands.push(command);
      }

    })
  })

});

client.on('message', async msg => {
  if(msg && !msg.author.bot && msg.channel.type === 'text' && msg.type === 'DEFAULT' ) {
    const suggestionValidation = new SuggestionValidation();
    if(msg.channel.name === moviePartySuggestionChannelName) {
      suggestionValidation.validate(msg);
      return;
    }
    let mpsChannel: TextChannel;
    if(msg.content.startsWith(cfg.prefix)) {
      try {
        if(msg.channel.name !== moviePartySuggestionChannelName) {
          msg.guild.channels.cache.forEach(chan => {
              if(chan.name === moviePartySuggestionChannelName) {
                  mpsChannel = chan as TextChannel;
              }
          });
      }
      }
      catch {
        console.log('error')
        return;
      }

      if(!mpsChannel)
      {
        msg.reply(`"${moviePartySuggestionChannelName}" text channel does not exist on your server. Your mods are movie party poopers.`);
        return;
      }

      if(commands.length > 0) {
        var commandStr = msg.content.replace(`${cfg.prefix} `, '');
        var commmandSplit = commandStr.split(' ');
        var command = commands.find(c => c.name === commmandSplit[0].toLowerCase());
        if(command && command.name !== 'help') {
          commmandSplit.shift();
          await command.execute(msg, mpsChannel, commmandSplit);
        } else if(commmandSplit[0] === 'help') {
          var helpEmed = new MessageEmbed();
          helpEmed.setTitle('Movie Party Suggestion Bot Help');
          helpEmed.setDescription('Here is the list of my commands');
          commands.forEach(c => {

            var commandHelp = c.name
            if(c.strArgs && c.strArgs.length > 0) {
              c.strArgs.forEach(a => {
                commandHelp += ` {${a}} `
              })
            }
            helpEmed.addField(commandHelp, c.description);
          })
          msg.reply(helpEmed)
        } else {
          msg.author.send(`Command not recognized. Try ${cfg.prefix} help.`)
        }
      }
    }
  }
});

client.login(cfg.discordToken);