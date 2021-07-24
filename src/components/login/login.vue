<template>
  <div class="login">
    <el-form
      label-position="top"
      label-width="80px"
      :model="user"
      class="box-login"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="user.username" class="login-name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="user.userpassword"
          class="login-passworld"
          show-password
        ></el-input>
      </el-form-item>
      <el-button
        @click.prevent="LoginReq()"
        type="primary"
        round
        class="login-button"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "",
        userpassword: "",
      },
    };
  },
  methods: {
    LoginReq() {
      this.$axios
        .post("/showStu", { param: this.user })
        .then((resp) => {
          const {
            data,code,msg
          } = resp.data
          if (code === 1) {
            //ui组件提示
            this.$message.success(msg)
            this.$router.push({name:'home'})
          }else{
            this.$message.warning(msg)
          }
          console.log(resp);
          console.log(data,code,msg);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.login {
  height: 100%;
  /* 弹性布局 */
  display: flex;
  /* 浏览器对角线居中 */
  justify-content: center;
  /* 垂直居中 */
  align-items: center;
  background-color: #354762;
}
.box-login {
  width: 400px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
}
.login-button {
  width: 100%;
  margin: 10px 0;
}
</style>