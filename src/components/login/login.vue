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
          v-model="user.userpassworld"
          class="login-passworld"
        ></el-input>
      </el-form-item>
      <el-button type="primary" round class="login-button">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "",
        userpassworld: "",
      },
    };
  },
};
</script>

<style>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
}
.box-login {
  width: 400px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
}
.login-button{
  width: 100%;
  margin: 10px 0;
}
</style>