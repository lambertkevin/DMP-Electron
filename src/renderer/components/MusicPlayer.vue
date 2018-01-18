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

        audioApi.pause();
        audioApi.currentTime = 0;
        this.setDanceIsDone(false);
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
    },


    /**
     * Lifecyle
     *
     * @return {void}
     */
    destroyed() {
    }
  };
</script>

<style lang="scss">

  /**
   * SMALL
   */
  .music-player {

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
