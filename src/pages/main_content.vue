<template>
    <div class="main">
        <div class="mian-content">
            <div class="markdown-body" ref="content" id="content" v-html="compiledMarkdown">
            </div>
        </div>
        <div class="menu">
            <md-aside/>
        </div>
    </div>
</template>
<script>
import str from '@/components/md_content.js';
import mdAside from "@/components/md_menu.vue";

import marked from 'marked';

let rendererMD = new marked.Renderer();

marked.setOptions({
    renderer: rendererMD,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

export default {
    data: function() {
        return {
        }
    },
    components: {
        mdAside
    },
    computed: {
        compiledMarkdown: function() {
            let index = 0;
            rendererMD.heading = function(text, level) {
                if (level < 3) {
                    return `<h${level} id="${index++}" class="jump" >${text}</h${level}>`;
                } else {
                    return `<h${level}>${text}</h${level}>`;
                }
            };
            return marked(str);
        }
    }
}
</script>
<style lang="less" scoped>
.main {
    width: 100%;
    background: #FCFCFC;
}
.content {
    margin-right: 200px;
} 
.mian-content {
    height: 100%;
    margin-right: 220px;
    color: #5c5c5c;
    word-wrap: break-word;
    border: 1px solid #dedede;
    background-color: #fff;
    padding: 20px 30px;
}
.menu {
    height: 100%;
    width: 200px;
    z-index: 2;
    position: fixed;
    right: 20px;
    top: 85px;
}
</style>

