import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import physicalResource from './modules/physicalResource'
import timerControl from './modules/timerControl'
import returnCode from './modules/returnCode'
import returnConn from './modules/conn'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    physicalResource,
    returnConn,
    timerControl,
    returnCode
  },
  getters
})

export default store
