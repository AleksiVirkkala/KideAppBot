<template>
  <v-container class="my-2">
    <v-row class="text-h4">
      Settings
    </v-row>
    <v-row class="text-subtitle-1">
      Define your bearer token here, it will be saved to local storage for later
      use
    </v-row>
    <v-row class="mt-10">
      <v-col cols="10" class="pr-4">
        <v-text-field
          label="Token"
          outlined
          v-model="tokenFieldValue"
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
          <v-alert type="success" v-show="showAlert">
            I'm a success alert.
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
      showAlert: false
    }
  },
  methods: {
    setBearerToken() {
      console.log(this.tokenFieldValue)
    }
  }
}
</script>

<style lang="scss" scoped></style>
