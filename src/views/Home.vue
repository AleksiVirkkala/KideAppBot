<template>
  <v-container
    class="pt-6 px-4 px-sm-6 d-flex flex-column"
    style="
      height: 100%;
      padding-bottom: max(calc(env(safe-area-inset-bottom) + 12px), 24px);
    "
  >
    <v-container class="flex-grow-0 pa-0">
      <v-row class="text-h5 px-4"> Info </v-row>
      <v-row>
        <span class="text-body mt-1 px-4">
          The bot will add maximum amount of tickets to your kide.app cart based on given event url.
        </span>
      </v-row>
      <v-row>
        <v-col v-if="promtToAddToken" class="mt-5 mb-n7">
          <v-alert type="error" text>
            Add your bearer token in the settings first
          </v-alert>
        </v-col>
      </v-row>
      <v-form ref="urlField">
        <div class="mt-8 px-1 d-flex flex-wrap-nowrap">
          <div class="flex-grow-1 pa-0 pr-4 pr-xl-10">
            <v-text-field
              label="Event URL"
              v-model="eventUrl"
              outlined
              validate-on-blur
              @keydown.enter.prevent="runBot"
              :disabled="promtToAddToken || this.botIsActive"
              :rules="[(value) => !!value || 'Enter value']"
            ></v-text-field>
          </div>
          <div class="d-flex flex-grow-0 pa-0 pl-2 pl-sm-4 pr-2 pr-md-0">
            <v-btn
              :color="botIsActive ? 'error' : 'primary'"
              height="56"
              :width="$vuetify.breakpoint.lgAndDown ? 56 : 100"
              :outlined="botIsActive || promtToAddToken"
              class="text-none text-subtitle-1"
              :disabled="promtToAddToken"
              elevation="0"
              :fab="$vuetify.breakpoint.lgAndDown"
              @click="botIsActive ? (stopRequested = true) : runBot()"
            >
              <!--               <v-icon size="30"></v-icon>
 -->
              <v-icon size="30" v-text="botIsActive ? 'mdi-close' : 'mdi-play'"></v-icon>
            </v-btn>
          </div>
        </div>
      </v-form>
    </v-container>

    <v-row class="px-4 mt-2 flex-grow-1">
      <div style="overflow: hidden; position: relative; width: 100%" ref="outputWrapper">
        <Output :log-data="logData"> Log data will be printed here </Output>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import Output from '@/components/Output.vue'
import botMixin from '../mixins/botMixin'

export default {
  name: 'Home',
  components: {
    Output
  },
  mixins: [ botMixin ]
}
</script>

<style lang="scss" scoped></style>
