import { Channel, Message, MessageEmbed, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"
import { MovieService } from '../services/movie.service'

export default class Fact implements Command {
    name: string = 'fact'
    description: string = 'get a random fact from a random movie with $random or a random fact about a specific movie. (Warning! the name needs to be almost exact)'
    strArgs: string [] = ['movie title | $random']

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

            if(title === "$random") {
                var random = await movieService.getRandomMovieFact();

                console.log(random);
                if(!random) {
                    message.author.send('Try again. I must of snagged something trying to get random fact');
                    return;
                }

                message.reply(random.title + ' ' + random.url)
            }
            else {
                var fact = await movieService.getMovieFact(title);

                console.log(fact);
                if(!fact) {
                    message.reply(`I could not find any facts for ${title}. Try again with a refined name.`);
                    return;
                }

                message.reply(fact.title + ' ' + fact.url)
            }
        }
        catch(e) {

        }

    }

}