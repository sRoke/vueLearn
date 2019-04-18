
const timerControl = {
  state: {
    kylinTimer: new Map()
  },
  mutations: {
    SET_kylinTimer: (state, timer) => {
      if (state.kylinTimer.has(timer.key)) {
        clearInterval(state.kylinTimer.get(timer.key))
      } else {
        state.kylinTimer.set(timer.key, timer.value)
      }
    },
    DEL_kylinTimer: (state, timer) => {
      if (state.kylinTimer.has(timer.key)) {
        clearInterval(state.kylinTimer.get(timer.key))
      }
      state.kylinTimer.delete(timer.key)
    },
    CLEAR_kylinTimer: (state) => {
      state.kylinTimer.forEach((value, key, map) => {
        clearInterval(value)
        state.kylinTimer.delete(key)
      })
    }
  },
  actions: {
    setKylinTimer({ commit }, timer) {
      commit('SET_kylinTimer', timer)
    },
    delKylinTimer({ commit }, timer) {
      commit('DEL_kylinTimer', timer)
    },
    clearKylinTimer({ commit }, timer) {
      commit('CLEAR_kylinTimer', timer)
    }
  }
}

export default timerControl
