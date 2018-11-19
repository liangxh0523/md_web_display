<template>
    <div class="aside">
        <el-menu
            :default-active="activeName"
            background-color="#3A4474"
            text-color="#fff"
            router>
            <template 
                v-for="item in menuList">
                <el-submenu 
                    v-if="item.children.length" 
                    :key="item.index"
                    :index="item.index">
                    <template slot="title">
                        <span>{{item.name}}</span>
                    </template>
                    <el-menu-item 
                        v-for="sub in item.children" 
                        :key="sub.index"
                        :index="sub.index">
                        <span>{{sub.name}}</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item 
                    v-else 
                    :key="item.index"
                    :index="item.index">
                    <span>{{item.name}}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>
<script>
    export default {
        data: function() {
            return {
                menuList: [
                    {
                        name: '默认激活第一项',
                        index: 'raw_js',
                        children: []
                    },
                    {
                        name: '第二项菜单',
                        index: 'demo_02',
                        children: [
                            {
                                name: '子菜单一',
                                index: 'child_01'
                            },
                            {
                                name: '子菜单二',
                                index: 'child_02'
                            },
                            {
                                name: '子菜单三',
                                index: 'child_03'
                            },
                            {
                                name: '子菜单四',
                                index: 'child_04'
                            }
                        ]
                    },
                    {
                        name: '第三项菜单',
                        index: 'demo_03',
                        children: []
                    }
                ]
            }
        },
        computed: {
            activeName: function() {
                return this.$route.path.split('/').reverse()[0] || '';
            }
        },
        created() {
            if (!this.activeName) {
                this.initRouter();
            }
        },
        methods: {
            initRouter() {
                // let defaultPath = this.menuList.length > 0 ? (this.menuList[0].children.length > 0 ? this.menuList[0].children[0].index : this.menuList[0].index) : '';
                // let param = {
                //     name: 'raw_js',
                //     params: {
                //         menuID: defaultPath
                //     }
                // };
                this.$router.push('raw_js');
            }
        }
    }
</script>
<style lang="less" scoped>
.aside {
    height: 100%;
    background-color: #3A4474;
}
.el-menu {
    border-right: none;
}
.el-menu-item.is-active {
    background-color: #2E385D!important;
    border-left: 4px solid #409EFF;
}
</style>
