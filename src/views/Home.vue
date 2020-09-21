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
      <Output></Output>
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
      botIsActive: false
    }
  },
  methods: {
    // Logging methods

    log(text = '', type, replace) {
      let prefix = this.logValue ? '\n' : ''
      if (type === 'e') prefix += '❌ '
      else if (type === 'w') prefix += '⚠️ '
      else if (type === 's') prefix += '✅ '
      else if (type === 'l') prefix += '⌛ '

      if (replace) {
        this.logValue = this.logValue.substr(0, this.logValue.lastIndexOf('\n'))
      }

      this.logValue += prefix + text
    },
    logSeparation() {
      if (this.logValue) {
        this.log()
        this.log('----------')
        this.log()
      }
    },

    // Other helper methods

    parsePageId() {
      const url = this.eventUrl
      if (!url.includes(KideAppUrlBase))
        throw 'URL should start with: "' + KideAppUrlBase + '"'

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

    // Bot state modifying methods

    async startBot() {
      if (!this.$refs.urlField.validate()) return
      this.botIsActive = true
      this.logSeparation()
      try {
        this.log('1. Parsing input')
        const productPageId = this.parsePageId()
        this.log('Parsed pageId: ' + productPageId, 's')
        this.log('Fetching page info...', 'l')
        const respJson = await this.getPageJson(productPageId)
        this.log('Succesfully fetched page info', 's')
        console.log(respJson)
      } catch (err) {
        this.stopBot(err)
      }
      this.stopBot()
    },
    stopBot(msg, type) {
      this.log(msg, type)
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
