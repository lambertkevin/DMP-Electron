import Vue from 'vue';
import App from './App';
import store from './store';

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'));
} else {
  const vueSocket = require('vue-socket.io').default;
  Vue.use(vueSocket, 'http://kevinlambert.fr:3000');
}
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app');
