export default {
  namespaced: true,

  state: {
    isLookingForUnknownSongs: false,
    isOpen: false,
    isHover: false,
    musicTypes: {}
  },

  mutations: {
    setIsOpen(state, payload) {
      state.isOpen = payload;
    },

    setIsHover(state, payload) {
      state.isHover = payload;
    },

    setIsLookingForUnknownSongs(state, payload) {
      state.isLookingForUnknownSongs = payload;
    },

    setMusicTypes(state, payload) {
      state.musicTypes = payload;
    }
  },

  actions: {

    /**
     * Fetch all the types of music possible
     * from config file in backend
     *
     * @return {void}
     */
    getMusicTypes({ commit }) {
      if (process.env.IS_WEB) {
        const { ipcRenderer } = require('electron'); // eslint-disable-line
        const musicTypes = ipcRenderer.sendSync('musictypes');
        commit('setMusicTypes', musicTypes);
      } else {
        this._vm.$socket.emit('musictypes', (musicTypes) => {
          commit('setMusicTypes', musicTypes);
        });
      }
    }
  }
};
