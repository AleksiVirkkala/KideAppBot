<template>
  <v-app>
    <Header />
    <v-main>
      <div style="height: 100%; width: 100%;">
        <router-view></router-view>
      </div>
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
