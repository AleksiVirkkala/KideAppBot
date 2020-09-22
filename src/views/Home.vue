<template>
  <v-container
    class="pt-6 px-4 pb-12 px-sm-6 d-flex flex-column"
    style="height: 100%;"
  >
    <v-container class="flex-grow-0 pa-0">
      <v-row class="text-h5 px-4">
        Info
      </v-row>
      <v-row>
        <span class="text-body mt-1 px-4">
          The bot will add maximum amount of tickets to your kide.app cart based
          on given event url.
        </span>
      </v-row>
      <v-row>
        <v-col v-show="promtToAddToken" class="mt-6 mb-n4">
          <v-alert type="error" text>
            Add your bearer token in the settings first
          </v-alert>
        </v-col>
      </v-row>
      <v-form ref="urlField">
        <div class="mt-10 px-1 d-flex flex-wrap-nowrap">
          <div class="flex-grow-1 pa-0 pr-2">
            <v-text-field
              label="Event URL"
              v-model="eventUrl"
              outlined
              validate-on-blur
              @keydown.enter.prevent="runBot"
              :disabled="promtToAddToken || this.botIsActive"
              :rules="[(value) => !!value || 'Enter value']"
            ></v-text-field>
          </div>
          <div class="d-flex flex-grow-0 pa-0 pl-2">
            <v-btn
              color="primary"
              height="56"
              width="100"
              class="text-none text-subtitle-1"
              :disabled="promtToAddToken || this.botIsActive"
              elevation="0"
              @click="runBot"
            >
              Activate
            </v-btn>
          </div>
        </div>
      </v-form>
    </v-container>

    <v-row class="px-4 flex-grow-1">
      <div
        style="overflow: hidden; position: relative; width: 100%;"
        ref="outputWrapper"
      >
        <Output :log-data="logData">
          Log data will be printed here
        </Output>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import Output from '@/components/Output.vue'

const KideAppUrlBase = 'https://kide.app/events/'
const kideAppApiUrlBase = 'https://api.kide.app/api/products/'

export default {
  name: 'Home',
  components: {
    Output
  },
  data() {
    return {
      promtToAddToken: false,
      eventUrl: '',
      productPageId: '',
      logValue: '',
      logData: [],
      botIsActive: false,
      startTime: null
    }
  },
  methods: {
    // Logging methods

    log(msg, type, replace) {
      this.fullLog({ msg, type, replace })
    },
    fullLog({ msg, value, type, replace }) {
      if (replace) this.logData.pop()
      this.logData.push({
        msg,
        value,
        type
      })
      this.scrollLog()
    },
    logSeparation() {
      if (this.logData.length !== 0) {
        this.log()
        this.log('----------')
        this.log()
      }
    },

    logTicketVariants(variants) {
      if (!variants || variants.length === 0) throw 'No variants available'
      variants.forEach((variant, i) => {
        this.fullLog({
          msg: i + 1 + '.',
          value: variant.name
        })
        this.fullLog({
          msg: 'Availability: ',
          value: variant.availability + ' kpl',
          type: 'b'
        })
        this.fullLog({
          msg: 'Max-order: ',
          value: variant.productVariantMaximumReservableQuantity + ' kpl',
          type: 'b'
        })
      })
    },

    // Other helper methods

    async timeoutLog(seconds) {
      this.fullLog({
        msg: 'Time until sales start... ',
        value: this.secondsToPrettierPrint(seconds),
        type: 'l'
      })
      await this.timeoutLogHelper(seconds)
    },
    async timeoutLogHelper(seconds) {
      if (seconds === 0) return true
      await this.timeout(1000)
      this.fullLog({
        msg: 'Time until sales start... ',
        value: this.secondsToPrettierPrint(seconds - 1),
        type: 'l',
        replace: true
      })
      await this.timeoutLogHelper(seconds - 1)
    },
    timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    logElapsedTime() {
      const currTime = new Date()
      const elapsedMs = currTime - this.startTime
      this.fullLog({
        msg: 'Time elapsed:',
        value: elapsedMs - 2000 + ' ms'
      })
    },
    secondsToPrettierPrint(timestamp) {
      const hours = Math.floor(timestamp / 60 / 60)
      const minutes = Math.floor(timestamp / 60) - hours * 60
      const seconds = timestamp % 60
      return hours + ':' + minutes + ':' + seconds
    },
    async scrollLog() {
      await this.timeout(100)
      this.$refs?.outputWrapper?.lastElementChild?.lastElementChild?.lastElementChild?.scrollIntoView(
        { behavior: 'smooth', block: 'end' }
      )
    },

    // Step related methods

    parsePageId() {
      const url = this.eventUrl
      if (!url.includes(KideAppUrlBase))
        throw { msg: 'URL should start with: ', value: KideAppUrlBase }

      const idExists = !!url[KideAppUrlBase.length]
      if (!idExists) throw "Couldn't parse productPageId from given URL"

      return url.substr(
        KideAppUrlBase.length,
        url.length - KideAppUrlBase.length
      )
    },
    async getPageJson(url) {
      try {
        const res = await fetch(kideAppApiUrlBase + url)
        const json = await res.json()
        return json
      } catch (err) {
        console.log(err)
      }
    },
    async tryReserve(body, quantity, variantName, up = false) {
      body.toCreate[0].quantity = quantity
      const token = localStorage.getItem('token')

      const response = await fetch(
        'https://api.kide.app/api/reservations/batched',
        {
          method: 'post',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            referer: 'https://kide.app/events/' + this.productPageId,
            authorization: 'Bearer ' + token
          }
        }
      )
      const json = await response.json()
      if (json.error) {
        // Has iterated from down to up and reached error, shouldn't iterate more
        if (up) {
          return
        }
        if (quantity <= 1) {
          this.fullLog({
            msg: 'Variant sold out',
            value: variantName,
            type: 'e'
          })
          return
        }
        this.fullLog({
          msg: 'Failed. Trying again with',
          value: quantity - 1 + ' kpl',
          type: 'e'
        })
        await this.tryReserve(body, quantity - 1, variantName)
      } else {
        this.tryReserve(body, quantity + 1, variantName, true)
      }
    },
    async logReservations() {
      const token = localStorage.getItem('token')
      this.log(
        'All done, waiting a little to get accurate response from api',
        'l'
      )
      await this.timeout(2000)
      const response = await fetch('https://api.kide.app/api/reservations', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          referer: 'https://kide.app/events/' + this.productPageId,
          authorization: 'Bearer ' + token
        }
      })
      const json = await response.json()
      const overall = json.model
      const resArr = overall.reservations
      this.log()
      this.log('Reserved items:', 't')
      console.log(json)
      resArr.forEach((res) => {
        this.fullLog({
          msg: 'Variant:',
          value: res.variantName + ' - ' + res.reservedQuantity + ' kpl',
          type: 's'
        })
      })
      this.log()
      this.fullLog({
        msg: '🎫 Total quantity:',
        value: overall.reservationsCount
      })
      const totalPrice = overall.finalPrice + ''
      console.log(totalPrice)
      const formattedPrice =
        totalPrice.slice(0, totalPrice.length - 2) +
        '.' +
        totalPrice.slice(totalPrice.length - 2) +
        '€'
      this.fullLog({
        msg: '💲 Total price:',
        value: formattedPrice
      })
      //
    },

    // Different stages

    async handlePageFetch() {
      this.log('Parsing input', 't')
      this.productPageId = this.parsePageId()
      this.log()
      this.fullLog({
        msg: 'Parsed pageId: ',
        value: this.productPageId,
        type: 's'
      })
      this.log('Fetching page info...', 'f')
      const respJson = await this.getPageJson(this.productPageId)
      this.log('Received page data', 's')
      return respJson
    },

    async handleDataGathering() {
      let variants = null
      let timeUntilSalesStart = null

      do {
        this.log()
        const pageJson = await this.handlePageFetch()
        this.log()
        variants = pageJson.model.variants
        timeUntilSalesStart = pageJson.model.product.timeUntilSalesStart

        this.log('Checking response', 't')
        if ((!variants || variants.length === 0) && timeUntilSalesStart > 0) {
          await this.timeoutLog(timeUntilSalesStart - 1) // timeUntilSalesStart - 1
          this.startTime = new Date()
        }
      } while ((!variants || variants.length === 0) && timeUntilSalesStart > 0)
      this.log()
      this.log('Sales have started, finding ticket variants...', 'l')
      this.log()
      this.logTicketVariants(variants)
      this.log()

      return variants
    },

    async handleResevation(variant) {
      const inventoryId = variant.inventoryId
      let quantity = Math.min(
        variant.productVariantMaximumReservableQuantity,
        variant.availability
      )

      const body = {
        toCreate: [
          {
            inventoryId: inventoryId,
            quantity: quantity
          }
        ],
        toCancel: null
      }

      this.log('Reserving ticket', 't')
      this.log()

      this.fullLog({
        msg: 'Variant',
        value: variant.name
      })
      this.fullLog({
        msg: 'inventoryId:',
        value: inventoryId,
        type: 'b'
      })
      this.fullLog({
        msg: 'Amount:',
        value: quantity,
        type: 'b'
      })
      this.log()
      this.log('Sending reservation...', 'l')
      this.log()

      await this.tryReserve(body, quantity, variant.name)
    },

    async handleReservations(variants) {
      let reservationRequests = []
      variants.forEach((variant) => {
        reservationRequests.push(this.handleResevation(variant))
      })
      await Promise.all(reservationRequests)
    },

    // Main method

    async runBot() {
      if (!this.$refs.urlField.validate()) return
      this.botIsActive = true
      this.startTime = new Date()
      this.logSeparation()
      try {
        const variants = await this.handleDataGathering()
        this.log()
        await this.handleReservations(variants)
        this.log()
        await this.logReservations()
      } catch (err) {
        if (typeof err === 'object') this.fullLog({ type: 'e', ...err })
        else this.log(err, 'e')
      }
      this.stopBot('Process finished succesfully', 't')
      this.logElapsedTime()
    },
    stopBot(msg) {
      if (!this.botIsActive) return
      this.log()
      this.log(msg, 't')
      this.botIsActive = false
    }
  },
  created() {
    if (window.localStorage && !localStorage.getItem('token'))
      this.promtToAddToken = true
  }
}
</script>

<style lang="scss" scoped></style>
