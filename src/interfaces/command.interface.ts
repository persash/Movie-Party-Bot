import { Channel, Message } from 'discord.js';

export interface Command {
    name: string;
    description: string;
    strArgs: string [];
    // Making `args` optional
    execute(message: Message, mpsChannel?: Channel, args?: string[]): Promise<any>;
}