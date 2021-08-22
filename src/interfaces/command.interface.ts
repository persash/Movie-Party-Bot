import { SlashCommandBuilder } from '@discordjs/builders';
import { Channel, CommandInteraction, Message } from 'discord.js';

export interface Command {
    name: string;
    description: string;
    strArgs: string [];
    enabled: boolean;

    data: SlashCommandBuilder;

    // Making `args` optional
    execute(interaction: CommandInteraction): Promise<any>;
}