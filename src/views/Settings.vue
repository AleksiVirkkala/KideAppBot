<template>
  <v-container class="mt-6">
    <v-row class="text-h4">
      Settings
    </v-row>
    <v-row class="text-subtitle-1 mt-1">
      Define your bearer token here, it will be saved to local storage for later
      use
    </v-row>
    <v-row class="mt-8">
      <v-col cols="10" class="pr-4">
        <v-text-field
          label="Token"
          outlined
          v-model="tokenFieldValue"
          type="password"
        ></v-text-field>
      </v-col>
      <v-col cols="2" class="pl-4">
        <v-btn
          color="primary"
          height="56"
          block
          class="text-none text-subtitle-1"
          @click="setBearerToken"
        >
          Set
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
