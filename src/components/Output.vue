<template>
  <v-card outlined class="logFrame pa-4" ref="logFrame">
    <p class="mx-0 mt-4 text--disabled" v-if="logData.length === 0">
      <slot />
    </p>
    <v-fade-transition group>
      <div v-for="(logLine, i) in logData" :key="i">
        <template>
          <component
            :is="logLine.type === 't' ? 'h4' : 'p'"
            :class="!!logLine.msg ? 'ma-0' : ''"
          >
            {{ getPrefix(logLine.type) }} {{ logLine.msg }}
            <code v-if="!!logLine.value">{{ logLine.value }}</code>
          </component>
        </template>
      </div>
    </v-fade-transition>
  </v-card>
</template>

<script>
import { disableBodyScroll } from 'body-scroll-lock'

export default {
  name: 'Output',
  props: {
    logData: {
      type: Array,
      required: true
    }
  },
  methods: {
    getPrefix(type) {
      if (!type) return ''
      if (type === 'e') return '❌'
      else if (type === 'w') return '⚠️'
      // Warning
      else if (type === 's') return '✅'
      // Success
      else if (type === 'l') return '⌛'
      // Loading
      else if (type === 'f') return '🛰️'
      // fetch
      else if (type === 'b') return '•'
      // Bullet point
    }
  },
  mounted() {
    disableBodyScroll(this.$refs.logFrame.$el)
  }
}
</script>

<style lang="scss" scoped>
.logFrame {
  background-color: #eeeeee;
  border-width: 1px;
  border-color: #bdbdbd;
  overflow-y: scroll;
  position: relative;
  height: 100%;
  width: 100%;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
