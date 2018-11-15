import Vue from 'vue';
import VueRouter from 'vue-router';

import Layout from '@/pages/layout.vue'

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/demo'
        },
        {
            path: '/demo',
            name: 'demo',
            component: Layout
        }
    ]
})