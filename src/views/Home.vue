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
      <v-row class="mt-10 flex-nowrap">
        <div class="pr-2 flex-grow-1">
          <v-text-field
            label="Event URL"
            v-model="eventUrl"
            outlined
            validate-on-blur
            @keydown.enter.prevent="startBot"
            :disabled="promtToAddToken || this.botIsActive"
            :rules="[(value) => !!value || 'Enter value']"
          ></v-text-field>
        </div>
        <div class="pl-2">
          <v-btn
            color="primary"
            height="56"
            width="100"
            class="text-none text-subtitle-1 flex-shrink-1"
            :disabled="promtToAddToken || this.botIsActive"
            elevation="0"
            @click="startBot"
          >
            Activate
          </v-btn>
        </div>
      </v-row>
    </v-form>
    <v-row class="mt-4">
      <v-textarea
        filled
        name="ProgressLog"
        label="Progress log"
        v-model="logValue"
        auto-grow
        outlined
        readonly
      ></v-textarea>
    </v-row>
    <v-row>
      <Output :log-data="logData" />
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
      console.log(replace)
      if (replace) this.logData.pop()
      console.log(this.logData)
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

    // Other helper methods

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
    async logTimeOut(length) {
      this.fullLog({
        msg: 'Waiting... ',
        value: `${length}`,
        type: 'l'
      })
      await this.logTimeOutHelper(length)
    },
    async logTimeOutHelper(length) {
      if (length === 0) return true
      await this.timeout(1000)
      this.fullLog({
        msg: 'Waiting... ',
        value: `${length - 1}`,
        type: 'l',
        replace: true
      })
      await this.logTimeOutHelper(length - 1)
    },
    timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },

    // Bot state modifying methods

    async startBot() {
      if (!this.$refs.urlField.validate()) return
      this.botIsActive = true
      this.logSeparation()
      try {
        this.log('1. Parsing input', 't')
        const productPageId = this.parsePageId()
        this.fullLog({
          msg: 'Parsed pageId: ',
          value: productPageId,
          type: 's'
        })
        this.log('Fetching page info...', 'l')

        // Part 2

        const respJson = await this.getPageJson(productPageId)
        this.log('Succesfully fetched page info', 's')
        const timeUntilSalesStart = respJson.model.product.timeUntilSalesStart
        if (timeUntilSalesStart !== 0) {
          this.log('Sales are active, finding ticket options...', 'l')
        } else {
          this.fullLog({
            msg: 'Time until sales start: ',
            value: '' + timeUntilSalesStart,
            type: 'w'
          })
          this.log('Waiting...', 'l')
        }
        console.log(respJson)
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
