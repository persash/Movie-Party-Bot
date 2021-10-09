# Discord Movie Party Bot

A discord bot to make movie party decisions easier, organized, and informative for your server.

## Features

- Show most upvoted suggestion
- Gives info, imdb rating and which platforms/streaming service a movie is available on
- Users can search for youtube trailers and suggest them to the mps text channel
- Pick a random movie suggestion by letting the bot choose one from mps text channel
- Post a random gif based on a search term. Annoy your friends with them sick gif movie references. May the odds be ever in your favor.
- Post a random fact from a specific or random movie. Become a know it all on your server.

## Requirements

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/) (optional)

## Getting started

First, make sure you have all the required tools installed on your local machine then continue with these steps.

### Installation

```bash
# Clone the repository
git clone url

# Enter into the directory
cd discord-bot/

# Install the dependencies
npm install
```
### Configuration

Rename example_config.json to config.json

After cloning the project and installing all dependencies, you need to add your Discord API token and YouTube API KEY in the config.json file.


You also will need to configure the following fields in config.json custom to your server.

```bash

# the channel that will contain all of your server's movie suggestions and only suggestions.
"moviePartySuggestionChannel": "movie-party-suggestions",
# emoji you want your users to use to vote on suggestions in the movie suggestion channel
"upvoteEmoji": "upvote",
```

### Starting the discord bot

```bash

npm build

npm start
```

### Starting the bot using Docker

```bash
# Build the image
docker build --tag discordbot .

# Run the image
docker run -d discordbot
```

## Other Info

Every command will need to start with !mpsb.

The `suggest` command requires a youtube api key to be able to search for movie trailers. You can acquire one on the official [Youtube Data Api website](https://developers.google.com/youtube/v3).

The `gif` command will require a tenor api key. [Tenor API](https://tenor.com/gifapi)

The Bot will remove any message in movie party suggestion channel that is not a youtube url and inform the original author of the message.

Discord server moderators will need to pin movie suggestions in the movie party suggestion channel to keep track what has been watched to help the bot do its job. In the future, I might add a `select` command for server admins so they dont have to do it manually.

This bot uses slash commands so make sure your bot has the application permission on the server.