<template>
  <div class="default"></div>
</template>

<script>
export default {
  name: 'Default',

  data() {
    return {};
  },

  computed: {},

  methods: {


    /**
       * Method example
       *
       * @param  {String} paramName [default = defaultContent]
       * @return {Boolean}
       */
    methodName(paramName = 'defaultContent') {
      // Method logic
      return paramName;
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
      const $ = require('jquery');
      $(this.$el).foundation('destroy');
    }
  }
};
</script>

<style lang="scss">

  /**
   * SMALL
   */
  .default {

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
