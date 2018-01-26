import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistedState from 'vuex-persistedstate';
import musicPlayer from './musicPlayer';
import timetable from './timetable';
import settings from './settings';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  plugins: [VuexPersistedState({
    paths: [
      'musicPlayer.musicDuration',
      'musicPlayer.fadeDuration',
      'settings.clashes',
      'timetable.unknownSongs',
      'timetable.rounds'
    ]
  })],
  modules: {
    settings,
    musicPlayer,
    timetable
  }
});
