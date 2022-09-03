import Vue from 'vue'
import App from './App.vue'
import "tailwindcss/tailwind.css";
Vue.config.productionTip = false
import { rtdbPlugin } from 'vuefire';
Vue.use(rtdbPlugin)
import 'flowbite';
new Vue({
  render: h => h(App),
}).$mount('#app')
