import Vue from 'vue';
import _ from 'lodash';

export default {
  namespaced: true,

  state: {
    isLoading: false,
    unknownSongs: [],
    rounds: []
  },

  getters: {
    /**
     * Return all the unknown sounds for all the rounds
     *
     * @param {Object} state
     */
    getUnknownSongs(state) {
      return state.rounds
        .reduce((oldRound, newRound) => {
          const dances = _.get(newRound, ['dances'], []);
          const roundUnknownSongs = dances.filter((dance) => {
            const type = _.get(dance, ['types', 0, 'type']);
            return type === 'unknown';
          });
          return oldRound.concat(roundUnknownSongs.map(song => ({
            ...song,
            round: newRound,
            isRecognized: false
          })));
        }, []);
    }
  },

  mutations: {
    setIsLoading(state, payload) {
      state.isLoading = payload;
    },

    setRounds(state, payload) {
      state.rounds = payload;
    },

    /**
     * Set as done the given round, and all the ones that are before
     *
     * @param {Object} state
     * @param {Object} payload
     */
    setRoundIsDone(state, payload) {
      const { round, isDone } = payload;
      const stateRound = state.rounds.find(el => el.id === round.id);
      stateRound.isDone = isDone;
    },

    clearRounds(state) {
      state.rounds = [];
    },

    /**
     * Add the song type to its name and file path to make it accessible after the
     * ipc changed it through the fileManager
     *
     * @param {Object} state
     * @param {Object} payload
     */
    setSongType(state, payload) {
      const { type, song } = payload;
      const { round } = song;

      const roundState = state.rounds.find(_round => _round.id === round.id);
      const songState = roundState.dances.find(_song => _song.uuid === song.uuid);

      // Vue.set to add reactivy for the watchers
      Vue.set(songState, 'types', [{ type, probability: 100 }]);
    },

    setUnknownSongs(state, payload) {
      state.unknownSongs = payload;
    },

    resetTimetable(state) {
      state.rounds.forEach((round) => {
        round.isDone = false;
        round.dances.forEach((song) => {
          song.isDone = false;
        });
      });
    }
  },

  actions: {

    /**
     * Get the timetable through ipc
     *
     * @param {Object} [commit]
     */
    getTimetable({ commit }) {
      const setRoundsAndLoading = (res) => {
        commit('setRounds', res);
        commit('setIsLoading', false);
      };
      commit('clearRounds');

      if (!process.env.IS_WEB) {
        const { ipcRenderer } = require('electron'); // eslint-disable-line
        ipcRenderer.send('get-rounds');
        ipcRenderer.on('get-rounds-response', (event, res) => {
          setRoundsAndLoading(res);
        });
      } else {
        this._vm.$socket.emit('get-rounds');
        this._vm.$socket.on('get-rounds-response', (res) => {
          setRoundsAndLoading(res);
        });
      }
    },

    /**
     * Generate the timetable (with bpms & cie) and then get the timetable, through ipc
     *
     * @param {Object} [commit]
     */
    generateTimetable({ commit }) {
      const setRoundsAndLoading = (res) => {
        commit('setRounds', res);
        commit('setIsLoading', false);
      };
      commit('setIsLoading', true);

      if (!process.env.IS_WEB) {
        const { ipcRenderer } = require('electron'); // eslint-disable-line
        ipcRenderer.send('generate');
        ipcRenderer.on('generate-response', (event, res) => {
          setRoundsAndLoading(res);
        });
      } else {
        this._vm.$socket.emit('generate');
        this._vm.$socket.on('generate-response', (res) => {
          setRoundsAndLoading(res);
        });
      }
    }
  }
};
