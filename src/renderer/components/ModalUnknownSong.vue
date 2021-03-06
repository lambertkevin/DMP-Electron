<template>
  <transition name="fade">
    <div
      v-if="isOpen && songs.length"
      class="modal-unknown-song text-center"
    >
      <div
        class="modal-unknown-song__close"
        @click="isOpen = false"
      >
        <span uk-icon="icon: close"></span>
      </div>
      <div class="grid-x full-height align-center">
        <div class="small-8 cell align-self-middle">
          <div class="modal-unknown-song__content box-shadow">
            <h2>Of what kind is this song?</h2>
            <hr />
            <div
              ref="slider"
              class="modal-unknown-song__slider"
              uk-slideshow
            >
              <div class="modal-unknown-song__slider__controls">
                <a
                  class="modal-unknown-song__slider__controls__previous uk-position-center-left uk-position-small uk-hidden-hover"
                  href="#"
                  uk-slidenav-previous
                  uk-slideshow-item="previous"
                ></a>
                <a
                  class="modal-unknown-song__slider__controls__next uk-position-center-right uk-position-small uk-hidden-hover"
                  href="#"
                  uk-slidenav-next
                  uk-slideshow-item="next"
                ></a>
              </div>
              <ul class="modal-unknown-song__slider__slides uk-slideshow-items">
                <li
                  v-for="(song, index) in songs"
                  :key="index"
                  class="modal-unknown-song__slider__slide"
                  :class="{
                    'is-active': index === 0
                  }"
                >
                  <div class="grid-x align-center full-height">
                    <div class="modal-unkown-song__song-name cell small-16 text-center" v-html="song.name.trim()" />
                    <div class="modal-unknown-song__player cell small-16">
                      <audio
                        :src="getPath(song)"
                        controls
                      ></audio>
                    </div>
                    <div class="modal-unknown-song__options cell small-16">
                      <music-type-buttons
                        :song="song"
                      ></music-type-buttons>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import musicTypeButtons from '@/components/MusicTypeButtons';
import UIkit from 'uikit';

export default {
  name: 'ModalUnknownSong',

  components: {
    musicTypeButtons
  },

  computed: {

    ...mapState('timetable', {
      songs: state => state.unknownSongs
    }),

    ...mapState('settings', [
      'localPath'
    ]),

    isOpen: {
      get() {
        return this.$store.state.settings.isLookingForUnknownSongs;
      },

      set(isOpen) {
        this.$store.commit('settings/setIsLookingForUnknownSongs', isOpen);
      }
    }
  },

  methods: {

    /**
     * Modify the path to make it possible to open in Electron bundle
     *
     * @return {void}
     */
    getPath(song) {
      if (!process.env.IS_WEB) {
        return song.path ? `file://${song.path}` : null;
      }
      return song.path ? song.path.replace(this.localPath, 'music') : null;
    },

    /**
     * Modify the path to make it readable from Electron build
     *
     * @param {Object} song
     * @return {void}
     */
    path(song) {
      return song.path ? `file://${song.path}` : null;
    }
  },

  watch: {

    /**
     * Watch changes of songs to close when all songs has been recognized
     *
     * @return {void}
     */
    songs(songsState) {
      if (!songsState.length) {
        this.isOpen = false;
      }
    }
  },


  /**
   * Lifecyle
   *
   * @return {void}
   */
  mounted() {
    if (this.isOpen) {
      this.setSongs();
    }

    UIkit.slideshow('[uk-slideshow]', {
      finite: true
    });
  }
};
</script>

  <style lang="scss">

  /**
  * SMALL
  */
  .modal-unknown-song {
    position: fixed;
    background: rgba($black, 0.95);
    height: 100vh;
    width: 100vw;
    z-index: 10;
    top: 0;

    &__close{
      color: $white;
      position: absolute;
      top: rem-calc(15);
      right: rem-calc(15);
    }

    &__content{
      padding: 4%;
      background: white;
    }

    &__slider{
      position: relative;

      &__slides{
        z-index: 2!important;
      }

      &__controls{
        width: 100%;
        position: absolute;
        z-index: 1;
        left: 0%;
        height: 100%;
        transform: scale(1.5);
      }
    }

    &__player{
      margin: rem-calc(10);

      audio{
        height: 100%;
      }
    }

    &__options{
      .button{
        margin-right: rem-calc(4);
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
