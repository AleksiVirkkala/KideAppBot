# Kide.app Ticket Bot

## Brief

- Ticket bying bot for https://kide.app/ site
- Progressive Web Application
- Build with Vue 2 and Vuetify using Vue CLI

## Purpose

It has always been hard to get tickets for student parties in Tampere Finland. I decided to test my coding skills by building PWA application that acts as a bot that reserves maximum amount of tickets for given event.

This app works with kide.app and it requires your kide.app bearer token. Apart from that, only event url is needed for usage. As it is a Progressive Web Application it means that you can run it on pretty much anything that has a browser.

### Features

- Once setup, only event url is ever needed
- Reserves smartly maximum amount of tickets of each ticket variant for given event
- Handles automatically waiting for ticket sale to begin if it hasn't yet and does previous step on time
- Doesn't bloat the kide.app api with unnecessary requests

### Usage

1. Running the app
   1. Clone repo
   2. requires node.js, run form root directory with `npm run serve`
   3. Navigate to http://localhost:8080/ with browser
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

##### Outputted data

Rows should be pretty self explained

Steps:

1. Parsing input
   - Checks input url and finds `pageId` from it. This means the part after last `/` in event url
2. Checking response
   - Checks what data api gave when requesting with previus `pageId`
   - This determines if sales have started yet or not
     - If they have
       - Lists all different ticket `variants`, their availability and `max-order` amounts
       - Continues to reserving tickets immediately
     - If they have not
       - Starts a timer based on time that is left for sales to start
       - Automatically fetches data again as many times until tickets are available starting from one second before timer runs out
       - Once again ticket variations are found, continues to reserving tickets
3. Reserving ticket
   - Previous step found ticket variants. They have a property `inventoryId` which is required to add ticket to cart
   - We also know how many tickets are in stock and how many are allowed to reserve. Based on these we will do initial reservation request
     - If it fails, program will automatically iterate down till zero
     - If it succeeds and quantity was lower that max allowed quantity it will try to iterate upwards since sometimes server gives availability quantity too low
4. Reserved items
   - Requests info from api of currently reserved items (event variants) which will be listed with name and quantity
   - Below those is total quantity of tickets and total price of cart
5. Process finished
   - Program will inform "Process finished succesfully" and below that log the time it took from the point where tickets were available untill they had been reserved succesfully

### Images

#### Home page example run

![Home page example run](/images/homeRequest.png)

#### Event which tickets are not yet available

![Event which tickets are not yet available](/images/homeRequestWaiting.png)

#### Home page with navigator open

![Home page with navigator open](/images/HomeNavigator.png)

#### Settings page when adding token

![Settings page when adding token](/images/settingsTokenSet.png)
