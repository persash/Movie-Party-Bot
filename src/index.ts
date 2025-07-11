
import {  ChannelType, Client, Events, GatewayIntentBits, MessageType } from 'discord.js'
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';

import { Command } from './interfaces/command.interface'
import { SuggestionValidation } from './validations/suggestion.validation'

import fs from "fs";
import path from 'path'

let cfg = require('./../config.json')

const client: Client = new Client(
  {intents: [GatewayIntentBits.GuildExpressions, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages],
   allowedMentions: { parse: ['users', 'roles'], repliedUser: true}});

const commands: Command[] = []
const commandFiles = fs.readdirSync(path.resolve(__dirname, 'commands')).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
  let commandClass = require(`./commands/${file}`).default
  if(commandClass) {
    const command = new commandClass() as Command
    if(command.enabled) {
      commands.push(command);
    }
  }
})

const rest = new REST({ version: '9' }).setToken(cfg.discordToken);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
      Routes.applicationCommands(cfg.discordAppId),
      { body: commands.map(c => c.data.toJSON()) },
    );
    

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})()



//Custom to your server. Check config.js
const moviePartySuggestionChannelName = cfg.moviePartySuggestionChannel;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // client.user.setPresence({activities: [{ name: '!mpsb help', type: "PLAYING" }], status: 'online'});
 
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find(c => c.name === interaction.commandName);

	if (!command || command.enabled == false) return;

  console.log(`${interaction.commandName}`);

  try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', async msg => {
  if(msg && msg.channel.type === ChannelType.GuildText && msg.type === MessageType.Default ) {
    const suggestionValidation = new SuggestionValidation();
    if(msg.channel.name === moviePartySuggestionChannelName) {
      suggestionValidation.validate(msg);
      return;
    }
  }
});

client.login(cfg.discordToken);
