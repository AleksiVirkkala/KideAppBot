import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tokenSet: false,
    logRows: [],
    juttu: 69
  },
  mutations: {
    addLogRow(state, row) {
      state.logRows.push(row)
    },
    clearLog(state) {
      state.logRows = []
    }
  },
  actions: {
    teeJuttu(state) {
      setTimeout(() => {
        state.juttu = 420
      }, 2000)
    }
  },
  modules: {}
})
