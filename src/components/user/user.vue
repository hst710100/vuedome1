<template>
  <div class="index">
    <!-- 面包屑头部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 输入框搜索，添加 -->
    <el-row class="top">
      <!-- 当输入框清除的话自动触发clear事件 -->
      <el-input
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select"
        clearable
        @clear="searchUser()"
      >
        <el-button
          @click="searchUser()"
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>
      <el-button type="success" plain @click="dialogFormoff()"
        >添加用户</el-button
      >
    </el-row>
    <!-- 列表 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="#" width="80"> </el-table-column>
      <el-table-column prop="username" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="telephone" label="电话" width="180">
      </el-table-column>
      <el-table-column prop="registTime" label="创建日期" width="100">
      </el-table-column>
      <el-table-column label="用户状态" width="100">
        <!-- 在ui组件里要添加另一个组件需要模板template -->
        <!-- 通过slot-scope属性接收表格:data绑定的属性，在模板中进行相加{{scope.row}} -->
        <template slot-scope="scope">
          <!-- active打开值 inactive关闭值 -->
          <el-switch
            v-model="scope.row.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="userEdit(scope.row)"
          >
          </el-button>
          <!-- scope.row.username接收删除的关键字传参 -->
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="delUser(scope.row.username)"
          >
          </el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- ui框架对应值和方法 -->
    <!-- current-page当前页数 -->
    <!-- page-size每页显示条目个数， -->
    <!-- page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项， -->
    <!-- page-size手动操作，不能动态改变，后面自己看情况办 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[3, 6, 9]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 对话框，添加用户 -->
    <!-- dialogFormVisible为true弹出dialog -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <!-- form为绑定的数据信息 -->
      <el-form :model="form">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="form.userpassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="form.telephone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="userAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="用户信息编辑" :visible.sync="editFormVisible">
      <!-- form为绑定的数据信息 -->
      <el-form :model="editList">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="editList.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="editList.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px">
          <el-input v-model="editList.telephone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditFix()">确 定</el-button>
      </div>
    </el-dialog>
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
      pagesize: 3,
      list: [],
      total: 0,
      totalpage: 0,
      dialogFormVisible: false,
      editFormVisible: false,
      form: {
        username: "",
        userpassword: "",
        email: "",
        telephone: "",
      },
      editList: {
        username: "",
        email: "",
        telephone: "",
        id:'',
      },
    };
  },
  created() {
    this.userList();
  },
  methods: {
    //用户编辑
    userEdit(val) {
      //获取数据并赋值给editList里面的各项
      var { username, email, telephone,id } = val;
      this.editList.username = username;
      this.editList.email = email;
      this.editList.telephone = telephone;
      this.editList.id = id;
      this.editFormVisible = true;
      // console.log(username,email,telephone);
    },
    //编辑确认并更新视图
    async EditFix() {
      //添加无论成功与否关闭dialog
      this.editFormVisible = false;
      const rsp = await this.$axios.post("/editFix", this.editList);
      //请求成功
      if (rsp.data.code == 1) {
        this.$message.success(rsp.data.msg); //ui提示
        this.userList(); //更新视图
      } else {
        this.$message.warning(rsp.data.msg);
      }
    },
    //删除用户信息
    delUser(val) {
      this.$confirm("是否删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // console.log(val);
          const rs = await this.$axios.get("/deluser", {
            params: { username: val },
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.userList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //添加用户按钮开关
    dialogFormoff() {
      this.dialogFormVisible = true;
    },
    //用户添加
    async userAdd() {
      //添加无论成功与否关闭dialog
      this.dialogFormVisible = false;
      const res = await this.$axios.post("/usersadd", this.form);
      //请求成功
      if (res.data.code == 1) {
        this.$message.success(res.data.msg); //ui提示
        this.form = {}; //清空对象
        this.userList(); //更新视图
      } else {
        this.form = {}; //清空对象
        this.$message.warning(res.data.msg);
      }
      // console.log(res);
    },
    //搜索功能
    searchUser() {
      // console.log(this.input);
      this.userList();
    },
    //分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.userList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.userList();
      // console.log(`当前页: ${val}`);
    },
    //数据列表
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
          input: this.input,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          token: token,
        },
      });
      // console.log(resp);
      const { code, data, msg, num, total, totalpage } = resp.data;
      if (code == 1) {
        this.$message.success(msg); //ui提示
        this.list = data; //用户数据
        this.pagenum = num; //页码
        this.total = total; //总页码
        this.totalpage = totalpage; //能分几页
        console.log(resp.data);
      } else {
        this.$message.warning("token值无效,必须管理员权限");
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