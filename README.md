# Discord Movie Party Suggestion Bot

A discord bot to make movie party decisions much easier and informative for your server.

## Features

- Show most upvoted suggestion
- Gives info on imdb rating and which platforms a movie is available on
- Find youtube trailers and suggest them to the server
- Pick a random movie suggested by the discord users

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

The `suggest` command requires a youtube api key to be able to search for movie trailers. You can acquire one on the official [Youtube Data Api website](https://developers.google.com/youtube/v3).

The Bot will remove any message in movie party suggestion channel that is not a youtube url and inform the original user.

Discord Server moderators will need to pin movies to the movie party suggestion channel to keep track what has been watched and to help the bot do its job.