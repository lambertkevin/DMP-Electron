<template>
  <div class="loading-spinner">
    <div class="loading-spinner__spinner"></div>
    <div class="loading-spinner__text">
      It will take a few minutes...
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LoadingSpinner'
  };
</script>

<style lang="scss">

  /**
   * SMALL
   */
  .loading-spinner {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    color: $white;

    &__text{
      position: fixed;
      top: 40%;
      left: 50%;
      margin-top: 50px;
      transform: translate(-50%, -50%);
      width: rem-calc(300);
      font-size: rem-calc(14);
      text-align: center;
      font-weight: bold;
    }
    &__spinner{
      width: 40px;
      height: 40px;
      background-color: $white;

      position: fixed;
      top: 40%;
      left: 50%;
      margin: -20px 0 0 -20px;
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
