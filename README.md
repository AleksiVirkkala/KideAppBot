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

## Introduction

It has always been hard to get tickets to student parties in Tampere Finland. I built the first version of this bot in Septempber 2020 to test my coding skills by building a PWA application that acts as a bot that reserves maximum amount of tickets for a given event. The app went viral which lead me to make part of its private.

This app works with kide.app and therefore requires your Kide.app credentials to work. Apart from that, only event url is needed. I'm planning to make this even more straightforward in the future. As it is a Progressive Web Application it means that you can run it on almost any device that has a browser.

## Usage

1. Head to **[KideAppBot.com](https://kideappbot.com)**
2. Sign in with your **[Kide.app](https://kide.app)** credentials
3. Copy event url from **[Kide.app](https://kide.app)**
   - Each event should start with <https://kide.app/events/>
4. Press **Start** button and watch the bot go 💨

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
