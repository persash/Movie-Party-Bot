import { Channel, Message, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"
let cfg = require('../../config.json')

// This will complain if you don't provide the right types for each property
export default class Hot implements Command {
    name: string = 'hot'
    description: string = 'returns back the most upvoted suggestion that has not been watched yet.'
    strArgs: string [] = []

    async execute(message: Message, mpsChannel?: TextChannel, args?: string[]) {
        const fetchLimit = 50;

        try {
            const messages = await mpsChannel.messages.fetch({ limit: fetchLimit });

            if(!messages) {
                message.author.send(`Couldn't find any messages in ${mpsChannel.name}`);
                return;
            }
                
            var hotSuggestion = {
                count: 0,
                message: ''
            };
            messages.forEach(obj => {
                if(obj.pinned == false) {
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
                message.reply(`here is the hottest movie party suggestion ${hotSuggestion.message} with a total of ${hotSuggestion.count} upvotes out of the latest ${fetchLimit} suggestions!`);
            else
                message.reply(`The past ${fetchLimit} suggestions do not have any upvotes or there are no new suggestions at this time.`)
        }
        catch(e) {
            console.log(e);
            message.author.send('Error has occured while trying to fetch the hottest suggestion.')
        }

    }

}