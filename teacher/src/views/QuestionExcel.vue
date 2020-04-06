<template>
  <div>
    <div>
      <el-switch
        v-model="isHaveAnswer"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="changeHaveAnswer()"
      ></el-switch>
      <span>是否有答案</span>
      <el-switch
        v-model="isHaveOver"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="changeHaveOver()"
      ></el-switch>
      <span>是否有采纳</span>
      <el-input style="width:500px;margin-left:30px" v-model="input" placeholder="请输入内容"></el-input>
      <el-button style="margin-left:30px" type="primary" @click="handleSearch()">查询</el-button>
      <el-button type="primary" @click="handleOutExcel()">导出</el-button>
      <el-divider></el-divider>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" >
      <span>导出Excel</span>
      <span slot="footer" class="dialog-footer">
        <a  :download="file" :href="url">点我下载......</a>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-tabs tab-position="left" @tab-click="handleClick">
      <el-tab-pane v-for="item1 in courseList" :key="item1.id" :label="item1.name">
        <el-card v-for="item in questionList" :key="item.id" shadow="hover" class="question-item">
          <div style="width:100%;height:100%">
            <p class="question-head">{{item.title}}</p>
            <el-row style="color:#a3b7d3;font-size:12px">
              <el-col :span="3">
                <p>{{item.userName}}</p>
              </el-col>
              <el-col :span="5">
                <p>{{item.courseName}}</p>
              </el-col>
              <el-col :span="3" :offset="5">
                <p>{{item.upTime | formatTimer}}</p>
              </el-col>
              <el-col :span="3">
                <p>回答数：{{item.star}}</p>
              </el-col>
              <el-col :span="5">
                <p
                  :class="[item.status =='2'?'accept-ok':'accept']"
                >{{item.status =='2'?"已有最佳答案":"待解决"}}</p>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
.question-item {
  margin-bottom: 10px;
}
</style>

<script>
export default {
  name: "QuestionExcel",
  data() {
    return {
      courseList: [],
      questionList: [],
      pagination: {
        total: 1,
        currentPage: 1,
        pageSize: 1
      },
      isHaveAnswer: false,
      isHaveOver: false,
      input: "",
      courseId: "",
      dialogVisible: false,
      file:'',
      url:''
    };
  },
  created() {
    this.getCourseList();
  },

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
    // 得到授课列表
    getCourseList() {
      this.$baseAxios
        .get(this.$baseUrl + "/teacher/teaCourse/" + this.$store.state.account)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            this.courseList = res.data.extend.courseList;
            this.courseId = this.courseList[0].id;
            this.input = this.courseList[0].name;
            this.toPage(this.courseId);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 导航点击事件
    handleClick(tab, event) {
      console.log(tab.index);
      this.courseId = this.courseList[tab.index].id;
      this.toPage(this.courseId);
    },
    // 获取当前页
    handelCurrentChange(event) {
      console.log(event);
      this.toPage(this.courseId, event);
    },
    toPage(courseId) {
      this.loading = true;
      let questionUri = "";
      if (this.isHaveOver == true) {
        questionUri = "/questionList/keyword/star";
      }
      if (this.isHaveOver == false) {
        if (this.isHaveAnswer == false) {
          questionUri = "/questionList/keyword/no";
        } else {
          questionUri = "/questionList/keyword/answer";
        }
      }
      this.$baseAxios
        .get(
          this.$baseUrl +
            "/teacher" +
            questionUri +
            "/" +
            courseId +
            "/" +
            this.input
        )
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            this.questionList = res.data.extend.questionList;
          } else {
            this.$message({
              showClose: true,
              message: "请检查网络情况",
              type: "warning",
              duration: 1000
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    changeHaveAnswer() {
      if (this.isHaveAnswer) {
        console.log("有答案");
        this.toPage(this.courseId);
      } else {
        this.isHaveOver == false;
        this.toPage(this.courseId);
        console.log("没有答案");
      }
    },
    changeHaveOver() {
      if (this.isHaveOver) {
        this.isHaveAnswer == true;
        this.toPage(this.courseId);
        console.log("有答案");
        console.log("有采纳");
      } else {
        console.log("没有采纳");
        this.toPage(this.courseId);
      }
    },
    handleSearch() {
      toPage(this.courseId);
    },
    handleOutExcel() {
      let courseId = this.courseId;
      let questionUri = "";
      if (this.isHaveOver == true) {
        questionUri = "/questionList/excel/keyword/star";
      }
      if (this.isHaveOver == false) {
        if (this.isHaveAnswer == false) {
          questionUri = "/questionList/excel/keyword/no";
        } else {
          questionUri = "/questionList/excel/keyword/answer";
        }
      }
      this.$baseAxios
        .get(
          this.$baseUrl +
            "/teacher" +
            questionUri +
            "/" +
            courseId +
            "/" +
            this.input
        )
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            this.url = "http://localhost:8080/" + res.data.extend.fileName;
            this.file = "问题.xlsx";
            this.dialogVisible = false;
            URL = encodeURI(this.url);
            window.open(URL);
          } else {
            this.$message({
              showClose: true,
              message: "请检查网络情况",
              type: "warning",
              duration: 1000
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    downFile(content, filename) {
      // 创建隐藏的可下载链接
      var eleLink = document.createElement("a");
      eleLink.download = filename;
      eleLink.style.display = "none";
      // 字符内容转变成blob地址
      var blob = new Blob([content]);
      eleLink.href = URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    }
  }
};
</script>

