<template>
  <v-card width="100%" min-height="200" outlined class="logFrame pa-4">
    <v-fade-transition group>
      <component :is="'div'" v-for="(logLine, i) in logData" :key="i">
        <!-- Row is title row -->

        <template v-if="logLine.type === 't'">
          <h4 class="mb-3">{{ getPrefix(logLine.type) }} {{ logLine.msg }}</h4>
        </template>

        <!-- Row is general row -->

        <template v-else>
          <p>
            {{ getPrefix(logLine.type) }} {{ logLine.msg }}
            <code v-if="!!logLine.value">{{ logLine.value }}</code>
          </p>
        </template>
      </component>
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
      else if (type === 'b') return '•' // Bullet point
    }
  }
}
</script>

<style lang="scss" scoped>
.logFrame {
  background-color: #eeeeee;
  border-width: 1px;
  border-color: grey;
}
</style>
