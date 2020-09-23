<template>
  <v-app-bar
    flat
    absolute
    app
    color="primary"
    class="px-1"
    dark
    v-resize="reSetSafeArea"
    :height="56 + safeAreaTop"
    style="z-index: 100;"
  >
    <div class="d-flex fill-height flex-grow-1 align-end mx-n4 mx-sm-n2">
      <div class="d-flex flex-grow-1">
        <v-avatar height="40" class="mt-1">
          <v-img src="@/assets/logoonlyletters.png"> </v-img>
        </v-avatar>
        <div class="d-flex align-center">
          <span class="text-h6">Kide.app ticket bot</span>
        </div>

        <v-spacer></v-spacer>

        <v-menu left bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list width="164">
            <v-list-item-group color="primary">
              <v-list-item :to="{ name: 'Home' }" exact>
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-content>Home</v-list-item-content>
              </v-list-item>
              <v-list-item :to="{ name: 'Settings' }">
                <v-list-item-icon>
                  <v-icon>mdi-cog</v-icon>
                </v-list-item-icon>
                <v-list-item-content>Settings</v-list-item-content>
              </v-list-item>
              <v-list-item
                href="https://github.com/AleksiVirkkala/KideAppBot"
                target="_blank"
              >
                <v-list-item-icon>
                  <v-icon>mdi-github</v-icon>
                </v-list-item-icon>
                <v-list-item-content>GitHub</v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header',

  components: {},

  data: () => ({
    safeAreaTop: 0
  }),
  methods: {
    reSetSafeArea() {
      this.safeAreaTop = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--sat')
      )
    }
  },
  mounted() {
    // Not that brilliant solution
    this.$nextTick(this.reSetSafeArea)
    setTimeout(this.reSetSafeArea, 1000)
    setTimeout(this.reSetSafeArea, 2000)
  }
}
</script>

<style lang="css">
:root {
  --sat: env(safe-area-inset-top);
}
</style>
