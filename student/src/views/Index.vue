<template>
  <div id="app" style="overflow-x:hidden;min-height:1000px">
    <el-container style="min-height:900px; border: 1px solid #eee">
      <el-header style="text-align: right; font-size: 12px ;height:40px">
        <span>欢迎你：{{this.$store.state.name}}</span>
        <span>&nbsp;|&nbsp;</span>
        <span @click="logout()" class="logout">退出</span>
      </el-header>
      <el-row :gutter="20" style="margin-top:40px;margin-bottom:40px">
        <el-col :span="6" :offset="8">
          <el-select
            style="width:100%;"
            v-model="value"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-button type="success" @click="getStudentByKey()">搜索问题</el-button>
          <el-button type="primary" @click="toCreateProblem()">发布问题</el-button>
          <el-button type="primary" @click="toProblemExcel()">问题导出</el-button>
        </el-col>
      </el-row>

      <el-header style="text-align: right; font-size: 12px ;height:40px;">
        <el-row :gutter="20" style="background-color:#409eff;width:100%">
          <el-col :span="2" :offset="5" class="col-link">
            <el-button class="btn-link" type="text" @click="toAllQuestion()">首页</el-button>
          </el-col>
          <el-col :span="2" class="col-link">
            <el-button class="btn-link" type="text" @click="toQuestionSort()">问题分类</el-button>
          </el-col>
          <el-col :span="2" class="col-link">
            <el-button class="btn-link" type="text" @click="toReword()">查看奖励</el-button>
          </el-col>
          <el-col :span="2" :offset="4" class="col-link">
            <el-button class="btn-link" type="text" @click="toGetUserInfo()">个人中心</el-button>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <el-row :gutter="20" style="width:100%">
          <el-col :span="14" :offset="5">
            <router-view></router-view>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      defaultActiveIndex: "/",
      loading: false,
      value: "",
      options: ""
    };
  },
  created() {},
  filters: {
    formatTimer: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m;
    }
  },
  methods: {
    toCreateProblem() {
      this.$router.push({ path: "/NewProblem" });
    },
    toGetUserInfo() {
      this.$router.push({ path: "/UserInfo" });
    },
    toQuestionSort() {
      this.$router.push({ path: "/QuestionSort" });
    },
    toAllQuestion() {
      this.$router.push({ path: "/AllQuestion" });
    },
    toQuestionMannager() {
      this.$router.push({ path: "/QuestionMannager" });
    },
    toProblemExcel() {
      this.$router.push({ path: "/QuestionExcel" });
    },
    toReword() {
      this.$router.push({ path: "/Reword" });
    },
    // 模糊查询
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          console.log("search");
          this.loading = false;
          this.$baseAxios
            .get(this.$baseUrl + "/student/questionList/keyword/" + query)
            .then(res => {
              let questionList = res.data.extend.questionList;
              console.log(questionList);

              let options = [];

              questionList.forEach(element => {
                let item = {
                  name: "",
                  id: ""
                };
                item.name =
                  element.title +
                  " - " +
                  element.userName +
                  " - " +
                  element.courseName +
                  " - " +
                  this.$options.filters["formatTimer"](element.upTime);
                item.id = element.id;
                options.push(item);
              });
              console.log(options);

              this.options = options;
            })
            .catch(err => {
              console.error(err);
            });
        }, 1000);
      } else {
        this.options = [];
      }
    },
    // 精确查询
    getStudentByKey() {
      if (this.value == "") {
        this.$message({
          showClose: true,
          message: "查询内容不能为空",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$baseAxios
        .get(this.$baseUrl + "/student/question/" + this.value)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            let item = res.data.extend.question;
            this.$router.push({
              name: "QuestionInfo",
              params: { question: item }
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    logout() {
      this.$store.commit("setToken", "");
      this.$baseAxios.defaults.headers.common["Authorization"] = "Bearer ";
      this.$router.push({ path: "/Login" });
    }
  }
};
</script>

<style>
.el-header {
  background-color: #fafafa;
  color: #333;
  line-height: 40px;
}
.btn-link {
  color: #ffffff !important;
  width: 100%;
}
.col-link {
  text-align: center;
}
.col-link:hover {
  background-color: #3283bb !important;
  cursor: pointer;
}
.logout:hover {
  cursor: pointer;
}
#app::-webkit-scrollbar {
  display: none;
}
</style>