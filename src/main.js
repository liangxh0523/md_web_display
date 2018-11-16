import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import router from '@/router/router.js'

import Layout from '@/pages/layout.vue';

import '@/static/main.css'
import '@/static/markdown.css'

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(Layout),
}).$mount('#app');
