<template>
  <v-app-bar app color="deep-purple darken-2" class="px-1" dark>
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
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header',

  components: {},

  data: () => ({})
}
</script>
