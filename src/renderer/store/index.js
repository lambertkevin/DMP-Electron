import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistedState from 'vuex-persistedstate';
import musicPlayer from './musicPlayer';
import timetable from './timetable';
import settings from './settings';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,

  plugins: [VuexPersistedState()],

  modules: {
    settings,
    musicPlayer,
    timetable
  }
});
