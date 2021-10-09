import Axios from 'axios';
import { Channel, CommandInteraction, Interaction, Message, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"
import * as cheerio from 'cheerio';
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

    async execute(interaction: CommandInteraction) {
        try {

            if (!interaction.options && !interaction.options.getString("title")) {
                await interaction.reply({content: 'Title required', ephemeral: true});
                return;

            };

            await interaction.deferReply();

            const title = interaction.options.getString("title");

            const movieService = new MovieService();

            const detailsTask = movieService.getMovieInfo(title);

            const otherDetailsTask = movieService.getMovieDetails(title);

            let [details, otherDetails] = await Promise.all([detailsTask, otherDetailsTask]);


            if (!details || details.error != "") {
                await interaction.reply({content: 'Movie does not exist, you typed in a show instead of a movie, or search with a better name.', ephemeral: true});
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
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });

        }

    }

}