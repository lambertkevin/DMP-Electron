export default {
  namespaced: true,

  state: {
    dance: {},
    volume: 1,
    isPlaying: false,
    musicDuration: 90,
    isFading: false,
    fadeDuration: 5,
    fadeSteps: 60
  },

  mutations: {
    setDance(state, payload) {
      state.dance = payload;
      state.isPlaying = true;
    },

    setVolume(state, payload) {
      state.volume = payload;
    },

    setIsPlaying(state, payload) {
      state.isPlaying = payload;
    },

    setIsFading(state, payload) {
      state.isFading = payload;
    },

    setDanceIsDone(state, payload) {
      state.dance.isDone = payload;
    },

    setMusicDuration(state, payload) {
      state.musicDuration = payload < 0 ? 0 : payload;
    },

    setFadeDuration(state, payload) {
      state.fadeDuration = payload < 0 ? 0 : payload;
    }
  },

  actions: {
    fadeOut({ state, commit, getters }) {
      if (!state.isPlaying) {
        return false;
      }

      commit('setIsFading', true);
      const timePerSteps = getters.fadeDurationInMs / state.fadeSteps;
      const fadeOutSpeed = (1 / getters.fadeDurationInMs) * timePerSteps;

      console.log(timePerSteps, fadeOutSpeed);

      const fadeOutInterval = setInterval(() =>  {
        // if the volume will result in negativ, just send 0
        const newVolume = state.volume - fadeOutSpeed >= 0 ? state.volume - fadeOutSpeed : 0;
        if (state.volume > 0) {
          commit('setVolume', newVolume);
        } else {
          commit('setIsPlaying', false);
          commit('setIsFading', false);
          commit('setDanceIsDone', true);
          clearInterval(fadeOutInterval);
        }
      }, timePerSteps);

      return true;
    }
  },

  getters: {
    fadeDurationInMs(state) {
      return state.fadeDuration * 1000;
    }
  }
};
