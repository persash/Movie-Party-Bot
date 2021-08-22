import { SlashCommandBuilder } from '@discordjs/builders'
import { Channel, CommandInteraction, Message, TextChannel } from 'discord.js'

import { Command } from "../interfaces/command.interface"

export default class Ping implements Command {
    name: string = 'ping'
    description: string = 'ping me, baby'
    strArgs: string [] = []

    data: SlashCommandBuilder = new SlashCommandBuilder()
	.setName(this.name)
	.setDescription(this.description);

    enabled: boolean = false;

    async execute(interaction: CommandInteraction) {
        console.log(interaction);
        await interaction.reply('PoNg');
    }

}