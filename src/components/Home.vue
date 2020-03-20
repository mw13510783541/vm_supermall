<template>
  <div class="home">
    <el-button type="info" @click="quitLogin">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {}
  },
  created() {},
  methods: {
    quitLogin() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="" scoped>
</style>
