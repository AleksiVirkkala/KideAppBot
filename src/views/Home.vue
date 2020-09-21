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
    <v-row class="mt-10 flex-nowrap">
      <div class="pr-2 flex-grow-1">
        <v-text-field
          label="Event URL"
          outlined
          :disabled="promtToAddToken"
        ></v-text-field>
      </div>
      <div class="pl-2">
        <v-btn
          color="primary"
          height="56"
          width="100"
          class="text-none text-subtitle-1 flex-shrink-1"
          :disabled="promtToAddToken"
          elevation="0"
        >
          Activate
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
  name: 'Home',
  data() {
    return {
      promtToAddToken: false,
      alert: {
        show: false,
        type: 'success',
        content: ''
      }
    }
  },
  created() {
    if (window.localStorage && !localStorage.getItem('token'))
      this.promtToAddToken = true
  }
}
</script>

<style lang="scss" scoped></style>
