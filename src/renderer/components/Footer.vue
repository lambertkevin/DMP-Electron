<template>
  <div class="footer full-width text-center">

    <div class="grid-x align-center full-height">
      <div class="cell small-16 align-self-bottom">
        <music-player/>
      </div>

      <div class="cell small-12 medium-10 large-8 align-self-top">
        <div class="grid-x">
          <div class="cell small-8">
            <div class="grid-x align-center">

              <span class="small-16 cell"> Music duration: </span>
              <input-number
                class="small-16 cell"
                :name="`musicDuration`"
                :time="musicDuration"
                v-model="musicDuration"
              />

            </div>
          </div>
          <div class="cell auto"></div>
          <div class="cell small-8">
            <div class="grid-x align-center">

              <span class="small-16 cell"> Fade duration: </span>
              <input-number
                class="small-16 cell"
                :name="`fadeDuration`"
                :steps="1"
                :time="fadeDuration"
                v-model="fadeDuration"
              />

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
        $(this.$el).foundation('destroy');
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
    height: rem-calc(120);
    background: $black;
    color: $light-gray;
    transform: translateZ(0);

    input{
      height: rem-calc(30);
      width: rem-calc(50);
      text-align: center;
      display: inline-block;
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
