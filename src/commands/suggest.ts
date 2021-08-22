import { Channel, CommandInteraction, Interaction, Message, TextChannel } from 'discord.js'

import { Command } from "../interfaces/command.interface"

import Axios from 'axios';
import { MovieService } from '../services/movie.service';
import { SlashCommandBuilder } from '@discordjs/builders';

let cfg = require('../../config.json')


export default class Suggest implements Command {
    name: string = 'suggest'
    description: string = 'searches for a trailer based on the given movie title and posts it to the Movie Party channnel.'
    strArgs: string [] = ['movie title']

    data: SlashCommandBuilder = new SlashCommandBuilder()
	.setName(this.name)
	.setDescription(this.description);

    enabled: boolean = true;


    constructor() {
        this.data.addStringOption(option =>
            option.setName('title')
            .setDescription('suggest movie title')
            .setRequired(true));
    }

    async execute(interaction: CommandInteraction) {

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

            if(!interaction.options && !interaction.options.getString("title")) return;

            const title = interaction.options.getString("title");
    
            const pinned = await mpsChannel.messages.fetchPinned();
    
            var isPinned = pinned.find(p => (p.content.indexOf(title) > -1 && title && title !== '') || (p.embeds && p.embeds.findIndex(e => e.title.indexOf(title) > -1) > -1));
    
            if (isPinned) {
                await interaction.reply({content: `The movie you suggested has already been watched. Check ${mpsChannel.name} channel pinned messages.`, ephemeral: true});
                return;
            }
    
            const movieService = new MovieService();
    
            const trailer = await movieService.findTrailer(title);
    
            if(!trailer || !trailer.id.videoId) {
                await interaction.reply({content: 'Could not find any youtube trailers with the suggested movie name. Try adding "Trailer" to your movie title helps.', ephemeral: true});
                return;
            }
    
            const url = `${cfg.youtubeBaseUrl}${trailer.id.videoId}`
            var isPinned = pinned.find(p => p.content.indexOf(url) > - 1 || (p.embeds && p.embeds.findIndex(e => e.url.indexOf(url) > -1) > -1));
            if (isPinned) {
                await interaction.reply({ content: `The movie you suggested has already been watched. Check ${mpsChannel.name} channel pinned messages.`, ephemeral: true });
                return;
            }
            await mpsChannel.send(`${interaction.user} has suggested ${url}`);
            await interaction.reply(`The Movie Party Collective has found a sufficient youtube trailer for your movie suggestion ${title}. Please check the ${mpsChannel.name} channel.`)
        }
        catch(e) {
            console.log(e);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        
    }

}