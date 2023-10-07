# Kide.app Ticket Bot

**Important!** Kide.app has made changes to their api to prevent botting. This has caused all bots to stop working... For now. **[Read more here](#%EF%B8%8F-new-bot-prevention-measurements-%EF%B8%8F)**.

---

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
  - [❗️ New bot prevention measurements ❗️](#️-new-bot-prevention-measurements-️)
    - [Research for solution](#research-for-solution)
  - [Introduction](#introduction)
  - [Usage](#usage)
  - [Technical details](#technical-details)
    - [Running locally](#running-locally)
    - [Deep dive](#deep-dive)
  - [Contribution](#contribution)
  - [Troubleshooting](#troubleshooting)
    - [Finding your bearer token](#finding-your-bearer-token)

## ❗️ New bot prevention measurements ❗️

On october 2023 Kide.app made changes to their ticket reservation api to make botting tickets harder. Only difference seems to be that it is now required to pass `x-requested-id` header when making reservation. Unfortunately it is unclear where the value for this header comes from.

### Research for solution

| Observation                                                                                                                                                                               | Assumption                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| The header value can not be found in DOM nor inside network requests                                                                                                                      | The value is probably calculated in the browser                                 |
| The header value stays the same between different requests and sessions when reserving tickets for the same ticket variant. However the value is different for different ticket variants. | It seems that the variant id might be used at least partly to calculate this id |

Right now, that's all I know. **If you have more ideas on how to figure out this value, I'd be glad to add them to this list and give you credit.** Once we find the answer, I can add it to the bot.

## Introduction

It has always been hard to get tickets to student parties in Tampere Finland. I built the first version of this bot in Septempber 2020 to test my coding skills by building a PWA application that acts as a bot that reserves maximum amount of tickets for a given event. The app went viral which lead me to make part of its private.

This app works with kide.app and therefore requires your kide.app bearer token to work. Apart from that, only event url is needed. I'm planning to make this even more straightforward in the future. As it is a Progressive Web Application it means that you can run it on almost any device that has a browser.

## Usage

1. Head to **[KideAppBot.com](https://kideappbot.com)**
2. find your bearer token
   1. At <https://kide.app/> (when logged in) open web inspector
   2. Application tab > Local Storage > <https://kide.app>
   3. Copy the value of row that has key _"authorization.token"_, excluding apostrophes
3. Set your kide.app bearer token in app settings.
   - The value will be saved to local storage which means that you won't have to set it again as long as you're using the same device.
4. Copy event url from <https://kide.app/>
   - Each event should start with <https://kide.app/events/>
5. Press _"Start"_ button and watch the bot go

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

1. Navigate to <https://kide.app>, sign in, right click anywhere on the page and select `inspect`
2. Select `Application` tab
3. Open `Local Storage` and under it `https://kide.app`
4. Your bearer token will be _Value_ of _Key_ `authorization.token`. Exclude apostrophes

![Bearer token steps](/.github/images/bearertoken.png)
