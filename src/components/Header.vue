<template>
  <v-app-bar app color="deep-purple darken-2" class="px-1" dark>
    <div class="d-flex align-center">
      <span class="text-h6">Kide.app ticket bot</span>
    </div>

    <v-spacer></v-spacer>

    <v-btn
      href="https://github.com/AleksiVirkkala/KideAppBot"
      target="_blank"
      class="pa-0"
      text
    >
      <v-img
        alt="Vuetify Logo"
        class="mr-1"
        contain
        src="@/assets/GitHub_Logo_White.png"
        transition="scale-transition"
        width="60"
      />
      <v-avatar class="pa-1">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/GitHub-Mark-Light-32px.png"
          transition="scale-transition"
        />
      </v-avatar>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header',

  components: {},

  data: () => ({})
}
</script>
