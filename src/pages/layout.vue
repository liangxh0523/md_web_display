<template>
    <el-container class="chunk">
            <el-header>
                <div class="title">
                    <img src="@/assets/icon.png" alt="图标" @click="jumpMoreInfo">
                    <span>md在网页的良好展示</span>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <a-side/>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
</template>
<script>
import Aside from "@/pages/aside.vue";

export default {
    data: function() {
        return {

        }
    },
    components: {
        ASide: Aside
    },
    methods: {
        jumpMoreInfo() {
            // url 是项目的详细介绍
            let url = 'https://juejin.im/post/5be1469fe51d457c1f756a37';
            window.open(url);
        }
    }
}
</script>
<style lang="less" scoped>
.el-container {
    width: 100%;
    .el-header {
        position: fixed;
        height: 60px;
        width: 100%;
        z-index: 3;
        border-bottom: 1px solid #dedede;
        background-color: #fff;
        img {
            margin: 10px 0 0 40px;
            width: 40px;
            height: 40px;
            cursor: pointer;
        }
        span {
            position: absolute;
            top: 15px;
            left: 110px;
            font-size: 24px;
        }
    }
    .el-aside {
        position: fixed;
        width: 200px;
        height: 100%;
        margin-top: 60px;
        border-right: 1px solid #dedede;
    }
    .el-main {
        margin: 60px 0 0 200px;
        height: 100%;
        background-color: #FCFCFC;
    }
}
</style>
