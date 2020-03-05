<template>
  <div class="footer full-width text-center">
    <div class="grid-x align-center full-height">
      <div class="cell small-14 medium-10 large-8 align-self-bottom">
        <div class="grid-x align-center">
          <div class="cell medium-16 large-13">
            <music-player></music-player>
          </div>
        </div>
      </div>

      <div class="cell small-16"></div>

      <div class="cell small-14 medium-10 large-8 align-self-top">
        <div class="grid-x">
          <div class="cell small-8 footer__element">
            <div class="grid-x align-center">
              <span class="small-16 cell footer__element__title"> Music duration: </span>
              <input-number
                v-model="musicDuration"
                class="small-16 cell"
                :name="`musicDuration`"
                :steps="5"
                :time="musicDuration"
              />
            </div>
          </div>

          <div class="cell auto"></div>

          <div class="cell small-8 footer__element">
            <div class="grid-x align-center footer__element__title">
              <span class="small-16 cell"> Fade duration: </span>
              <input-number
                v-model="fadeDuration"
                class="small-16 cell"
                :name="`fadeDuration`"
                :time="fadeDuration"
              ></input-number>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MusicPlayer from '@/components/MusicPlayer';
import InputNumber from '@/components/InputNumber';

export default {
  name: 'Footer',

  components: {
    MusicPlayer,
    InputNumber
  },

  data() {
    return {};
  },

  computed: {

    musicDuration: {
      get() {
        return this.$store.state.musicPlayer.musicDuration;
      },
      set(value) {
        this.$store.commit('musicPlayer/setMusicDuration', parseInt(value, 10));
      }
    },

    fadeDuration: {
      get() {
        return this.$store.state.musicPlayer.fadeDuration;
      },
      set(value) {
        this.$store.commit('musicPlayer/setFadeDuration', parseInt(value, 10));
      }
    }
  }
};
</script>

<style lang="scss">

  /**
   * SMALL
   */
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    height: rem-calc(110);
    border-top: 1px solid smart-scale($black, 2%);
    background: smart-scale($black, 1%);
    color: $light-gray;
    transform: translateZ(0);

    input{
      height: rem-calc(30);
      width: rem-calc(50);
      text-align: center;
      display: inline-block;
    }

    &__element{

      &__title{
        font-size: rem-calc(14);
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
