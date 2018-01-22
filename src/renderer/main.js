import Vue from 'vue';
import vueSocket from 'vue-socket.io';
import App from './App';
import store from './store';

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'));
}
Vue.use(vueSocket, 'http://localhost:3000');
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app');
