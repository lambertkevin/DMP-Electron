<template>
  <div class="music-player">
    <audio
      ref="audioApi"
      :src="dance.path"
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
      ])
    },

    methods: {
      ...mapActions('musicPlayer', [
        'fadeOut'
      ]),

      ...mapMutations('musicPlayer', [
        'setDanceIsDone',
        'setVolume'
      ]),

      playMusic() {
        const audioApi = this.$refs.audioApi;
        const player = plyr.get('.plyr')[0];

        audioApi.pause();
        audioApi.currentTime = 0;
        this.setDanceIsDone(false);
        if (player.isMuted()) {
          player.toggleMute();
        }
        this.setVolume(1);

        audioApi.addEventListener('canplay', () =>
          audioApi.play()
        );
      },

      stopMusic() {
        this.$refs.audioApi.pause();
      },

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

      resetPlayer() {
        const audioApi = this.$refs.audioApi;

        audioApi.src = '';
        audioApi.load();
      }
    },

    watch: {
      dance(danceState) {
        if (!Object.keys(danceState).length) {
          this.resetPlayer();
        }
      },

      isPlaying(isPlayingState) {
        if (isPlayingState) {
          this.playMusic();
          this.setTimeUpdateEvent();
        }

        this.stopMusic();
      },

      volume() {
        const player = plyr.get('.plyr')[0];
        player.setVolume(this.volume * 10);
        this.$refs.audioApi.volume = this.volume;
      },

      musicDuration() {
        this.setTimeUpdateEvent();
      },

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
      this.setTimeUpdateEvent();
      plyr.setup();
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
      
      &__time{
        color: smart-scale($black, -20%);
      }

      &--audio{
        background: none;
        border: none;

        .plyr__controls{
          background: none;
          border: none;

          button{
            color: smart-scale($black, -20%);

            &.tab-focus:focus, &:hover{
              background: $blue;
            }
          }
        }
      }

      &__progress, &__volume{
        &--played, &--display{
          color: $blue;
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
