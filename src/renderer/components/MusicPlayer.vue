<template>
  <div class="music-player">
    <audio
      ref="audioApi"
      :src="path"
      controls
    />
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import plyr from 'plyr';

  export default {
    name: 'MusicPlayer',

    computed: {
      ...mapState('musicPlayer', [
        'dance',
        'isPlaying',
        'volume',
        'musicDuration',
        'fadeDuration'
      ]),

      ...mapState('settings', [
        'localPath'
      ]),

      /**
       * Modify the path to make it possible to open in Electron bundle
       *
       * @return {void}
       */
      path() {
        if (!process.env.IS_WEB) {
          return this.dance.path ? `file://${this.dance.path}` : null;
        } else {
          return this.dance.path ? this.dance.path.replace(this.localPath, 'music') : null;
        }
      }
    },

    methods: {
      ...mapActions('musicPlayer', [
        'fadeOut'
      ]),

      ...mapMutations('musicPlayer', [
        'setDanceIsDone',
        'setVolume'
      ]),

      /**
       * Reset the volume and start playing the music
       *
       * @return {void}
       */
      playMusic() {
        const audioApi = this.$refs.audioApi;
        const player = plyr.get('.plyr')[0];

        audioApi.pause();
        audioApi.currentTime = 0;
        this.setDanceIsDone(false);
        if (player.isMuted()) {
          player.toggleMute();
        }
        if (!this.volume){
          this.setVolume(1);
        }

        audioApi.addEventListener('canplay', () =>
          audioApi.play()
        );
      },

      /**
       * Pause the player
       *
       * @return {void}
       */
      stopMusic() {
        this.$refs.audioApi.pause();
      },

      /**
       * Set the interval loop the check for the good musicDuration before fadeOut
       *
       * @return {void}
       */
      setTimeUpdateEvent() {
        const audioApi = this.$refs.audioApi;
  
        const stopMusic = () => {
          const musicDuration = this.musicDuration - this.$store.state.musicPlayer.fadeDuration;
          if (
            audioApi.currentTime > musicDuration
            && !audioApi.paused
            && !this.$store.state.musicPlayer.isFading
          ) {
            this.fadeOut();
            audioApi.removeEventListener('timeupdate', stopMusic);
          }
        };

        audioApi.removeEventListener('timeupdate', stopMusic);
        audioApi.addEventListener('timeupdate', stopMusic);
      },

      /**
       * Reset the src of the player and make it look not activated in the browser
       *
       * @return {void}
       */
      resetPlayer() {
        const audioApi = this.$refs.audioApi;

        audioApi.src = '';
        audioApi.load();
      },

      /**
       * Set the volume from plyr in data on change
       *
       * @return {void}
       */
      onPlyrVolumeChange() {
        const player = plyr.get('.plyr')[0];

        player.on('volumechange', () => {
          this.setVolume(player.getVolume());
        });
      }
    },

    watch: {

      /**
       * Watch changes of dance object to reset the player if it's empty
       *
       * @param {Object} danceState
       * @return {void}
       */
      dance(danceState) {
        if (!Object.keys(danceState).length) {
          this.resetPlayer();
        }
      },

      /**
       * Watch changes of isPlayer to start the music when it's true
       *
       * @param {Boolean} isPlayingState
       * @return {void}
       */
      isPlaying(isPlayingState) {
        if (isPlayingState) {
          this.playMusic();
          this.setTimeUpdateEvent();
        }

        this.stopMusic();
      },

      /**
       * Watch changes of volume to update the player
       *
       * @return {void}
       */
      volume() {
        const player = plyr.get('.plyr')[0];
        player.setVolume(this.volume * 10);
        this.$refs.audioApi.volume = this.volume;
      },

      /**
       * Watch changes of musicDuration to update interval loop
       *
       * @return {void}
       */
      musicDuration() {
        this.setTimeUpdateEvent();
      },

      /**
       * Watch changes of musicDuration to update interval loop
       *
       * @return {void}
       */
      fadeDuration() {
        this.setTimeUpdateEvent();
      }
    },

    /**
     * Lifecyle
     *
     * @return {void}
     */
    mounted() {
      plyr.setup(this.$refs.audioApi);
      this.setTimeUpdateEvent();
      this.onPlyrVolumeChange();
    },
  };
</script>

<style lang="scss">
  @import "~plyr/src/scss/plyr";

  /**
   * SMALL
   */
  .music-player {

    .plyr{
      $notBlackColor: $turquoise;
      
      &__time{
        color: smart-scale($black, -20%);
      }

      &--audio{
        background: none;
        border: none;

        .plyr{
          &__controls{
            background: none;
            border: none;

            button{
              color: smart-scale($black, -20%);

              &.tab-focus:focus, &:hover{
                background: $notBlackColor;
              }
            }
          }

          &__progress{
            &--buffer{
              background: smart-scale($details, -40%);
            }
          }
        }
      }

      &__progress, &__volume{
        &--played, &--display{
          color: $notBlackColor;
          overflow: hidden;
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
