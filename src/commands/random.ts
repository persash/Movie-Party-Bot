import { Channel, Message, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"

export default class Random implements Command {
    name: string = 'random'
    description: string = 'I will choose a random unwatched/unpinned movie suggestion from the movie party suggestion channel for the next movie party.'
    strArgs: string [] = []

    async execute(message: Message, mpsChannel?: TextChannel, args?: string[]) {
        const fetchLimit = 50;

        try {
            const messages = await mpsChannel.messages.fetch({ limit: fetchLimit });

            if(!messages) {
                message.reply('No unpinned/unwatched suggestions found. Add more suggestions.')
                return;
            }
    
            var unpinnedMsgs = messages.filter(m => !m.pinned);
    
            if (unpinnedMsgs.size > 0) {
                var randomPick = unpinnedMsgs.random();
                console.log(randomPick);
                if(!randomPick || randomPick.content.trim() === "")
                    randomPick = unpinnedMsgs.random();
                message.reply(`And the Oscar randomly goes to movie suggestion ${randomPick.content}`)
    
            }
            else {
                message.reply('No unpinned/unwatched suggestions found. Add more suggestions.')
            }
        }
        catch(e) {
            console.log(e);
            message.author.send('Error has occured while trying to fetch a random suggestion.')
        }

    }

}