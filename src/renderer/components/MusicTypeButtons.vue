<template>
  <div class="music-type-buttons">
    <a
      v-for="(type, index) in typePossibilities"
      :key="index"
      class="button"
      @click="setTypeForSong(type, song)"
    >
      {{ type }}
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MusicTypeButtons',

  props: {
    song: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  computed: {
    ...mapState('settings', [
      'musicTypes'
    ]),

    /**
       * Return all the possible choices
       * for a given music genre
       *
       * @return {Array}
       */
    typePossibilities() {
      if (Object.keys(this.musicTypes).length > 0) {
        return Object.keys(this.musicTypes[this.song.round.type]);
      }
      return [];
    }
  },

  methods: {

    /**
       * Ipc to edit the song file to add the dance name in it,
       * to make it recognizable without bpm and gain performances
       *
       * @param {String} type
       * @param {Object} song
       * @return {void}
       */
    setTypeForSong(type, song) {
      const updateSong = (res) => {
        if (res.code === 200) {
          this.$store.commit('timetable/setSongType', {
            song,
            round: song.round,
            type
          });

          this.$store.commit('timetable/setUnknownSongs',
            this.$store.state.timetable.unknownSongs.filter(_song => _song.uuid !== song.uuid));
        } else if (res.code === 404) {
          alert('Error 404');
          console.log(res);
        }
      };

      if (!process.env.IS_WEB) {
        this.$electron.ipcRenderer.send('edit-song', {
          song,
          type
        });
        this.$electron.ipcRenderer.on('edit-song-response', (event, res) => {
          updateSong(res);
        });
      } else {
        this.$socket.emit('edit-song', {
          song,
          type
        });
        this.$socket.on('edit-song-response', (res) => {
          updateSong(res);
        });
      }
    }
  }
};
</script>

<style lang="scss">

  /**
   * SMALL
   */
  .default {

    /**
     * MEDIUM UP
     */
    @include breakpoint(medium) {
    }

    /**
     * LARGE UP
     */
    @include breakpoint(large) {
    }

    /**
     * XLARGE UP
     */
    @include breakpoint(xlarge) {
    }
  }
</style>
