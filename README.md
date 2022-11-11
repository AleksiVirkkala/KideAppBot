# Kide.app Ticket Bot

Note: Images of the UI are currently outdated. However the functionality is the same.

![Use cases](/images/scalability.png)

## Public version!

Woohoo!! there's a public release ready for testing:

- [https://AleksiVirkkala.com](https://AleksiVirkkala.com)
- **NOTE: This new version sends your bearer token to my server that then uses it to reserve tickets from KideApp.** I will never store your bearer token nor use it for anything else than reserving the tickets. By using the bot you agree to this

---

## Brief

- Ticket bying bot for https://kide.app/ site
- Progressive Web Application
- Frontend build with React and MUI
- Backend build with Express + Typescript
- Realtime communication between Frontend and Backend using Socket.IO

It has always been hard to get tickets for student parties in Tampere Finland. I decided to test my coding skills by building PWA application that acts as a bot that reserves maximum amount of tickets for given event.

This app works with kide.app and it requires your kide.app bearer token. Apart from that, only event url is needed for usage. As it is a Progressive Web Application it means that you can run it on pretty much anything that has a browser.

### Features

- Once setup, only event url is ever needed
- Reserves smartly maximum amount of tickets of each ticket variant for given event
- Handles automatically waiting for ticket sale to begin if it hasn't yet and does previous step on time
- Doesn't bloat the kide.app api with unnecessary requests

### Common problems

#### Finding your bearer token

1. Navigate to https://kide.app, sign in, right click anywhere on the page and select `inspect`
2. Select `Application` tab
3. Open `Local Storage` and under it `https://kide.app`
4. Your bearer token will be _Value_ of _Key_ `authorization.token`. Exclude apostrophes

![Bearer token steps](/images/bearertoken.png)

### Usage

#### Easy way

1. Head to [https://AleksiVirkkala.com](https://AleksiVirkkala.com)
2. find your bearer token
   1. At https://kide.app/ (when logged in) open web inspector
   2. Application tab > Local Storage > https://kide.app
   3. Copy the value of row that has key _"authorization.token"_, excluding apostrophes
3. Set your kide.app bearing token in app settings.
   - The value will be saved to local storage which means that you won't have to set it again as long as the url stays the same and you are using that same device.
   - Green prompt will inform of succesfull saving
4. Copy event url from https://kide.app/
   - Each event should start with https://kide.app/events/
5. Press _"Run"_ button and watch the bot go

#### Running locally

Note: If you want to only use the bot this section is unnecessary for you

1. Clone the repo and install with `npm install`
   1. requires node.js,
2. Run from root directory with `npm run dev`
3. Navigate to http://localhost:8080/ with browser
4. Follow the instructions in the **[easy way](#easy-way)** section

### Deeper details

#### Activity diagram

![Bot activity diagram](/images/botactivitydiagram.jpg)
