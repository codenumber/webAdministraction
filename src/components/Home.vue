<template>

  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <div class="collapse" @click="changeCollapse">|||</div>
        <el-menu
              background-color="#313743"
              text-color="#fff"
              active-text-color="#409dff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
              <el-submenu :index="'/' + item.path" v-for="item in menuList" :key="item.id">
                <template slot="title">
                  <i :class="iconList[item.id]"></i>
                  <span>{{item.authName}}</span>
               </template>

                <el-menu-item :index="'/' + submenu.path" v-for="submenu in item.children" :key="submenu.id" @click="saveNavPath('/' + submenu.path)">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      <span>{{submenu.authName}}</span>
                   </template>
                </el-menu-item>
              </el-submenu>

            </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-set-up',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    getMenuList() {
      this.$axios.get('menus').then(res => {
        console.log(res)
        const { data: content} = res
        if (content.meta.status != 200) return this.$message.error('获取列表数据失败')
        this.$message.success(content.meta.msg)
        this.menuList = content.data
      })
    },
    changeCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavPath(activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath',activePath)
    }
  }
}
</script>

<style language="less" scoped>
.el-header {
  background-color: #363d40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 0;
  color: #fff;
  >div {
    padding: 5px;
    align-items: center;
    display: flex;
    img {
      width :auto;
      height: 60px;
      background-color: #fff;
      border-radius: 50%;
    }
    span {
      font-size: 20px;
      padding-left: 20px;
    }
  }
}
.el-aside {
  background-color: #313743;
}
.el-main {
  background-color: #e9edf1;
}
.el-container {
  height: 100%;
}
.el-menu {
  width: 100%;
}
.collapse {
  text-align: center;
  color: #909399;
  letter-spacing: 0.1em;
  padding: 2px ;
  cursor: pointer;
  &:hover {
    background-color: #272c36;
  }
}

</style>
