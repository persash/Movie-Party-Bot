import { Channel, Message, MessageEmbed, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"
import { MovieService } from '../services/movie.service'

export default class Gif implements Command {
    name: string = 'gif'
    description: string = 'post a random gif from your favorite movie. (Experimental, technically you could search anything)'
    strArgs: string [] = ['movie title']

    async execute(message: Message, mpsChannel?: TextChannel, args?: string[]) {

        try {
            if(!args || args.length == 0) {
                message.reply('You forgot a movie title, dummy.')
                return;
            }
    
            args = args.filter(a => a.trim() !== '');
            var title = args.join(' ');
            console.log(title);

            var movieService = new MovieService();

            const gif = await movieService.getMovieGif(title);

            if(!gif) {
                message.author.send('Try again. I must of snagged something trying to get random gif');
                return;
            }

            message.reply(gif.url);
        }
        catch(e) {

        }

    }

}