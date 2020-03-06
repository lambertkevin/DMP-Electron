<template>
  <transition name="fade">
    <tr
      v-show="!isDone"
      class="playlist-table__row"
      :class="{
        'playlist-table__row--blink': hasUnknownSongs
      }"
    >
      <td class="playlist-table__row__time">
        {{ row.time }}
      </td>
      <td class="playlist-table__row__category">
        {{ category }}
      </td>
      <td class="playlist-table__row__round">
        {{ round }}
      </td>
      <td
        class="playlist-table__row__type"
      >
        <span
          :class="{
            'red': row.type === 'lat',
            'blue': row.type === 'std',
          }"
        >
          {{ longType }}
        </span>
      </td>
      <playlist-table-song
        v-for="(songs, index) in dances"
        :key="index"
        :songs="songs"
        :cat-name="index"
      ></playlist-table-song>
      <td class="playlist-table__row__done">
        <div class="pretty p-svg p-jelly">
          <input
            v-model="isDone"
            type="checkbox"
          />
          <div class="state">
            <span
              class="svg"
              uk-icon="icon: check"
            ></span>
            <label></label>
          </div>
        </div>
      </td>
    </tr>
  </transition>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import PlaylistTableSong from '@/components/PlaylistTableSong';

export default {
  name: 'PlaylistTablerow',

  components: {
    PlaylistTableSong
  },

  props: {
    row: {
      type: Object,
      required: true,
      default: () => ({
        time: '??',
        category: '??',
        dances: [],
        isDone: false
      })
    }
  },

  computed: {

    ...mapState('settings', [
      'musicTypes'
    ]),

    ...mapState('timetable', [
      'rounds'
    ]),

    category() {
      return this.row.category ? this.row.category.replace(/&/g, '\n') : '';
    },

    hasUnknownSongs() {
      const dances = _.get(this.row, ['dances'], []);

      return dances.some(song => {
        const type = _.get(song, ['types', 0, 'type']);
        return type === 'unknown'
      });
    },

    isDone: {
      get() {
        const rowState = this.rounds.find(el => el.id === this.row.id);
        return rowState.isDone;
      },

      set(value) {
        const round = this.row;

        this.$store.commit('timetable/setRoundIsDone', {
          round,
          isDone: value
        });
      }
    },

    round() {
      if (!this.row.round) {
        return '';
      }
      const roundWithSlash = this.row.round.replace(/[|]/g, '/');
      return roundWithSlash.toLowerCase() === 'f' ? 'finale' : roundWithSlash.replace(/\s/g, '');
    },

    longType() {
      if (!this.row.type) {
        return '';
      }
      return this.row.type === 'lat' ? 'latines' : 'standard';
    },

    dances() {
      if (!this.row.dances || typeof this.row.type === 'undefined') {
        return [];
      }
      return this.organizeDances(this.row.dances, this.row.type);
    }
  },

  methods: {

    /**
       * Order dances together by types, so they stay in the right
       * cell in the table (sambas with sambas for example)
       *
       * @param {Array} dancesToOrganize
       * @param {String} danceType
       * @return {Object} [containing dances recognized and unknown]
       */
    organizeDances(dancesToOrganize, danceType) {
      const musicTypes = this.musicTypes[danceType];
      const musicTypesKeys = Object.keys(musicTypes);
      const unknownDances = dancesToOrganize.filter(dance => dance.types[0].type === 'unknown');
      const dances = {};

      musicTypesKeys.forEach((musicType) => {
        const correspondingDance = dancesToOrganize.filter(dance => dance.types[0].type === musicType);
        const fakeSong = [{}];

        dances[musicType] = Object.keys(correspondingDance).length ? correspondingDance : fakeSong;
      });

      if (unknownDances.length) {
        return {
          ...dances,
          unknown: dancesToOrganize.filter(dance => dance.types[0].type === 'unknown')
        };
      }

      return dances;
    }
  }
};
</script>

<style lang="scss">
  @import '~pretty-checkbox/src/pretty-checkbox.scss';

  /**
   * SMALL
   */
  .playlist-table__row {

    &--blink{
      animation: blink 5s infinite;
    }

    &:last-child{
      td{
        border-bottom: none;
      }
    }

    td{
      padding: rem-calc(10 0);
      border-bottom: 1px solid smart-scale($black, -12%);
      color: $white;
      font-weight: 500;
    }

    &__time, &__category, &__type, &__round{
      width: 8%;
      font-weight: 500;
      text-align: center;
      background: $black;
      color: $white;
      border-bottom-color: transparent !important;
    }

    &__type{
      border-right: 1px solid $details;
    }

    &__time{
      padding-left: rem-calc(10);
    }

    &__done{
      padding: rem-calc(0 10)!important;
      width: rem-calc(40);

      .pretty.p-svg {
        margin: 0;
        .state .svg{
          left: -1px;
          top: calc((0% - (100% - 0.85em)) - 8%);
        }
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
