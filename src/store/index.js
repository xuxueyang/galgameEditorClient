import Vue from 'vue'
import Vuex from 'vuex'
import dynamicForm from './modules/dynamicForm'
import flow from './modules/flow'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    dynamicForm,
    flow,
    app
  }
})
