import Vue from 'vue';
import VueRouter from 'vue-router';

import MainContent from '@/pages/main_content.vue';
import Parent from '@/pages/parent.vue';

Vue.use(VueRouter);

export default new VueRouter({
    // 这里的mode应该设置为history，但是因为这是
    // 一个demo，没有后台，并且，不可以是hash，否则和锚点处理冲突
    mode: 'abstract',
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