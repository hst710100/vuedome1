<template>
  <div class="index">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="top">
      <el-input
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" plain>添加用户</el-button>
    </el-row>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="#" width="80"> </el-table-column>
      <el-table-column prop="username" label="姓名" width="120"> </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="telephone" label="电话" width="180">
      </el-table-column>
      <el-table-column prop="registTime" label="创建日期" width="100">
      </el-table-column>
      <el-table-column prop="state" label="用户状态" width="100">
      </el-table-column>
      <el-table-column prop="date" label="操作"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /**
       * 参数情况
       * @param {*} input   查询参数 可以为null
       * @param {*} pagenum 当前页码
       * @param {*} pagesize 显示条数
       * @param {*} list 用户数据
       * @param {*} total 数据总数
       * @param {*} totalpage 能分几页
       */
      input: "",
      pagenum: 1,
      pagesize: 4,
      list: [],
      total:0,
      totalpage:0,
    };
  },
  created() {
    this.userList();
  },
  methods: {
    async userList() {
      //获取管理员token值
      const token = localStorage.getItem("token");
      // console.log(token);
      //get参数path：访问后台数据的路由，第二个参数为上传的值格式也要对
      const resp = await this.$axios.get("/userList", {
        params: {
          //input   查询参数 可以为null
          //pagenum 当前页码
          //pagesize 显示条数
          input: "",
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          token: token,
        },
      });
      // console.log(resp);
      const { code, data, msg, num, total, totalpage } = resp.data;
      if (code == 1) {
        this.$message.success(msg);//ui提示
        this.list=data //用户数据
        this.pagenum = num  //页码
        this.total=total    //总页码
        this.totalpage=totalpage  //能分几页
        // console.log(code,data,msg,num,total,totalpage);
      }
    },
  },
};
</script>

<style>
.index {
  background-color: #fff;
  padding: 20px;
  height: 100%;
}
.input-with-select {
  width: 350px;
}
.top {
  margin: 10px 0;
}
</style>