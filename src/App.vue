<template>
  <v-app>
    <Header />
    <v-main
      ref="main"
      style="-webkit-overflow-scrolling: touch; height: 100vh; overflow: scroll;"
    >
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
