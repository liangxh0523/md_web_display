import Vue from 'vue';
import VueRouter from 'vue-router';

import MainContent from '@/pages/main_content.vue';
import Parent from '@/pages/parent.vue';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Parent,
            children: [
                {
                    path: '',
                    component: MainContent
                },
                {
                    path: ':menuID',
                    name: 'demo',
                    component: MainContent,
                    props: true
                }
            ]
        }
    ]
})