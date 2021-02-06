import Axios from 'axios';
import { Channel, Message, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"
import * as cheerio from 'cheerio';
import { MovieService } from '../services/movie.service';

export default class Info implements Command {
    name: string = 'info'
    description: string = 'returns back the imdb rating and where you can watch the movie. (Experimental. Use at own risk. Only works for movies.)'
    strArgs: string [] = ['movie title']

    async execute(message: Message, mpsChannel?: TextChannel, args?: string[]) {
        try {
            if(!args || args.length == 0) {
                message.reply('You forgot a movie title, dummy.')
                return;
            }
    
            args = args.filter(a => a.trim() !== '');
            var title = args.join(' ');
    
            const movieService = new MovieService();
    
            const detailsTask = movieService.getMovieInfo(title);

            const otherDetailsTask = movieService.getMovieDetails(title);

            let [details, otherDetails] = await Promise.all([detailsTask, otherDetailsTask]);

    
            if(!details || details.error != "") {
                message.reply('Movie does not exist, you typed in a show instead of a movie, or search with a better name.')
                return;
            }
    
            var reply = `Here's info on ${title} \n`;
    
            reply += `Description: ${details.description}\n`;
    
            if(details.ratings.length > 0) {
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
    
            message.reply(reply);
        }
        catch(e) {
            console.log(e);
            message.author.send('Error has occured while trying to fetch the your movie info.')

        }
        
    }

}