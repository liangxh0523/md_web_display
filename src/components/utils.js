
// 根据md的内容，获取到标题
export const getTitle = (content) => {
    let nav = [];
    let navLevel = [1, 2];
    let tempArr = [];
    content
        .replace(/```/g, function() {
            return '\f';
        })
        .replace(/\f[^\f]*?\f/g, function() {
            return '';
        })
        .replace(/\r|\n+/g, function() {
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
        toAppendNavList = find(nav, {
            level: level
        });
        if (retNavs.length === 0) {
            // 处理一级标题
            retNavs = retNavs.concat(toAppendNavList);
        } else {
            // 处理二级标题，把二级标题加到相应的父节点的children中
            toAppendNavList.forEach(_ => {
                _ = Object.assign(_);
                let parentNavIndex = getParentIndex(nav, _.index);
                return appendToParentNav(retNavs, parentNavIndex, _);
            });
        }
    });
    //  此处的retNavs就是处理后的树
    return retNavs;
};

export const find = (arr, condition) => {
    return arr.filter(_ => {
        for (let key in condition) {
            if (condition.hasOwnProperty(key) && condition[key] !== _[key]) {
                return false;
            }
        }
        return true;
    });
};

export const getParentIndex = (nav, endIndex) => {
    //  从当前的index开始找 1.距离自己最近的（递减体现） 2.level比本身小的（越小越高）
    for (var i = endIndex - 1; i >= 0; i--) {
        if (nav[endIndex].level > nav[i].level) {
            return nav[i].index;
        }
    }
};

export const appendToParentNav = (nav, parentIndex, newNav) => {
    //  找到每一个二级标题的傅标题的index值
    let index = findIndex(nav, {
        index: parentIndex
    });
    if (index === -1) {
        // 这里处理的是三级及以下标题
        // 如果在一级标题里没找到父节点，就去每一个一级标题里的children里找
        let subNav;
        for (var i = 0; i < nav.length; i++) {
            // 处理没有父节点的情况
            subNav = nav[i];
            subNav.children.length && appendToParentNav(subNav.children, parentIndex, newNav);
        }
    } else {
        nav[index].children = nav[index].children.concat(newNav);
    }
};

export const findIndex = (arr, condition) => {
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
};


