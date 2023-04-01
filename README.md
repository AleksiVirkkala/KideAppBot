# Kide.app Ticket Bot

Note: Images of the UI are currently outdated. However the functionality is the same.

![Use cases](/docs/images/scalability.png)

## Public version!

Woohoo!! there's a public release ready for testing:

- [https://AleksiVirkkala.com](https://AleksiVirkkala.com)
- **NOTE: This new version sends your bearer token to my server that then uses it to reserve tickets from KideApp.** I will never store your bearer token nor use it for anything else than reserving the tickets. By using the bot you agree to this

---

## Brief

- Ticket bying bot for https://kide.app/ site
- Monorepo using [PNPM workspaces](https://pnpm.io/workspaces) + [turborepo](https://turbo.build/repo/docs/reference/command-line-reference)
- Frontend: React + MUI
- Backend build with [TRPC](https://trpc.io/) + Typescript
- Realtime communication between Frontend and Backend using [TRPC WebSocket subscriptions](https://trpc.io/docs/subscriptions)

It has always been hard to get tickets for student parties in Tampere Finland. I built the first version of this bot in Septempber 2020 to test my coding skills by building PWA application that acts as a bot that reserves maximum amount of tickets for given event. The app went viral which lead me to make parts of it private.

This is the second version of the bot. It is a monorepo that uses PNPM workspaces and turborepo to manage the project. It has a frontend and a backend. They communicate through TRPC Subscriptions using websockets. The project is made modular through workspaces which means that different parts of the application are split to their own reusable packages.

This app works with kide.app and it requires your kide.app bearer token. Apart from that, only event url is needed for usage. I'm planning to make this even more straightforward in the future. As it is a Progressive Web Application it means that you can run it on pretty much anything that has a browser.

### Features

- Once setup, only event url is ever needed
- Reserves smartly maximum amount of tickets of each ticket variant for given event (see activity diagram for details)
- Handles automatically waiting for ticket sale to begin if it hasn't yet and does previous step on time
- Doesn't bloat the kide.app api with unnecessary requests

### Common problems

#### Finding your bearer token

1. Navigate to https://kide.app, sign in, right click anywhere on the page and select `inspect`
2. Select `Application` tab
3. Open `Local Storage` and under it `https://kide.app`
4. Your bearer token will be _Value_ of _Key_ `authorization.token`. Exclude apostrophes

![Bearer token steps](/docs/images/bearertoken.png)

### Usage

#### Easy way

1. Head to [https://AleksiVirkkala.com](https://AleksiVirkkala.com)
2. find your bearer token
   1. At https://kide.app/ (when logged in) open web inspector
   2. Application tab > Local Storage > https://kide.app
   3. Copy the value of row that has key _"authorization.token"_, excluding apostrophes
3. Set your kide.app bearer token in app settings.
   - The value will be saved to local storage which means that you won't have to set it again as long as the url stays the same and you are using that same device.
4. Copy event url from https://kide.app/
   - Each event should start with https://kide.app/events/
5. Press _"Run"_ button and watch the bot go

#### Running locally

Note: If you only want to use the bot this section is not necessary!

1. Clone the repo and install with `pnpm install`
   - requires PNPM package manager
2. Run from root directory with `pnpm dev`
3. Navigate to http://localhost:8080/ with browser
4. Follow the instructions in the **[easy way](#easy-way)**

### Deep dive

Here is some information about how the project is structured and how the bot works.

#### Project structure

![Project graph](/docs/images/project-graph.png)

#### Activity diagram

![Bot activity diagram](/docs/images/botactivitydiagram.jpg)

## Contribution

Feel free to contribute to the project, I'm workign on open sourcing as much as possible and making the project in general maintainable and well documented.

The project uses Conventional Commits, see: https://www.conventionalcommits.org/en/v1.0.0/
