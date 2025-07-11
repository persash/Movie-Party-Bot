import { CacheType, Channel, ChatInputCommandInteraction, CommandInteraction, Interaction, Message, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"
import { MovieService } from '../services/movie.service';
import { SlashCommandBuilder } from '@discordjs/builders';

export default class Info implements Command {
    name: string = 'info'
    description: string = 'returns back the imdb rating and where you can watch the movie.'
    strArgs: string[] = ['movie title']

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

    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        try {

            if (!interaction.options && !interaction.options.getString("title")) {
                await interaction.reply({content: 'Title required', ephemeral: true});
                return;

            };

            await interaction.reply({ content: 'working on it...', ephemeral: true });

            const title = interaction.options.getString("title");

            const movieService = new MovieService();

            const detailsTask = movieService.getMovieInfo(title);

            const otherDetailsTask = movieService.getMovieDetails(title);

            let [details, otherDetails] = await Promise.all([detailsTask, otherDetailsTask]);


            if (!details || details.error != "") {
                await interaction.editReply({content: 'Movie does not exist, you typed in a show instead of a movie, or search with a better name.'});
                return;
            }

            let reply = `Here's info on ${title} \n`;

            reply += `Description: ${details.description}\n`;

            if (details.ratings.length > 0) {
                details.ratings.forEach(r => {
                    reply += `${r.source}: ${r.score}\n`
                });
            }

            reply += `Director: ${details.director}\n`;
            reply += `Actors: ${details.actors}\n`;
            reply += `Genre: ${details.genre}\n`;
            reply += `Release Date: ${details.releaseDate}\n`;
            reply += `Runtime: ${details.runTime}\n`;


            //reply += `imdb rating: ${details.imdbRating}\n`

            if (otherDetails.availableOn.length > 0) {

                reply += `Available on ${otherDetails.availableOn.join(', ')}`;
            }

            await interaction.editReply(reply);
        }
        catch (e) {
            console.log(e);
            await interaction.editReply({ content: 'There was an error while executing this command!' });

        }

    }

}