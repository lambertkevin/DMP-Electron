<template>
  <div
    v-if="hasLoadedMusicType"
    id="app"
  >
    <dmp-settings></dmp-settings>
    <div
      class="app__hider"
      :class="{
        'app__hider--show': areSettingsOpen
      }"
    ></div>
    <div
      class="app__container"
      :class="{
        'app__container--blur': areSettingsOpen
      }"
    >
      <dmp-header></dmp-header>
      <dmp-loading-spinner
        v-if="isLoading"
      ></dmp-loading-spinner>
      <transition name="fade" appear>
        <dmp-playlist-table
          v-if="!isLoading"
        ></dmp-playlist-table>
      </transition>
      <dmp-footer></dmp-footer>
      <dmp-modal-unknown-song></dmp-modal-unknown-song>
    </div>
  </div>
</template>

<script>
  import 'script-loader!jquery';
  import 'script-loader!what-input';
  import { mapState } from 'vuex';
  import Foundation from 'foundation-sites';
  import DmpHeader from '@/components/Header';
  import DmpSettings from '@/components/Settings';
  import DmpLoadingSpinner from '@/components/LoadingSpinner';
  import DmpPlaylistTable from '@/components/PlaylistTable';
  import DmpModalUnknownSong from '@/components/ModalUnknownSong';
  import DmpFooter from '@/components/Footer';

  export default {
    name: 'App',

    components: {
      DmpSettings,
      DmpHeader,
      DmpLoadingSpinner,
      DmpPlaylistTable,
      DmpModalUnknownSong,
      DmpFooter
    },

    computed: {
      ...mapState('settings', {
        areSettingsOpen: state => state.isOpen,
        musicTypes: state => state.musicTypes
      }),
      ...mapState('timetable', {
        isLoading: state => state.isLoading
      }),

      hasLoadedMusicType() {
        if (this.musicTypes && Object.keys(this.musicTypes).length) {
          return true;
        }
        return false;
      }
    },

    methods: {
      initFolder() {
        const checkResponse = (response) => {
          if (response.code === 200){
          console.log('Init Folder Ok');
          } else {
            console.error('ERROR MAMENE', response.error);
          }
        };

        if (process.env.IS_WEB) {
          checkResponse(this.$electron.ipcRenderer.sendSync('init'));
        } else {
          this.$socket.emit('init', (res) => {
            checkResponse(res);
          })
        }
      }
    },


    created() {
      this.$store.dispatch('settings/getMusicTypes');
      this.initFolder();
    },

    /**
     *
     * Lyfecyle
     *
     * @return {void}
     */
    mounted() {
      const $ = require('jquery');
      Foundation.addToJquery($);
      $(document).foundation();
    }
  };
</script>


<style lang="scss">
  @import "src/renderer/assets/sass/app";
  @import '~uikit/dist/css/uikit';


  body, html{
    height: 100%;
  }

  /**
   * SMALL UP
   */
  #app, .app{
    height: calc(100% - 110px);
    overflow: scroll;
    -webkit-app-region: drag;

    *{
      user-select: none;
    }

   &__container {
      transition: all 0.5s ease;

      &--blur{
        // filter: blur(2px);
        &:after{
          opacity: 1;
        }
      }
    }

    &__hider{
      position: fixed;
      background: rgba($black, 0.98);
      height: 100%;
      width: 100%;
      top:0;
      left: 0;
      opacity: 0;
      z-index: 2;
      transition: all 0.5s ease;
      pointer-events: none;

      &--show{
        opacity: 1;
        pointer-events: auto;
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

