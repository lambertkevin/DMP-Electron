export default {
  namespaced: true,

  state: {
    isLookingForUnknownSongs: false,
    isOpen: false,
    isHover: false,
    musicTypes: {},
    localPath: ''
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
    },

    setLocalPath(state, payload) {
      state.localPath = payload;
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
      fetch('http://localhost:3000/musictypes')
        .then(res => res.json())
        .then((data) => {
          commit('setMusicTypes', data);
        });
    }
  }
};
