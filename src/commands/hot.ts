import { SlashCommandBuilder } from '@discordjs/builders'
import { Channel, CommandInteraction, Interaction, Message, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"
let cfg = require('../../config.json')

// This will complain if you don't provide the right types for each property
export default class Hot implements Command {
    name: string = 'hot'
    description: string = 'returns back the most upvoted suggestion that has not been watched yet.'
    strArgs: string[] = []

    data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description);

    enabled: boolean = true;

    async execute(interaction: CommandInteraction) {
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

            if (!messages) {
                await interaction.reply(`Couldn't find any messages in ${mpsChannel.name}`);
                return;
            }

            let hotSuggestion = {
                count: 0,
                message: ''
            };
            messages.forEach(obj => {
                if (obj.pinned == false) {
                    obj.reactions.cache.forEach(r => {
                        if (r && r.emoji.name === cfg.upvoteEmoji) {
                            if (!hotSuggestion.count || r.count > hotSuggestion.count) {
                                hotSuggestion.message = obj.content;
                                hotSuggestion.count = r.count;
                            }
                        }

                    })
                }
            });
            if (hotSuggestion.message !== '')
                await interaction.reply(`here is the hottest movie party suggestion ${hotSuggestion.message} with a total of ${hotSuggestion.count} upvotes out of the latest ${fetchLimit} suggestions!`);
            else
                await interaction.reply(`The past ${fetchLimit} suggestions do not have any upvotes or there are no new suggestions at this time.`)
        }
        catch (e) {
            console.log(e);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }

    }

}