import { SlashCommandBuilder } from '@discordjs/builders'
import { Channel, CommandInteraction, Interaction, Message, MessageEmbed, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"
import { MovieService } from '../services/movie.service'

export default class Fact implements Command {
    name: string = 'fact'
    description: string = 'returns random fact about a random movie with $random or about a specific movie.'
    strArgs: string [] = ['movie title | $random']

    data: SlashCommandBuilder = new SlashCommandBuilder()
	.setName(this.name)
	.setDescription(this.description);

    constructor() {
        this.data.addStringOption(option =>
            option.setName('title')
                .setDescription('give movie title or $random')
                .setRequired(true));
    }
    enabled: boolean = true;

    async execute(interaction?: CommandInteraction) {

        try {

            if(!interaction.options && !interaction.options.getString("title")) return;

            const title = interaction.options.getString("title");

            const movieService = new MovieService();

            if(title === "$random") {
                const random = await movieService.getRandomMovieFact();

                if(!random) {
                    await interaction.reply('Try again. I must of snagged something trying to get random fact');
                    return;
                }

                await interaction.reply(random.title + ' ' + random.url)
            }
            else {
                const fact = await movieService.getMovieFact(title);

                if(!fact) {
                    await interaction.reply(`I could not find any facts for ${title}. Try again with a refined name.`);
                    return;
                }

                await interaction.reply(fact.title + ' ' + fact.url)
            }
        }
        catch(e) {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }

    }

}