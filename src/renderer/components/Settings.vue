<template>
  <div class="settings">
    <span
      class="settings__text"
      :class="{
        'settings__text--black': isOpen,
        'settings__text--show': isHover
      }"
    >
      {{ text }}
    </span>
    <span
      v-show="!isOpen"
      class="settings__icon"
      :class="{
        'settings__icon--black': isOpen
      }"
      @click="isOpen = !isOpen"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
      uk-icon="icon: cog; ratio: 0.7"
    ></span>
    <span
      v-show="isOpen"
      class="settings__icon"
      :class="{
        'settings__icon--black': isOpen
      }"
      @click="isOpen = false"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
      uk-icon="icon: close; ratio: 0.7"
    >
    </span>
    <div
      class="settings__panel box-shadow"
      :class="{
        'settings__panel--open': isOpen
      }"
    >
      <div class="settings__panel__content">
        <div>
          <span
            class="button"
            @click="reset"
          >
            <span uk-icon="icon: history; ratio: 0.5"></span>
            <span class="button__text">
              Reset rounds
            </span>
          </span>
        </div>
        <div>
          <span
            class="button"
            @click="generate"
          >
            <span uk-icon="icon: refresh; ratio: 0.5"></span>
            <span class="button__text">
              Regenerate timetable
            </span>
          </span>
        </div>
        <div>
          <span
            class="button"
            @click="checkForUnkownSongs"
          >
            <span uk-icon="icon: pencil; ratio: 0.5"></span>
            <span class="button__text">
              Check for unknown songs
            </span>
          </span>
        </div>
        <div>
          <span
            class="button"
            @click="createFolders"
          >
            <span uk-icon="icon: folder; ratio: 0.5"></span>
            <span class="button__text">
              Create folders
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Settings',

    computed: {
      text() {
        return this.isOpen ? 'close' : 'settings';
      },

      isOpen: {
        get() {
          return this.$store.state.settings.isOpen;
        },
        set(val) {
          this.$store.commit('settings/setIsOpen', val);
        }
      },

      isHover: {
        get() {
          return this.$store.state.settings.isHover;
        },
        set(val) {
          this.$store.commit('settings/setIsHover', val);
        }
      }
    },

    methods: {
  
      /**
       * Toggle the isOpen state
       *
       * @return {void}
       */
      toggleSettings() {
        this.isOpen = !this.isOpen;
      },

      /**
       * Reset the timetable and set isDone to true for every song and round
       *
       * @return {void}
       */
      reset() {
        this.$store.commit('timetable/resetTimetable');
        this.toggleSettings();
        this.$store.commit('musicPlayer/setDance', {});
        this.$store.commit('musicPlayer/setIsPlaying', false);
      },

      /**
       * Generate the timetable
       *
       * @return {void}
       */
      generate() {
        this.$store.commit('timetable/clearRounds');
        this.$store.dispatch('timetable/generateTimetable');
        this.toggleSettings();
        this.$store.commit('musicPlayer/setDance', {});
        this.$store.commit('musicPlayer/setIsPlaying', false);
      },

      /**
       * Determine if there is songs that need to be recognized
       * because name and bpm failed
       *
       * @return {void}
       */
      checkForUnkownSongs() {
        const unknownSongs = this.$store.getters['timetable/getUnknownSongs'];
        this.$store.commit('settings/setIsLookingForUnknownSongs', unknownSongs.length >= 1);
        this.$store.commit('timetable/setUnknownSongs', unknownSongs);
        this.toggleSettings();
      },

      /**
       * Create all the necessary folders to put the songs for each round
       *
       * @return {void}
       */
      createFolders() {
        if (!process.env.IS_WEB) {

          this.$electron.ipcRenderer.send('create-folders');
          this.$electron.ipcRenderer.on('create-folders-response', (event, res) => {
            if (res.code === 200) {
              console.log('Folder created');
            } else {
              console.error(res.error);
            }
            this.toggleSettings();
          });
  
        } else {

          this.$socket.emit('create-folders');
          this.$socket.on('create-folders-response', (res) => {
            if (res.code === 200) {
              console.log('Folders created');
            } else {
              console.error(res.error);
            }
            this.toggleSettings();
          });
  
        }
      }
    }
  };
</script>

<style lang="scss">

  /**
   * SMALL
   */
  .settings {
    $class: &;
    position: fixed;
    top: rem-calc(0);
    right: rem-calc(10);
    z-index: 5;

    &__text{
      font-family: $nexa;
      display: inline-block;
      font-weight: bold;
      text-transform: uppercase;
      font-size: rem-calc(8);
      letter-spacing: rem-calc(2);
      vertical-align: middle;
      opacity: 0;
      transform: translateX(10px);
      color: $white;
      transition: all 0.3s ease;

      &--black{
        color: $black;
      }

      &--show{
        opacity: 1!important;
        transform: translateX(0)!important;
      }
    }

    &__icon{
      cursor: pointer;
      transition: all 0.3s ease;

      svg * {
        stroke: $white!important;
      }

      &--black{
        svg * {
          stroke: $black!important;
        }
      }
    }

    &__panel {
      position: absolute;
      background: $white;
      top: -5px;
      right: -10px;
      z-index: -1;
      width: 15.475rem;
      padding: 2rem;
      border-bottom-left-radius: 5px;
      transform: scale(0);
      transform-origin: top right;
      transition: all 0.3s ease;

      &--open{
        transform: scale(1);
      }

      &__content{
        > div {
          &:last-child{
            .button{
              margin-bottom: 0;
            }
          }
        }
      }

      .button{
        width: 100%;
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
