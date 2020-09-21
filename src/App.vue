<template>
  <v-app>
    <Header />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
  name: 'App',

  components: {
    Header
  },

  data: () => ({})
}
</script>
