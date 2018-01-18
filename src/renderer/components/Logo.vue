<template>
  <div class="logo text-center">
    <img src="/static/images/logo.svg" />
  </div>
</template>

<script>
  export default {
    name: 'Logo'
  };
</script>

<style lang="scss">

  /**
   * SMALL
   */
  .logo {
    color: $black;
    padding: rem-calc(20 0 30);

    img{
      max-width: rem-calc(70);
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
