module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    jquery: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended'    
  ],  
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'no-multi-assign': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'import/no-webpack-loader-syntax': 0,
    'comma-dangle': ['error', 'never'],
    'no-multi-spaces': 0,
    'max-len': ['warn', 150],
    'no-underscore-dangle': 0,  
    // Vuex necessity
    "no-param-reassign": ['error', { 
        "props": false
    }],
    // Vue Styleguide
    'vue/no-dupe-keys': 'error',
    'vue/no-duplicate-attributes': 'error',
    'vue/no-reserved-keys': 'error',
    'vue/no-shared-component-data': 'error',
    'vue/no-template-key': 'error',
    'vue/require-render-return': 'error',
    'vue/require-valid-default-prop': 'error',
    'vue/return-in-computed-property': 'error',
    'vue/html-end-tags': 'error',
    'vue/no-async-in-computed-properties': 'error',
    'vue/no-duplicate-attributes': 'error',
    'vue/no-side-effects-in-computed-properties': 'error',
    'vue/order-in-components': [2, {
      'order': [
        ['name', 'delimiters', 'functional', 'model'],
        ['components', 'directives', 'filters'],
        ['parent', 'mixins', 'extends', 'provide', 'inject'],
        'el',
        'template',
        'props',
        'propsData',
        'data',
        'computed',
        'methods',
        'watch',                
        'LIFECYCLE_HOOKS',
        'render',
        'renderError'
      ]
    }],
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    'vue/this-in-template': 'error',
    'vue/attribute-hyphenation': 'error',
    'vue/html-quotes': 'error',
    'vue/html-self-closing': 0,
    'vue/max-attributes-per-line': 'error',
    'vue/mustache-interpolation-spacing': 'error',
    'vue/name-property-casing': 'error',
    'vue/no-multi-spaces': 'error',
    'vue/v-bind-style': 'error',
    'vue/v-on-style': 'error'
  }
}
