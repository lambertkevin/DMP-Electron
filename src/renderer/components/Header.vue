<template>
  <div class="header text-center">
    Championnat Régional 2018
  </div>
</template>

<script>
export default {
  name: 'Header'
};
</script>

<style lang="scss">

  /**
   * SMALL
   */
  .header {
    color: rgba($white, 0.75);
    font-family: $bentonSans;
    padding: rem-calc(4 0);
    background: $black;
    z-index: 2;
    position: fixed;
    width: 100vw;
    font-size: rem-calc(12);

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
