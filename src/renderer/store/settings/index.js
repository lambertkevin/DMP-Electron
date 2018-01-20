import { ipcRenderer } from 'electron'; // eslint-disable-line

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
      const musicTypes = ipcRenderer.sendSync('musictypes');
      commit('setMusicTypes', musicTypes);
    }
  }
};
