<template>
  <td
    v-if="catName !== 'unknown'"
    class="playlist-table__round__songs"
  >
    <div
      v-for="(song, index) in cat"
      :key="index"
      class="playlist-table__round__songs__row"
    >
      <div
        class="playlist-table__round__songs__song text-center"
        :class="{
          'playlist-table__round__songs__song--done': song.isDone,
          'playlist-table__round__songs__song--pending': songPlaying.uuid === song.uuid && !song.isDone && isPlaying
        }"
      >
        <span
          v-if="getLinkTitle(song)"
          @click="launchMusic(song)"
        >
          {{ getLinkTitle(song) }}
          <span uk-icon="icon: play-circle;"></span>
        </span>
        <span
          v-if="!getLinkTitle(song)"
          class="no-bg"
        > &#10007;
        </span>
      </div>
    </div>
  </td>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PlaylistTableSongs',

  props: {
    cat: {
      type: Array,
      required: true,
      default: () => ([{
        uuid: 0,
        name: '??',
        path: '??',
        isDone: false,
        meta: [
          {
            type: '??',
            probability: 1
          }
        ]
      }])
    },

    'cat-name': {
      type: String,
      required: true,
      default: 'test'
    }
  },

  computed: {
    ...mapState('musicPlayer', {
      songPlaying: state => state.dance,
      isPlaying: state => state.isPlaying
    })
  },

  methods: {

    /**
       * Get the name of the dance type to make it the title of the cell
       *
       * @param {Object}
       * @return {String|Boolean}
       */
    getLinkTitle(song) {
      if (Object.prototype.hasOwnProperty.call(song, 'meta') && song.meta.length) {
        return song.meta[0].type;
      }
      return false;
    },

    /**
       * Launch the given music
       *
       * @param {Object}
       * @return {void}
       */
    launchMusic(dance) {
      this.$store.commit('musicPlayer/setDance', dance);
    }
  }
};
</script>

<style lang="scss">

/**
 * SMALL UP
 */
.playlist-table__round__songs {
  width: 15%;
  padding: 0!important;

  &__row {
    &:first-child{
      border-top: none;
    }
    border-top: 1px dashed rgba($details, 0.7);
  }

  &__song {
    padding: rem-calc(8)!important;
    width: 100%;

    > span {
      border-radius: rem-calc(3);
      padding: rem-calc(2);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    span {
      display: block;

      &.no-bg{
        background: none!important;
        color: smart-scale($black, -20%)!important;
        font-size: rem-calc(20);
        transition: all 0.3s ease;

        &:hover{
          color: smart-scale($black, -35%)!important;
        }
      }
    }

    &--pending {
      $color: $green;

      >span {
        background: rgba($color, 0.1);
        color: $color;

        svg {
          > * {
            stroke: $color;
          }
        }
      }
    }

    &:hover {
      $color: $white;
      > span {
        background: rgba($color, 0.1);
        color: $color;

        svg {
          >* {
            stroke: $color;
          }
        }
      }
    }

    &--done {
      $color: smart-scale($details, -50%);
      > span {
        background: rgba($color, 0.3);
        color: $color;

        svg {
          >* {
            stroke: $color;
          }
        }
      }
    }
  }

  /**
   * MEDIUM UP
   */
  @include breakpoint(medium) {}

  /**
   * LARGE UP
   */
  @include breakpoint(large) {}

  /**
   * XLARGE UP
   */
  @include breakpoint(xlarge) {}

}

</style>
