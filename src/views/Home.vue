<template>
  <v-container
    class="pt-6 px-4 px-sm-6 d-flex flex-column"
    style="height: 100%; padding-bottom: max(calc(env(safe-area-inset-bottom) + 12px), 24px)"
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
        <v-col v-show="promtToAddToken" class="mt-6 mb-n10">
          <v-alert type="error" text>
            Add your bearer token in the settings first
          </v-alert>
        </v-col>
      </v-row>
      <v-form ref="urlField">
        <div class="mt-10 px-1 d-flex flex-wrap-nowrap">
          <div class="flex-grow-1 pa-0 pr-4 pr-xl-10">
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
          <div class="d-flex flex-grow-0 pa-0 pl-4 pr-2 pr-md-0">
            <v-btn
              :color="botIsActive ? 'error' : 'primary'"
              height="56"
              :width="$vuetify.breakpoint.lgAndDown ? 56 : 100"
              :outlined="botIsActive"
              class="text-none text-subtitle-1"
              :disabled="promtToAddToken"
              elevation="0"
              :fab="$vuetify.breakpoint.lgAndDown"
              @click="botIsActive ? (stopRequested = true) : runBot()"
            >
              <!--               <v-icon size="30"></v-icon>
 -->
              <v-icon
                size="30"
                v-text="botIsActive ? 'mdi-close' : 'mdi-play'"
              ></v-icon>
            </v-btn>
          </div>
        </div>
      </v-form>
    </v-container>

    <v-row class="px-4 mt-4 flex-grow-1">
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

const TIMEOUTS = {
  NOEVENTSTIMEOUT: 300,
  PAGEFETCHFAIL: 300,
  LOGSCROLL: 100,
  FAILEDTORESERVE: 200
}

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
      logData: [],
      silentLog: false,
      botIsActive: false,
      startTime: null,
      inventoryIds: [],
      stopRequested: false
    }
  },
  methods: {
    // Logging methods

    log(msg, type, replace) {
      this.fullLog({ msg, type, replace })
    },
    fullLog({ msg, value, type, replace, force }) {
      this.stopIfRequested()
      if (!force && this.silentLog) return
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
        value: elapsedMs + ' ms'
      })
    },
    secondsToPrettierPrint(timestamp) {
      const hours = Math.floor(timestamp / 60 / 60)
      const minutes = Math.floor(timestamp / 60) - hours * 60
      const seconds = timestamp % 60
      return hours + ':' + minutes + ':' + seconds
    },
    async scrollLog() {
      await this.timeout(TIMEOUTS.LOGSCROLL)
      this.$refs?.outputWrapper?.lastElementChild?.lastElementChild?.lastElementChild?.scrollIntoView(
        { behavior: 'smooth', block: 'end' }
      )
    },
    stopIfRequested() {
      if (this.stopRequested) {
        this.stopRequested = false
        this.stopBot()
        throw { msg: 'Process terminated by user', type: 't' }
      }
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
      const res = await fetch(url)
      if (res.status !== 200) throw { message: 'Request Failed' }
      const json = await res.json()
      return json
    },
    async tryReserve(body, quantity, variantName, up = false) {
      if (quantity === 0) {
        this.fullLog({
          msg: 'Variant sold out',
          value: variantName,
          type: 'e'
        })
        this.log()
        return
      }
      body.toCreate[0].quantity = quantity
      const token = localStorage.getItem('token')
      let gotSuccesfulResponse = false
      let response
      let json

      while (!gotSuccesfulResponse) {
        try {
          response = await fetch(
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
          json = await response.json()
          if (json.error) throw json.error
          gotSuccesfulResponse = true
        } catch (err) {
          if (!err) throw err
          if (err.message === 'Failed to fetch') {
            this.fullLog({
              msg: 'Failed to send reservation for',
              value: variantName,
              type: 'e'
            })
          } else if (err.message === 'Request Failed') {
            this.fullLog({
              msg: 'Failed to reserve',
              value: variantName,
              type: 'e'
            })
          } else if (err.message === 'Unexpected end of JSON input') {
            this.fullLog({
              msg: 'Response body missing',
              value: variantName,
              type: 'e'
            })
          } else if (err.type === 3) {
            this.fullLog({
              msg: 'False inventoryId',
              value: variantName,
              type: 'e'
            })
          } else if (err.type === 18 || err.type === 14) {
            this.fullLog({
              msg: 'Qnt too high',
              value: variantName + ' - ' + quantity + ' [code' + err.type + ']',
              type: 'e'
            })
            break
          } else if (err.type === 13) {
            this.fullLog({
              msg: 'Variant not available',
              value: variantName,
              type: 'e'
            })
            return
          } else if (err.type === 46) {
            this.fullLog({
              msg: 'Only one variant can be selected',
              value: variantName,
              type: 'e'
            })
            return
          }
          await this.timeout(TIMEOUTS.FAILEDTORESERVE)
        }
      }

      if (json.error && (json.error.type === 18 || json.error.type === 14)) {
        // Has iterated from down to up and reached error, shouldn't iterate more
        if (up) {
          return
        }
        if (quantity > 1) {
          this.fullLog({
            msg: 'Failed. Trying again with',
            value: quantity - 1 + ' kpl',
            type: 'e'
          })
          await this.tryReserve(body, quantity - 1, variantName)
        }
      } else {
        await this.tryReserve(body, quantity + 1, variantName, true)
      }
    },
    async logReservations() {
      const token = localStorage.getItem('token')
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
      const resArr = overall.reservations.filter(
        (res) => this.inventoryIds.indexOf(res.inventoryId) !== -1
      )
      console.log(overall.reservations)
      this.log()

      if (!resArr || resArr.length === 0)
        throw { msg: "Couldn't reserve any tickets", type: 'e' }

      this.log('Reserved items:', 't')
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
      const respJson = await this.getPageJson(
        kideAppApiUrlBase + this.productPageId
      )
      this.fullLog({
        msg: 'Received response',
        value: respJson?.model?.product?.name,
        type: 's'
      })
      return respJson
    },

    async handleDataGathering() {
      let variants = null
      let timeUntilSalesStart = null
      let salesEnded = null
      let silentLogUpper = false

      do {
        let pageJson
        this.log()
        try {
          pageJson = await this.handlePageFetch()
        } catch (err) {
          if (!err) throw err
          if (err.message === 'Request Failed') {
            // Possibly wrong url
            err.message = 'Failed to fetch event data'
          } else if (err.message === 'Unexpected end of JSON input') {
            // Possibly resp body is missing
          } else if (err.message === 'Failed to fetch') {
            // Possibly offline
          } else {
            throw err
          }
          this.fullLog({
            msg: err.message,
            value: new Date().toGMTString(),
            type: 'e',
            force: true
          })
          await this.timeout(TIMEOUTS.PAGEFETCHFAIL)
          this.silentLog = true
          continue
        }
        this.silentLog = silentLogUpper
        this.log()

        variants = pageJson?.model?.variants
        timeUntilSalesStart = pageJson?.model?.product?.timeUntilSalesStart
        salesEnded = pageJson?.model?.product?.salesEnded

        if (salesEnded) throw { msg: 'Sales have ended', type: 'e' }

        this.log('Checking response', 't')

        if (timeUntilSalesStart > 0) {
          await this.timeoutLog(timeUntilSalesStart - 1) // timeUntilSalesStart - 1
          this.startTime = new Date()
        } else if (!variants || variants.length === 0) {
          this.fullLog({
            msg: 'No variants available',
            type: 'w'
          })
          this.fullLog({
            msg: 'Last response received',
            value: new Date().toISOString(),
            type: 'f',
            replace: this.silentLog,
            force: true
          })
          await this.timeout(TIMEOUTS.NOEVENTSTIMEOUT) // Wait 100ms before retrying to retrieve variants
        }
        silentLogUpper = true
        this.silentLog = true
      } while (
        (!variants || variants.length === 0) &&
        (!timeUntilSalesStart || timeUntilSalesStart > 0)
      )
      this.silentLog = false
      this.log()
      this.log('Sales have started, finding ticket variants...', 'l')
      this.log()
      this.logTicketVariants(variants)
      this.log()

      return variants
    },

    async handleResevation(variant) {
      const inventoryId = variant.inventoryId
      this.inventoryIds.push(inventoryId)
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
      if (this.logData.length > 0) {
        this.logData = []
        await this.timeout(500)
      }
      this.botIsActive = true
      this.startTime = new Date()
      this.logSeparation()
      try {
        const variants = await this.handleDataGathering()
        await this.handleReservations(variants)
        await this.logReservations()
      } catch (err) {
        if (!err) this.log('Undefined error', 'e')
        // Network error
        else if (err.message) {
          this.fullLog({
            msg: err.message,
            type: 'e',
            force: true
          })
        }
        // Custom error
        else if (typeof err === 'object')
          this.fullLog({ type: 'e', ...err, force: true })
        else {
          this.fullLog({
            msg: err,
            type: 'e',
            force: true
          })
        }
      }

      this.stopBot('Process finished succesfully', 't')

      // window.open('https://kide.app/checkout', '_blank')
      this.logElapsedTime()
      console.log(this.inventoryIds)
    },
    stopBot(msg) {
      if (!this.botIsActive) return
      this.log()
      this.log(msg, 't')
      this.botIsActive = false
      this.silentLog = false
    }
  },
  created() {
    if (window.localStorage && !localStorage.getItem('token'))
      this.promtToAddToken = true
  }
}
</script>

<style lang="scss" scoped></style>
