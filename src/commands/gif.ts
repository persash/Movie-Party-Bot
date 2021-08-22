import { SlashCommandBuilder } from '@discordjs/builders'
import { Channel, CommandInteraction, Interaction, Message, MessageEmbed, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"
import { MovieService } from '../services/movie.service'

export default class Gif implements Command {
    name: string = 'gif'
    description: string = 'post a random gif from your favorite movie. (Experimental, technically you could search anything)'
    strArgs: string [] = ['movie title']

    data: SlashCommandBuilder = new SlashCommandBuilder()
	.setName(this.name)
	.setDescription(this.description);

    enabled: boolean = true;

    constructor() {
        this.data.addStringOption(option =>
            option.setName('title')
            .setDescription('give movie title')
            .setRequired(true));
    }

    async execute(interaction: CommandInteraction) {

        try {
            if(!interaction.options && !interaction.options.getString("title")) return;

            const title = interaction.options.getString("title");

            const movieService = new MovieService();

            const gif = await movieService.getMovieGif(title);

            if(!gif) {
                await interaction.reply({ content: 'Try again. I must of snagged something trying to get random gif', ephemeral: true });
                return;
            }

            await interaction.reply(gif.url);
        }
        catch(e) {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }

    }

}