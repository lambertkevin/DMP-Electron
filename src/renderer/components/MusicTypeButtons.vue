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

      setMusicForSong(type, song) {
        const form = new FormData();
        form.append('songPath', song.path);
        form.append('type', type);

        fetch('http://localhost:3000/edit', {
          method: 'POST',
          body: form
        }).then((res) => {
          if (res.status === 200) {
            this.$store.commit('timetable/setSongType', {
              song,
              round: song.round,
              type
            });

            this.$store.commit('timetable/setUnknownSongs',
              this.$store.state.timetable.unknownSongs.filter(_song => _song.uuid !== song.uuid));
          } else if (res.status === 404) {
            alert('Error 404');
          }
        });
      }
    },

    /**
     * Lifecyle
     *
     * @return {void}
     */
    mounted() {
      const $ = require('jquery');
      $(this.$el).foundation();
    },


    /**
     * Lifecyle
     *
     * @return {void}
     */
    destroyed() {
      if (this.$el && this.$el.foundation) {
        const $ = require('jquery');
        $(this.$el).foundation('destroy');
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
