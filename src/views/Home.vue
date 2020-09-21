<template>
  <v-container class="mt-6 px-6 px-sm-10">
    <v-row class="text-h5">
      Info
    </v-row>
    <v-row>
      <span class="text-body mt-1">
        The bot will add maximum amount of tickets to your kide.app cart based
        on given event url.
      </span>
    </v-row>
    <v-row>
      <v-col v-show="promtToAddToken" class="px-0 mt-6 mb-n4">
        <v-alert type="error" text>
          Add your bearer token in the settings first
        </v-alert>
      </v-col>
    </v-row>
    <v-form ref="urlField">
      <v-row class="mt-10 ">
        <v-col class="flex-grow-1 pa-0 pr-sm-4">
          <v-text-field
            label="Event URL"
            v-model="eventUrl"
            outlined
            validate-on-blur
            @keydown.enter.prevent="runBot"
            :disabled="promtToAddToken || this.botIsActive"
            :rules="[(value) => !!value || 'Enter value']"
          ></v-text-field>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.xs" cols="12"></v-col>
        <div :class="`d-flex flex-grow-${$vuetify.breakpoint.xs ? 1 : 0} pa-0`">
          <div style="width: 100px;">
            <v-select
              :items="[1, 2, 3, 4, 5]"
              v-model="ticketVariant"
              label="Variant"
              class="pr-4"
              outlined
            ></v-select>
          </div>
          <v-spacer v-if="$vuetify.breakpoint.xs"></v-spacer>
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
      </v-row>
    </v-form>
    <v-row class="mt-4">
      <Output :log-data="logData">
        Log data will be printed here
      </Output>
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
      ticketVariant: 1,
      logValue: '',
      logData: [],
      botIsActive: false
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
        const isPreferredVariant = i + 1 === this.ticketVariant
        this.fullLog({
          msg: (isPreferredVariant ? '-> ' : '') + (i + 1) + '.',
          value: variant.name,
          type: isPreferredVariant ? 't' : ''
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
        msg: "Sales haven't started yet. Waiting... ",
        value: this.secondsToPrettierPrint(seconds),
        type: 'l'
      })
      await this.timeoutLogHelper(seconds)
    },
    async timeoutLogHelper(seconds) {
      if (seconds === 0) return true
      await this.timeout(1000)
      this.fullLog({
        msg: "Sales haven't started, Waiting... ",
        value: this.secondsToPrettierPrint(seconds - 1),
        type: 'l',
        replace: true
      })
      await this.timeoutLogHelper(seconds - 1)
    },
    timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    secondsToPrettierPrint(timestamp) {
      const hours = Math.floor(timestamp / 60 / 60)
      const minutes = Math.floor(timestamp / 60) - hours * 60
      const seconds = timestamp % 60
      return hours + ':' + minutes + ':' + seconds
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
    async tryReserve(body, quantity) {
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
        if (quantity === 1) return
        this.fullLog({
          msg: 'Failed. Trying again with',
          value: quantity - 1 + ' kpl',
          type: 'e'
        })
        await this.tryReserve(body, quantity - 1)
      }
      this.fullLog({
        msg: 'Successfully reserved',
        value: body.toCreate[0].inventoryId,
        type: 's'
      })
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
      this.log('Fetching page info...', 'l')
      const respJson = await this.getPageJson(this.productPageId)
      this.log('Succesfully fetched page info', 's')
      return respJson
    },

    async handlePageJson(pageJson) {
      const product = pageJson.model.product
      let variants = pageJson.model.variants

      this.log('Checking response', 't')
      const timeUntilSalesStart = product.timeUntilSalesStart
      if (!variants || timeUntilSalesStart > 0) {
        await this.timeoutLog(timeUntilSalesStart)
        // const pageJson = await this.handlePageFetch()
        // variants = await this.handlePageJson(pageJson)
        // Add here page refetch
      }
      this.log()
      this.log('Sales have started, finding ticket options...', 'l')
      this.log()
      this.logTicketVariants(variants)
      this.log()

      if (variants.length < this.ticketVariant) {
        this.fullLog({
          msg: "Wanted variant doesn't exist. Falling back to",
          value: 'variant 1',
          type: 'w'
        })
        this.ticketVariant = 1
      }
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

      const resp = await this.tryReserve(body, quantity)
      console.log(resp)
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
      this.logSeparation()
      try {
        const respJson = await this.handlePageFetch()
        this.log()

        // Part 2
        const variants = await this.handlePageJson(respJson)
        this.log()

        // Part 3
        await this.handleReservations(variants)
        this.log()
      } catch (err) {
        if (typeof err === 'object') this.fullLog({ type: 'e', ...err })
        else this.log(err, 'e')
      }
      this.stopBot('Process ended', 't')
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
