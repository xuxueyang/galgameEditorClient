const state = {
  appId: null,
  appName: null,
  appStatus: null
}

const mutations = {
  // 设置应用id
  setAppId (state, payload) {
    state.appId = payload
  },
  // 设置应用name
  setAppName (state, payload) {
    state.appName = payload
  },
  // 设置应用status
  setAppStatus (state, payload) {
    state.appStatus = payload
  }
}

const actions = {
  // 设置应用id
  setAppId ({commit}, payload) {
    commit('setAppId', payload)
  },
  // 设置应用name
  setAppName ({commit}, payload) {
    commit('setAppName', payload)
  },
  // 设置应用status
  setAppStatus ({commit}, payload) {
    commit('setAppStatus', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
