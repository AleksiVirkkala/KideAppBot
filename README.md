# Kide.app Ticket Bot

![Use cases](/images/scalability.png)

-----

## Update
I have decided to move code related to the bot-logic to [private submodule](https://github.com/AleksiVirkkala/KideAppBot/tree/master/src/mixins) to avoid it spreading uncontrollably. Running the local environment as explained below will cause errors. 

I might make a public version available later which would communicate with api managed by me. That way it'd be possible to shut it down if necessary. I don't have time for that atm though.

-----

## Brief

- Ticket bying bot for https://kide.app/ site
- Progressive Web Application
- Build with Vue 2 and Vuetify using Vue CLI

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

1. Running the app
   1. Clone repo **with submodules**
       - **IMPORTANT** I have decided to move code related to the bot-logic to [private submodule](https://github.com/AleksiVirkkala/KideAppBot/tree/master/src/mixins) to avoid it spreading uncontrollably
   3. requires node.js, run form root directory with `npm run serve`
   4. Navigate to http://localhost:8080/ with browser
2. Click tree dots from top right corner and select settings
3. find your bearer token
   1. At https://kide.app/ (when logged in) open web inspector
   2. Application tab > Local Storage > https://kide.app
   3. Copy the value of row that has key _"authorization.token"_, excluding apostrophes
4. Set your kide.app bearing token in app settings.
   - The value will be saved to local storage which means that you won't have to set it again as long as the url stays the same and you are using that same device.
   - Green prompt will inform of succesfull saving
5. Switch to home page
   - Fields should now be enabled
6. Copy event url from https://kide.app/
   - Each event should start with https://kide.app/events/
7. Press _"Activate"_ button and watch the bot go

### Deeper details

#### Activity diagram

![Bot activity diagram](/images/botactivitydiagram.jpg)
