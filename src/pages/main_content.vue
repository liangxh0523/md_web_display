<template>
    <div class="main">
        <div class="mian-content">
            <div class="markdown-body" ref="content" id="content" v-html="compiledMarkdown">
            </div>
        </div> 
        <div class="menu">
            <md-aside :mode="mode"/>
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
            mode: '',
            compiledMarkdown: ''
        }
    },
    components: {
        mdAside
    },
    watch: {
        '$route.path': {
            immediate:true,
            handler: function(newValue) {
                this.mode = newValue.slice(1);
                let index = 0;
                //  在rendererMD.heading里有自己的作用域，用this访问不到
                let mode = this.mode
                // 这里的处理只是为了同时展示多个demo
                // 原声JS的优点：兼容性好    缺点：代码长、复杂
                // css方式和JS的scrollIntoView()方法的优点： 代码简单优美   缺点：不能兼容safari浏览器，兼容opera、chrome、firefox
                rendererMD.heading = function(text, level) {
                    if (level < 3) {
                        if (mode === 'raw_js_demo') {
                            return `<h${level} id="${index++}" class="jump" >${text}</h${level}>`;
                        } else if (mode === 'css_demo') {
                            return `<div class="jump offset" id="${index++}"></div><h${level}>${text}</h${level}>`;
                        } else if (mode === 'scroll_into_view') {
                           return `<div class="jump offset"></div><h${level}>${text}</h${level}>`;
                        }
                    } else {
                        return `<h${level}>${text}</h${level}>`;
                    }
                };
                document.getElementsByTagName("html")[0].style['scroll-behavior'] = this.mode === 'css_demo' ? 'smooth' : '';
                this.compiledMarkdown = marked(str);
            }
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

