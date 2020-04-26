<template>
  <div>
    home
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    loginOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style language="less" scoped>

</style>
