import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, ChatInputCommandInteraction} from 'discord.js';

export interface Command {
    name: string;
    description: string;
    strArgs: string [];
    enabled: boolean;

    data: SlashCommandBuilder;

    // Making `args` optional
    execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<any>;
}