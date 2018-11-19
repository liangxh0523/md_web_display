import Vue from 'vue';
import VueRouter from 'vue-router';

import RawJS from '@/pages/main_content.vue';

Vue.use(VueRouter);

export default new VueRouter({
    // 这里的mode应该设置为history，但是因为这是
    // 一个demo，没有后台，并且，不可以是hash，否则和锚点处理冲突
    mode: 'abstract',
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/raw_js'
        },
        {
            path: '/raw_js',
            name: 'raw_js',
            component: RawJS,
        }
    ]
})