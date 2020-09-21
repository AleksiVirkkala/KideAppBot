<template>
  <v-container class="mt-6 px-6 px-sm-10">
    <v-row class="text-h4">
      Settings
    </v-row>
    <v-row class="text-subtitle-1 mt-1">
      Define your bearer token here, it will be saved to local storage for later
      use
    </v-row>
    <v-row class="mt-8 flex-nowrap">
      <div class="pr-2 flex-grow-1">
        <v-text-field
          label="Token"
          outlined
          v-model="tokenFieldValue"
          type="password"
        ></v-text-field>
      </div>
      <div class="pl-2">
        <v-btn
          color="primary"
          height="56"
          width="100"
          class="text-none text-subtitle-1 flex-shrink-1"
          @click="setBearerToken"
        >
          Set
        </v-btn>
      </div>
    </v-row>
    <v-row>
      <v-col class="px-0">
        <v-fade-transition>
          <v-alert :type="alert.type" v-show="alert.show">
            {{ alert.content }}
          </v-alert>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      tokenFieldValue: '',
      alert: {
        show: false,
        type: 'success',
        content: ''
      }
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
        this.showAlert({ type: 'error', content: 'Localstorage not available' })
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
    if (window.localStorage && localStorage.getItem('token'))
      this.tokenFieldValue = localStorage.getItem('token')
  }
}
</script>

<style lang="scss" scoped></style>
