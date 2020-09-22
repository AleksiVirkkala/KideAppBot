<template>
  <v-card outlined class="logFrame pa-4">
    <p class="ma-0 text--disabled" v-if="logData.length === 0">
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
  }
}
</script>

<style lang="scss" scoped>
.logFrame {
  background-color: #eeeeee;
  border-width: 1px;
  border-color: #bdbdbd;
  overflow: scroll;
  position: relative;
  height: 100%;
  width: 100%;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
