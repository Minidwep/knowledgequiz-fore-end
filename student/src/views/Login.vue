<template>
  <div>
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">欢迎登录</h3>
      <el-form-item label="账号" prop="username">
        <el-input type="text" placeholder="请输入账号" v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="onSubmit('loginForm')" :loading="loading">登录</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%">
      <span>请输入账号和密码</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      form: {
        username: "",
        password: ""
      },

      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        username: [
          { required: true, message: "账号不可为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不可为空", trigger: "blur" }]
      },

      // 对话框显示和隐藏
      dialogVisible: false
    };
  },
  methods: {
    onSubmit(formName) {
      this.loading = true;
      // 为表单绑定验证功能
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
          this.$baseAxios
            .post(this.$baseUrl + "/authenticate", this.form)
            .then(res => {
              console.log(res);
              setTimeout(() => {
                this.loading = false;
                this.loginSuccess(res);
              }, 1000);
            })
            .catch(err => {
              this.loading = false;
              this.loginError(err);
            });
        } else {
          this.dialogVisible = true;
          return false;
        }
      });
    },
    loginSuccess(response) {
      let token = response.data.extend.token.token;
      let name = response.data.extend.user.name;
      let account = response.data.extend.user.account;
      this.$store.commit("setToken", token);
      this.$store.commit("setName", name);
      this.$store.commit("setAccount", account);
      sessionStorage.setItem("token", token);
      let tokenInSession = sessionStorage.getItem("token");

      console.log(this.$store.state.token);
      this.$baseAxios.defaults.headers.common["Authorization"] =
        "Bearer " + tokenInSession;
      this.$router.push({ path: "/AllQuestion" });
    },
    loginError(error) {
      this.$message({
        type: "error",
        message: "用户名或密码错误",
        duration: 5000,
        showClose: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-box {
  border: 1px solid #dcdfe6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>