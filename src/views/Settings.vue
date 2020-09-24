<template>
  <v-container class="pt-6 px-8 px-sm-10" style="padding-bottom: max(calc(env(safe-area-inset-bottom) + 12px), 24px)">
    <v-row class="text-h5" align="center">
      Settings
      <span class="ml-auto text-body-1 text--disabled">{{ versionNumber }}</span>
    </v-row>
    <v-row class="text-subtitle-1 mt-1">
      Define your bearer token here, it will be saved to local storage for later use
    </v-row>
    <v-row class="mt-8 flex-nowrap">
      <div class="pr-2 flex-grow-1">
        <v-text-field label="Token" outlined v-model="tokenFieldValue" type="password"></v-text-field>
      </div>
      <div class="pl-2">
        <v-btn
          color="primary"
          height="56"
          width="100"
          class="text-none text-subtitle-1 flex-shrink-1"
          @click="setBearerToken"
          elevation="0"
          >Set</v-btn
        >
      </div>
    </v-row>
    <v-row>
      <v-col class="pa-0">
        <v-fade-transition>
          <v-alert :type="alert.type" v-show="alert.show">
            {{ alert.content }}
          </v-alert>
        </v-fade-transition>
      </v-col>
    </v-row>
    <v-row class="pa-0 mx-n8">
      <v-expansion-panels flat>
        <v-expansion-panel>
          <v-expansion-panel-header class="text-h5">What is this?</v-expansion-panel-header>
          <v-expansion-panel-content eager>
            <div class="text-h6 mt-5">What is a bearer token?</div>
            <div>
              In short, bearer token is a key that acts as an identifier to tell the Kide.app server who is asking to
              reserve tickets. It is therefore mandatory so that the bot will be able to reserve tickets to your account
            </div>
            <div class="text-h6 mt-5">How do I find my bearer token?</div>
            <div>
              <ol>
                <li>
                  Navigate to
                  <a href="https://kide.app" rel="nofollow">https://kide.app</a>, sign in, right click anywhere on the
                  page and select
                  <code>inspect</code>
                </li>
                <li>
                  Select
                  <code>Application</code> tab
                </li>
                <li>
                  Open
                  <code>Local Storage</code> and under it
                  <code>https://kide.app</code>
                </li>
                <li>
                  Your bearer token will be
                  <em>Value</em> of
                  <em>Key</em>
                  <code>authorization.token</code>
                  . Exclude apostrophes
                </li>
              </ol>
              <br />
            </div>
            <div>
              More detailed description of this bot is available on
              <v-btn
                text
                class="text-none ml-2"
                href="https://github.com/AleksiVirkkala/KideAppBot"
                target="_blanc"
                color="primary"
                outlined
              >
                <v-icon>mdi-github</v-icon>github
              </v-btn>
            </div>
            <v-img eager src="@/assets/bearertoken.png"></v-img>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script>
import { version } from '../../package.json'

export default {
  name: 'Settings',
  data() {
    return {
      tokenFieldValue: '',
      alert: {
        show: false,
        type: 'success',
        content: ''
      },
      versionNumber: version
    }
  },
  methods: {
    showAlert({ type, content }) {
      this.alert = { ...this.alert, show: true, type, content }
    },
    setBearerToken() {
      if (!this.tokenFieldValue) {
        this.showAlert({ type: 'error', content: 'Enter value' })
        return
      }
      if (!('localStorage' in window)) {
        this.showAlert({
          type: 'error',
          content: 'Localstorage not available'
        })
        return
      }
      const currentToken = localStorage.getItem('token')
      if (currentToken) localStorage.removeItem('token')
      localStorage.setItem('token', this.tokenFieldValue)
      this.showAlert({
        type: 'success',
        content: 'Succesfully added to local storage'
      })
    }
  },
  mounted() {
    if (window.localStorage && localStorage.getItem('token')) this.tokenFieldValue = localStorage.getItem('token')
  }
}
</script>
