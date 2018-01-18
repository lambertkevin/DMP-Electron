<template>
  <div class="playlist-table">
    <div
      class="playlist-table__container relative"
    >
      <table
        class="grid-container"
        data-equalizer
        data-options="equalizeOnStack: true;"
      >
        <playlist-table-row
          data-equalizer-watch
          v-for="(row, index) in rounds"
          :key="index"
          :row="row"
        />
      </table>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import PlaylistTableRow from '@/components/PlaylistTableRow';

  export default {
    name: 'PlaylistTable',

    components: {
      PlaylistTableRow
    },

    computed: {
      ...mapState('timetable', {
        rounds: state => state.rounds
      })
    },

    /**
     * Lifecyle
     *
     * @return {void}
     */
    mounted() {
      const $ = require('jquery');
      $(this.$el).foundation();

      this.$store.commit('musicPlayer/setDance', {});
      this.$store.commit('musicPlayer/setIsPlaying', false);

      if (!this.rounds.length) {
        this.$store.dispatch('timetable/getTimetable');
      }
    },


    /**
     * Lifecyle
     *
     * @return {void}
     */
    destroyed() {
      const $ = require('jquery');
      if (this.$el && this.$el.foundation) {
        $(this.$el).foundation('destroy');
      }
    }
  };
</script>

<style lang="scss">

  /**
   * SMALL
   */
  .playlist-table {
    color: $black;
    padding-top: rem-calc(18);

    &__container{
      overflow: hidden;
    }

    table{
      width: 100%;
      margin-bottom: 0;
      table-layout: fixed;

      td {
        text-transform: capitalize;
      }
    }

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
