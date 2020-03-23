<template>
  <el-container class="home_container">
    <!-- 主页头部 -->
    <el-header>
      <div>
        <img src="../assets/img/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="quitLogin" size="small">退出</el-button>
    </el-header>
    <el-container>
      <!-- 主页侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 折叠 -->
        <div class="toggle_menu" @click="toggleMenu">|||</div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#3E8BDD"
          unique-opened
          :collapse='isCollapse'
          :collapse-transition='false'
          router
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主页主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      menuList: [],
      iconList: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    quitLogin() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenus() {
      const res = await this.$http.get('menus')
      // console.log(res.data)
      const { meta, data } = res.data
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.menuList = data
    },
    // 折叠菜单栏
    toggleMenu() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    font-size: 20px;
    color: #fff;
    > div {
      display: flex;
      align-items: center;
      span {
        padding-left: 10px;
      }
    }
  }
  .el-container {
    .el-aside {
      background-color: #373d41;
      .toggle_menu{
        background-color: #4A5064;
        text-align: center;
        height: 25px;
        line-height: 25px;
        color: #fff;
        font-size: 12px;
        letter-spacing: 0.1em;
      }
      .el-menu{
        border-right:none;
      }
    }
    .el-main {
      background-color: #fff;
    }
  }
}
</style>
