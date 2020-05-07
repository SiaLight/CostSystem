import { login, logout, getInfo } from '@/api/user'
import { resetRouter } from '@/router'
// import user from 'mock/user'

const getDefaultState = () => {
  return {
    name: '',
    userId: 0,
    idendity:-1,
    loginState:false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_IDENDITY: (state, idendity) => {
    state.idendity = idendity
  },
  SET_USERID: (state, id) => {
    state.userId = id
  },
  SET_LOGINSTATE: (state,loginState) =>{
    state.loginState = loginState
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    console.log(userInfo);
    return new Promise((resolve, reject) => {
      console.log("logining");
      login(userInfo.username,userInfo.password).then(res => {
        console.log(res);
        commit('SET_LOGINSTATE',true);
        commit('SET_USERID',res.data.userId);
        commit('SET_IDENDITY',res.data.userIdendity);
        commit('SET_NAME',res.data.userName);
        resolve();

      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

