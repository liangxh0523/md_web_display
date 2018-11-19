### [此项目只是一个简单的demo：详细介绍](https://juejin.im/post/5be1469fe51d457c1f756a37)

喜欢请点起来 star～
## 先上成果图

![](https://user-gold-cdn.xitu.io/2018/11/6/166e830251bbf7ea?w=2852&h=1630&f=png&s=2890302)

# 网页的布局
网页布局分为三部分，分别是
- 头部header，固定定位
- 侧边栏aside，固定定位,margin-top的值是header的高度
- 内容contain，静态定位, margin-top值为header的高度，margin-left的值为aside的宽度，是router-view的出口。分为两部分：
    - 主内容，显示md转换后的html页面，margin-right值为md目录的宽度值
    - 提取markdown的h1和h2目录，用于标题导航，固定定位

# 功能
为了md能在网页上良好的展示，应具备以下功能：
1. 点击左侧的菜单，可以获取到相应的md内容（字符串格式），将md内容转成html，为一级、二级标题加锚点id
2. 为html增加md的格式，引入一个css即可，[参考网址](https://github.com/sindresorhus/github-markdown-css)
3. 提取md中的一级二级标题，在右侧显示文章目录
4. 点击右侧文章目录，左侧内容可定位到相应的位置，还要做平滑滚动处理，增强用户体验
5. 左侧内容滚动时，右侧目录的激活项随之动态变化

## md转成html
我使用了marked.js将md转成html，并在这里为h1和h2加上了id值，作为锚点
```
//  先安装marked.js到本地
npm install marked --save
//  在组件内引入marked
import marked from 'marked';
//  marked的基本设置
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
//  实例化
let rendererMD = new marked.Renderer();
// 在计算属性中，处理md的h1、h2，加上id值，并使用marked转成html
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
        return marked(this.content);
    }
}
```
在html中，用v-html绑定此计算属性即可
```
<div class="markdown-body" ref="content" id="content" v-html="compiledMarkdown">
```
## 提取标题
```
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
```
## md目录的展示和锚点定位
```
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
```
## 平滑滚动
在md的目录中，a标签里已经设置了href值，进行了锚点定位，在点击目录绑定的事件里做了平滑处理
```
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
```
## 主内容滚动，目录高亮
在阅读md内容时，随着滚动条的变化，目录的高亮项也随着变化
```
mounted() {
    this.$nextTick(function() {
        window.addEventListener('scroll', this.onScroll);
    });
},
methods: {
    onScroll() {
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
        if (currentId) {
            //  这里的currentOId是字符串，必须转换成数字，否则高亮项的全等无法匹配
            this.highlightIndex = parseInt(currentId);
        }
    }
}
```
 ## Summary
 
以上就是如何让md在网页上良好展示的全部功能，谷歌了多次，感谢分享经验的艾瑞巴dei，开源万岁～！ 

待改进的点有：
- 如何避免非标题的#的正则匹配，比如```// #这不是标题``` 格式的内容
- md中h1和h2标签的处理，md中是允许html的，现在不能满足匹配h1、h2的标签


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

