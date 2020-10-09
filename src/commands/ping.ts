import { Channel, Message, TextChannel } from 'discord.js'
import { Command } from "../interfaces/command.interface"

export default class Ping implements Command {
    name: string = 'ping'
    description: string = 'ping me, baby'
    strArgs: string [] = []

    async execute(message: Message, mpsChannel?: TextChannel, args?: string[]) {
        console.log('executing')
        message.reply('PoNg');
    }

}