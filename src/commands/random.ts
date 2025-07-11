import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, ChatInputCommandInteraction, CommandInteraction, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"
let cfg = require('../../config.json')


export default class Random implements Command {
    name: string = 'random'
    description: string = 'picks a random unpinned movie suggestion from the movie party suggestion channel'
    strArgs: string [] = []

    data: SlashCommandBuilder = new SlashCommandBuilder()
	.setName(this.name)
	.setDescription(this.description);

    enabled: boolean = true;

    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const fetchLimit = 50;

        try {

            const interactionChannel = interaction.channel as TextChannel;
            let mpsChannel: TextChannel;
            if (interactionChannel.name !== cfg.moviePartySuggestionChannel) {
                interaction.guild.channels.cache.forEach(chan => {
                    if (chan.name === cfg.moviePartySuggestionChannel) {
                        mpsChannel = chan as TextChannel;
                    }
                });
            }

            if (!mpsChannel) await interaction.reply(`"${cfg.moviePartySuggestionChannel}" text channel does not exist on your server. Your mods are movie party poopers.`);


            const messages = await mpsChannel.messages.fetch({ limit: fetchLimit });

            if(!messages) {
                await interaction.reply({content: 'No unpinned/unwatched suggestions found. Add more suggestions.', ephemeral: true});
                return;
            }
    
            const unpinnedMsgs = messages.filter(m => !m.pinned);
    
            if (unpinnedMsgs.size > 0) {
                let randomPick = unpinnedMsgs.random();
                console.log(randomPick);
                if(!randomPick || randomPick.content.trim() === "")
                    randomPick = unpinnedMsgs.random();
                    await interaction.reply(`And the Oscar randomly goes to movie suggestion ${randomPick.content}`)
    
            }
            else {
                await interaction.reply({content: 'No unpinned/unwatched suggestions found. Add more suggestions.', ephemeral: true});
            }
        }
        catch(e) {
            console.log(e);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }

    }

}