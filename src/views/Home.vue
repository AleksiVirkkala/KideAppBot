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
  </v-container>
</template>

<script>
const kideAppBaseUrl = 'https://kide.app/events/'

export default {
  name: 'Home',
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
      if (!url.includes(kideAppBaseUrl)) {
        this.stopBot('URL should start with: "' + kideAppBaseUrl + '"', 'e')
        return
      }
      const idExists = !!url[kideAppBaseUrl.length]
      if (!idExists) {
        this.stopBot("Couldn't parse productPageId from given URL", 'e')
        return null
      }
      return url.substr(
        kideAppBaseUrl.length,
        url.length - kideAppBaseUrl.length
      )
    },

    // Bot state modifying methods

    async startBot() {
      if (!this.$refs.urlField.validate()) return
      this.botIsActive = true
      this.logSeparation()
      const productPageId = this.parsePageId()
      if (!productPageId) return
      this.stopBot(productPageId)
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
