<template>
  <transition name="fade">
    <div class="loading-spinner">
      <div class="loading-spinner__spinner"></div>
      <div class="loading-spinner__text">
        It will take a few minutes... <br />
        <progress
          v-if="songsTreated"
          class="uk-progress"
          :value="songsTreated"
          :max="totalSongs"
        >
        </progress>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LoadingSpinner',

  data() {
    return {
      songsTreated: 0,
      totalSongs: 0
    };
  },

  methods: {

    /**
       * Ipc receiving the progress of the generation of the timetable
       *
       * @return {void}
       */
    getProgress() {
      const updateProgress = (res) => {
        this.songsTreated = res.songsTreated;
        this.totalSongs = res.totalSongs;
      };

      if (!process.env.IS_WEB) {
        this.$electron.ipcRenderer.on('progress-update', (event, res) => {
          updateProgress(res);
        });
      } else {
        this.$socket.on('progress-update', (res) => {
          updateProgress(res);
        });
      }
    }
  },

  /**
     * Lifecycle
     *
     * @return {void}
     */
  mounted() {
    this.getProgress();
  }
};
</script>

<style lang="scss">

  /**
   * SMALL
   */
  .loading-spinner {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    color: $white;

    &__text{
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: rem-calc(300);
      font-size: rem-calc(14);
      text-align: center;
      font-weight: bold;
      margin-top: 40px;

      .uk-progress{
        background-color: smart-scale($details, -40%);
        height: rem-calc(5);
        border-radius: rem-calc(10);
        margin-top: rem-calc(5);

        &::-webkit-progress-value{
          background-color: $white;
        }

        &::-webkit-progress-bar{
          background-color: smart-scale($details, -40%);
        }
      }
    }
    &__spinner{
      width: 40px;
      height: 40px;
      background-color: $white;

      position: fixed;
      top: 50%;
      left: 50%;
      margin: -30px 0 0 -20px;
      -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
      animation: sk-rotateplane 1.2s infinite ease-in-out;
    }

    @-webkit-keyframes sk-rotateplane {
      0% { -webkit-transform: perspective(120px) }
      50% { -webkit-transform: perspective(120px) rotateY(180deg) }
      100% { -webkit-transform: perspective(120px) rotateY(180deg)  rotateX(180deg) }
    }

    @keyframes sk-rotateplane {
      0% {
        transform: perspective(120px) rotateX(0deg) rotateY(0deg);
        -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)
      } 50% {
        transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
        -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)
      } 100% {
        transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
        -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
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
