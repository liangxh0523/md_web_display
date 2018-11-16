<template>
    <div class="main">
        <div class="mian-content">
            <div class="markdown-body" ref="content" id="content" v-html="compiledMarkdown">
            </div>
        </div>
        <div class="menu">
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
        </div>
    </div>
</template>
<script>
import str from '@/components/md_content.js'
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
            highlightIndex: 0,
            contentMenu: []
        }
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
    },
    props: {
        // 此处可以根据 menuID 向后台获取当前 menu 内的md内容
        menuID: {
            type: String
        }
    },
    mounted() {
        this.$nextTick(function() {
            window.addEventListener('scroll', this.onScroll);
        });
    },
    created() {
        this.contentMenu = this.getTitle(str);
    },
    methods: {
        getTitle(content) {
            let nav = [];
            let navLevel = [1, 2];
            let tempArr = [];
            content
                .replace(/```/g, function(match) {
                    return '\f';
                })
                .replace(/\f[^\f]*?\f/g, function(match) {
                    return '';
                })
                .replace(/\r|\n+/g, function(match) {
                    return '\n';
                })
                // 以至少一个#开始，紧接非换行符外任意个字符进行惰性匹配，然后是一个换行符
                .replace(/(#+)[^#][^\n]*?(?:\n)/g, function(match, m1) {
                    let title = match.replace('\n', '');
                    let level = m1.length;
                    tempArr.push({
                        title: title.replace(/^#+/, '').replace(/\([^)]*?\)/, ''),
                        level: level,
                        children: []
                    });
                });
            //  tempArr得到的是全部1-6级标题，将一级和二级过滤出来
            nav = tempArr.filter(_ => _.level <= 2);
            let index = 0;
            //  在此处加index值，这里和标签里绑定的id是对应的
            nav = nav.map(_ => {
                _.index = index++;
                return _;
            });
            let retNavs = [];
            let toAppendNavList;
            navLevel.forEach(level => {
                // 遍历一级和二级标题，将同一级的元素组成一个新数组
                toAppendNavList = this.find(nav, {
                    level: level
                });
                if (retNavs.length === 0) {
                    // 处理一级标题
                    retNavs = retNavs.concat(toAppendNavList);
                } else {
                    // 处理二级标题，把二级标题加到相应的父节点的children中
                    toAppendNavList.forEach(_ => {
                        _ = Object.assign(_);
                        let parentNavIndex = this.getParentIndex(nav, _.index);
                        return this.appendToParentNav(retNavs, parentNavIndex, _);
                    });
                }
            });
            //  此处的retNavs就是处理后的树
            return retNavs;
        },
        //  处理属于同一级的标题，组成数组
        find(arr, condition) {
            return arr.filter(_ => {
                for (let key in condition) {
                    if (condition.hasOwnProperty(key) && condition[key] !== _[key]) {
                        return false;
                    }
                }
                return true;
            });
        },
        //  获取此节点的父节点
        getParentIndex(nav, endIndex) {
            //  从当前的index开始找 1.距离自己最近的（递减体现） 2.level比本身小的（越小越高）
            for (var i = endIndex - 1; i >= 0; i--) {
                if (nav[endIndex].level > nav[i].level) {
                    return nav[i].index;
                }
            }
        },
        //  找到同一个父节点的所有子节点
        appendToParentNav(nav, parentIndex, newNav) {
            //  找到每一个二级标题的傅标题的index值
            let index = this.findIndex(nav, {
                index: parentIndex
            });
            if (index === -1) {
                // 这里处理的是三级及以下标题
                // 如果在一级标题里没找到父节点，就去每一个一级标题里的children里找
                let subNav;
                for (var i = 0; i < nav.length; i++) {
                    // 处理没有父节点的情况
                    subNav = nav[i];
                    subNav.children.length && this.appendToParentNav(subNav.children, parentIndex, newNav);
                }
            } else {
                nav[index].children = nav[index].children.concat(newNav);
            }
        },
        //  找符合条件的数组中的成员
        findIndex(arr, condition) {
            let ret = -1;
            arr.forEach((item, index) => {
                for (var key in condition) {
                    if (condition.hasOwnProperty(key) && condition[key] !== item[key]) { // 不进行深比较
                        return false;
                    }
                }
                ret = index;
            });
            return ret;
        },
        onScroll() {
            console.log(1);
            let top = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop;
            let items = document.getElementById('content').getElementsByClassName('jump');
            let currentId = '';
            for (let i = 0; i < items.length; i++) {
                let _item = items[i];
                let _itemTop = _item.offsetTop;
                if (top > _itemTop - 75) {
                    currentId = _item.id;
                } else {
                    break;
                }
            }
            console.log(203);
            if (currentId) {
                this.highlightIndex = parseInt(currentId);
            }
        },
        handleHighlight(item) {
            this.highlightIndex = item;
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
                    document.body.scrollTop = distance;
                    document.documentElement.scrollTop = distance;
                    setTimeout(smoothDown, 10);
                } else {
                    document.body.scrollTop = total;
                    document.documentElement.scrollTop = total;
                }
            }
            function smoothUp() {
                if (distance > total) {
                    distance -= step;
                    document.body.scrollTop = distance;
                    document.documentElement.scrollTop = distance;
                    setTimeout(smoothUp, 10);
                } else {
                    document.body.scrollTop = total;
                    document.documentElement.scrollTop = total;
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.main {
    width: 100%;
    height: 100%;
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

