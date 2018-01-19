module.exports = {
  extends: 'eslint-config-airbnb-base',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true
  },
  rules: {
    'valid-jsdoc': ['error', {
      requireReturnType: true,
      requireReturnDescription: false,
      requireParamDescription: false,
    }],
    'comma-dangle': ['error', 'never'],
    'no-multi-spaces': 0,
    "no-param-reassign": ['error', { 
      "props": false
    }]
  }
}
