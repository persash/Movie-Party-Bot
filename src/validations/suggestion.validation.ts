import { Message } from 'discord.js';
let cfg = require('../../config.json')

export class SuggestionValidation {
    regExp: RegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

    validate(msg: Message) {
        const match = msg.content.match(this.regExp);
        if (match && match[2].length == 11) {
            let title = '';
            let url = '';
            if(msg.content.indexOf('~') > - 1) {
                let split = msg.content.split('~');
                console.log(split);
                title = split[0].trim();
                url = split[1].trim();
            }
            else {
                let urlIndex = msg.content.indexOf('https');
                if (urlIndex > -1) {
                    url = msg.content.trim().substr(urlIndex, msg.content.length - urlIndex);
                }
            }
            if(url && url !== '') {
                console.log(url);
                //Get pinned messages
                msg.channel.messages.fetchPinned().then(pinned => {
                    pinned.forEach(message => {
                        if ((title && title !== '' && message.content.indexOf(title) > -1) || (message.content.indexOf(url) > - 1 || (message.embeds && message.embeds.findIndex(e => e.url.indexOf(url) > -1) > -1)) || (title && title !== '' && message.embeds && message.embeds.findIndex(e => e.title.indexOf(title) > -1) > -1)) {
                            msg.author.send(`The movie you suggested has already been watched. Check ${cfg.moviePartySuggestionChannel} channel pinned messages.`)
                            msg.delete().then(() => {
                            }).catch(e => {console.log(e)});
                            return;
                        }
                    })
                });
                msg.react(cfg.upvoteEmojiId);
            }
         }
         else {
            msg.author.send('Please only suggest movies in this channel with format Title ~ YoutubeUrl or Youtube Url alone. Keep all other discussions and bot commands in the other text channels.')
            msg.delete().then();
         }

    }

}