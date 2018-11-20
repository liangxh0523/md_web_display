<template>
    <div ref="menu">
        <div class="title">
            文章目录
        </div>
        <div id="menu">
            <ul class="nav-list">
                <li v-for="(nav, index) in contentMenu" :key="index">
                    <a :href="'#' + nav.index" :class="{'active': highlightIndex === nav.index}" @click="handleHighlight(nav.index)" :key="nav.index">{{nav.title}}
                    </a>
                    <template v-if="nav.children.length > 0">
                        <ul class="nav-list">
                            <li v-for="(item, index) in nav.children" :key="index">
                                <a :href="'#' + item.index" :class="{active: highlightIndex === item.index}" :key="item.index" @click="handleHighlight(item.index)">{{item.title}}
                                </a>
                            </li>
                        </ul>
                    </template>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import str from '@/components/md_content.js';
import {getTitle} from '@/components/utils.js';
export default {
    data: function() {
        return {
            highlightIndex: 0,
            contentMenu: []
        }
    },
    props: {
        mode: {
            type: String
        }
    },
    mounted() {
        this.$nextTick(function() {
            window.addEventListener('scroll', this.onScroll);
        });
    },
    created() {
        this.contentMenu = getTitle(str);
    },
    // 如果还有别的组件，一定要移除掉 scroll的监听事件
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll);
    },
    methods: {
        handleHighlight(item) {
            this.highlightIndex = item;
            if (this.mode === 'raw_js_demo') {
                this.rawJsScroll(item);
            } else if (this.mode === 'scroll_into_view') {
                let jump = document.querySelectorAll('.jump');
                jump[item].scrollIntoView({
                    block: 'start',
                    behavior: "smooth"
                });
            }
        },
        onScroll() {
            let top = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop;
            let items = document.getElementById('content').getElementsByClassName('jump');
            let currentId = '';
            for (let i = 0; i < items.length; i++) {
                let _item = items[i];
                let _itemTop = _item.offsetTop;
                //  处理不同方式时的偏移量不同
                let height = this.mode === 'raw_js_demo' ? 75 : (this.mode === 'css_demo' ? 10 : 0);
                if (top > _itemTop - height) {
                    currentId = i;
                } else {
                    break;
                }
            }
            if (currentId) {
                this.highlightIndex = parseInt(currentId);
            }
        },
        rawJsScroll(item) {
            let jump = document.querySelectorAll('.jump');
            //  这里的60是header的高度值
            let total = jump[item].offsetTop - 60;
            let distance = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            // 平滑滚动，时长500ms，每10ms一跳，共50跳
            let step = total / 50;
            if (total > distance) {
                smoothDown();
            } else {
                let newTotal = distance - total;
                step = newTotal / 50;
                smoothUp();
            }
            function smoothDown() {
                if (distance < total) {
                    distance += step;
                    window.scrollTo(0, distance);
                    setTimeout(smoothDown, 10);
                } else {
                    window.scrollTo(0, total);
                }
            }
            function smoothUp() {
                if (distance > total) {
                    distance -= step;
                    window.scrollTo(0, distance);
                    setTimeout(smoothUp, 10);
                } else {
                    window.scrollTo(0, total);
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.nav-list {
   margin-left: 15px;
   padding-left: 0;
   font-size: 14px;
   a {
       display: block;
       color: #333;
       &:link, &:visited {
           text-decoration: none;
       }
       &:hover {
           text-decoration: underline;
       }
       &.active {
           color: #409EFF;
           font-weight: 600;
       }
   }
   a {
       line-height: 1.2em!important;
       margin: 9px 0;
   }

}
ul {
    list-style-type: disc;
    ul {
        list-style-type: circle;
    }
}
.title {
    // text-align: center;
    font-size: 18px;
    margin-bottom: 10px;
    margin-left: 15px;
}
</style>