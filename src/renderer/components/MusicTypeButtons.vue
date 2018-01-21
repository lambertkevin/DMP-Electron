<template>
  <div class="music-type-buttons">
    <a
      class="button"
      v-for="(type, index) in typePossibilities"
      :key="index"
      @click="setMusicForSong(type, song)"
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
      setMusicForSong(type, song) {
        this.$electron.ipcRenderer.send('edit-song', {
          songPath: song.path,
          type
        });

        this.$electron.ipcRenderer.on('edit-song-reponse', (event, res) => {
          if (res.error === 200) {
            this.$store.commit('timetable/setSongType', {
              song,
              round: song.round,
              type
            });

            this.$store.commit('timetable/setUnknownSongs',
              this.$store.state.timetable.unknownSongs.filter(_song => _song.uuid !== song.uuid));
          } else if (res.error === 404) {
            alert('Error 404');
            console.log(res.error);
          }
        });
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
