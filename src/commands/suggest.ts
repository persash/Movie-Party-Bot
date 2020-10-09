import { Channel, Message, TextChannel } from 'discord.js'

import { Command } from "../interfaces/command.interface"

import Axios from 'axios';
import { MovieService } from '../services/movie.service';

let cfg = require('../../config.json')


export default class Suggest implements Command {
    description: string = 'searches for a youtube trailer based on the given movie title and posts it in the Movie Party Suggestion channnel (Experimental. This is a literal youtube search).'
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
    
            const pinned = await mpsChannel.messages.fetchPinned();
    
            var isPinned = pinned.find(p => (p.content.indexOf(title) > -1 && title && title !== '') || (p.embeds && p.embeds.findIndex(e => e.title.indexOf(title) > -1) > -1));
    
            if (isPinned) {
                await message.author.send(`The movie you suggested has already been watched. Check ${mpsChannel.name} channel pinned messages.`);
                await message.delete();
                return;
            }
    
            var movieService = new MovieService();
    
            const trailer = await movieService.findTrailer(title);
    
            if(!trailer || !trailer.id.videoId) {
                message.reply('Could not find any youtube trailers with the suggested movie name. Try adding "Trailer" to your movie title helps.');
                return;
            }
    
            var url = `${cfg.youtubeBaseUrl}${trailer.id.videoId}`
            var isPinned = pinned.find(p => p.content.indexOf(url) > - 1 || (p.embeds && p.embeds.findIndex(e => e.url.indexOf(url) > -1) > -1));
            if (isPinned) {
                await message.author.send(`The movie you suggested has already been watched. Check ${mpsChannel.name} channel pinned messages.`)
                await message.delete();
                return;
            }
            mpsChannel.send(`${message.author} has suggested ${url}`);
            message.reply(`The Movie Party Collective has found a sufficient youtube trailer for your movie suggestion ${title}. Please check the ${mpsChannel.name} channel.`)
        }
        catch(e) {
            console.log(e);
            message.author.send('Error has occured while trying to fetch your suggestion.')
        }
        
    }

    name: string = 'suggest'
}