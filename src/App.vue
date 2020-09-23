<template>
  <v-app>
    <Header />
    <v-main ref="main">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Header from '@/components/Header.vue'
import { disableBodyScroll } from 'body-scroll-lock'

export default {
  name: 'App',

  components: {
    Header
  },

  data: () => ({}),
  mounted() {
    disableBodyScroll(this.$refs.main.$el)
  }
}
</script>

<style>
.v-main {
  -webkit-overflow-scrolling: touch;
  height: 0px; /* Magic number. Works properly only with 0px */
  overflow-y: scroll;
  padding-left: env(safe-area-inset-left) !important;
  padding-right: env(safe-area-inset-right) !important;
}
</style>
