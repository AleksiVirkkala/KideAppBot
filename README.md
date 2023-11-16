# Kide.app Ticket Bot

Ticket reservation bot for **[Kide.app](https://kide.app/)**

Bot is available here: **[KideAppBot.com](https://kideappbot.com)**

Runs locally in your browser

![app-presentation](/.github/images/app-presentation.png)

- Once setup, only event url is needed
- Reserves smartly maximum amount of tickets of each ticket variant for given event (see [activity diagram](#activity-diagram) for details)
- Handles automatically waiting for ticket sale to begin if it hasn't yet
- Doesn't bloat the kide.app api with unnecessary requests

### Table of contents

- [Kide.app Ticket Bot](#kideapp-ticket-bot)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Usage](#usage)
  - [Technical details](#technical-details)
    - [Running locally](#running-locally)
    - [Deep dive](#deep-dive)
  - [Contribution](#contribution)
  - [Troubleshooting](#troubleshooting)
    - [Finding your bearer token](#finding-your-bearer-token)

## Introduction

It has always been hard to get tickets to student parties in Tampere Finland. I built the first version of this bot in Septempber 2020 to test my coding skills by building a PWA application that acts as a bot that reserves maximum amount of tickets for a given event. The app went viral which lead me to make part of its private.

This app works with kide.app and therefore requires your Kide.app bearer token to work. Apart from that, only event url is needed. I'm planning to make this even more straightforward in the future. As it is a Progressive Web Application it means that you can run it on almost any device that has a browser.

## Usage

1. Get your [Kide.app](https://kide.app) bearer token. **[See instructions](#finding-your-bearer-token)**
2. Head to **[KideAppBot.com](https://kideappbot.com)**
3. Set your kide.app bearer token in **[app settings](https://kideappbot.com/settings)**
   - The token will be saved to local storage which means that you won't have to set it again as long as you're using the same device and the token hasn't expired
4. Copy event url you want tickets to from **[Kide.app](https://kide.app/events)**
   - Each event should start with `https://kide.app/events/`
5. Press **Start** button and watch the bot go 💨

## Technical details

This is the third major version of the bot. It is a monorepo that uses PNPM workspaces and turborepo to manage the project. The project is made modular using PNPM workspaces which means that different parts of the application are split to their own reusable packages.

- Monorepo using [PNPM workspaces](https://pnpm.io/workspaces) + [turborepo](https://turbo.build/repo/docs/reference/command-line-reference)
- Frontend: [SvelteKit](https://kit.svelte.dev/) + [Skeleton](https://www.skeleton.dev/)

### Running locally

Note: If you only want to use the bot this section is not necessary!

1. Clone the repo and install with `pnpm install`
   - requires PNPM package manager
2. Run from root directory with `pnpm dev`
3. Navigate to <http://localhost:8080/> with browser
4. Follow the instructions in the **[usage](#usage)**

### Deep dive

Here is some information about how the project is structured and how the bot works.

Project dependency structure:

![Project dependency graph](/.github/images/project-graph.png)

Activity diagram:

![Bot activity diagram](/.github/images/botactivitydiagram.jpg)

## Contribution

Feel free to contribute! I'm workign on open sourcing as much as possible and making the project in general maintainable and well documented.

The project uses Conventional Commits, see: [conventionalcommits.com](https://www.conventionalcommits.org/en/v1.0.0/)

## Troubleshooting

### Finding your bearer token

1. Navigate to **[Kide.app](https://kide.app)**, sign in, right click anywhere on the page and select `inspect`
2. Select `Application` tab
3. Open `Local Storage` and under it `https://kide.app`
4. Copy the _Value_ of _Key_ `authorization.token`
   - Example value: `"WARNING: Copying and giving this value to any person/service severely compromises your account and may lead to you losing it permanently! <TOKEN>"`
   - **You should be aware of the text above and always be cautious when using your token!**
5. Copy your **token** from previously copied text
   - The token is the last part of this text indicated by `<TOKEN>` in above example
   - For you it is a long combination of random letters and numbers. Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

![Bearer token steps](/.github/images/bearertoken.png)
