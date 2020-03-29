<template>
  <div>
    <div class="info-up">
      <el-row :gutter="20">
        <el-col :span="4">
          <img
            style="border-radius:500px;
            width: 100%;
            height: width;
            object-fit: cover;"
            src="../assets/xuesheng.png"
            alt="头像"
          />
        </el-col>
        <el-col :span="8" :offset="2" align="left">
          <p>
            提问数：
            <span>{{userInfo.questionNum}}</span>
          </p>
          <p>
            回答数：
            <span>{{userInfo.answerNum}}</span>
          </p>
          <p>
            采纳数：
            <span>{{userInfo.answerStarNum}}</span>
          </p>
        </el-col>
        <el-col :span="6">
          <p></p>
        </el-col>
      </el-row>
    </div>
    <br />
    <br />
    <div class="info-body" style="margin-top:40px">
      <el-tabs tab-position="left" @tab-click="handleClick">
        <el-tab-pane label="我的科目">
          <div v-for="item in courseList" :key="item.id" style="text-align:center">
            <span>{{item.name}}</span>
            <el-divider></el-divider>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的提问">
          <el-card v-for="item in questionList" :key="item.id" shadow="hover" class="question-item">
            <div style="width:100%;height:100%" @click="handleAnswerQuestion(item)">
              <el-row style="color:#a3b7d3;font-size:12px">
                <el-col :span="8">
                  <p>{{item.title}}</p>
                </el-col>
                <el-col :span="5">
                  <p>{{item.courseName}}</p>
                </el-col>
                <el-col :span="3">
                  <p>{{item.upTime | formatTimer}}</p>
                </el-col>
                <el-col :span="5" :offset="3">
                  <p
                    :class="[item.status =='2'?'accept-ok':'accept']"
                  >{{item.status =='2'?"已有最佳答案":"待解决"}}</p>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <div style="text-align:center">
            <el-pagination
              class="item-center"
              background
              layout="prev, pager, next"
              :total="questionPagination.total"
              :page-size="questionPagination.pageSize"
              :current-page="questionPagination.currentPage"
              @current-change="handelQuestionChange($event)"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的回答">
          <el-card v-for="item in answerList" :key="item.id" shadow="hover" class="question-item">
            <div style="width:100%;height:100%" @click="handleQuestionAnswer(item.questionId)">
              <el-row style="color:#a3b7d3;font-size:12px">
                <el-col :span="8">
                  <p>{{item.title}}</p>
                </el-col>

                <el-col :span="3" :offset="2">
                  <p>{{item.upTime | formatTimer}}</p>
                </el-col>
                <el-col :span="5" :offset="3">
                  <p
                    :class="[item.star =='1'?'accept-ok':'accept']"
                  >{{item.star =='1'?"已被采纳":"待采纳"}}</p>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <div style="text-align:center">
            <el-pagination
              class="item-center"
              background
              layout="prev, pager, next"
              :total="answerPagination.total"
              :page-size="answerPagination.pageSize"
              :current-page="answerPagination.currentPage"
              @current-change="handelAnswerChange($event)"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style>
.center {
  text-align: center;
}
</style>

<script>
export default {
  name: "UserInfo",
  created() {
    this.initUserInfo();
    this.initCourseList();
  },
  data() {
    return {
      userInfo: {
        answerNum: "",
        answerStarNum: "",
        questionNum: ""
      },
      courseList: [],
      questionList: [],
      answerList: [],
      // 我的问题分页信息
      questionPagination: {
        total: 1,
        currentPage: 1,
        pageSize: 1
      },
      // 我的回答分页信息
      answerPagination: {
        total: 1,
        currentPage: 1,
        pageSize: 1
      }
    };
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
  computed: {},
  methods: {
    initUserInfo() {
      this.$baseAxios
        .get(this.$baseUrl + "/student/userInfo/" + this.$store.state.account)
        .then(res => {
          console.log(res);

          let userInfo = res.data.extend;
          this.userInfo.answerNum = userInfo.answerNum;
          this.userInfo.answerStarNum = userInfo.answerStarNum;
          this.userInfo.questionNum = userInfo.questionNum;
          console.log(this.userInfo);
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 初始化选课信息
    initCourseList() {
      this.$baseAxios
        .get(this.$baseUrl + "/student/stuCourse/" + this.$store.state.account)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            this.courseList = res.data.extend.courseList;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 初始化我的提问信息
    initQuestionList(pn) {
      this.$baseAxios
        .get(
          this.$baseUrl +
            "/student/questionList/One/" +
            this.$store.state.account +
            "/" +
            pn
        )
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            let pageInfo = res.data.extend.pageInfo;
            this.questionPagination.total = pageInfo.total;
            this.questionPagination.currentPage = pageInfo.current;
            this.questionPagination.pageSize = pageInfo.size;
            this.questionList = pageInfo.records;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 初始化我的回答信息
    initAnswerList(pn) {
      this.$baseAxios
        .get(
          this.$baseUrl +
            "/student/answerList/One/" +
            this.$store.state.account +
            "/" +
            pn
        )
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            let pageInfo = res.data.extend.pageInfo;
            this.answerPagination.total = pageInfo.total;
            this.answerPagination.currentPage = pageInfo.current;
            this.answerPagination.pageSize = pageInfo.size;
            this.answerList = pageInfo.records;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 导航点击事件
    handleClick(tab, event) {
      console.log(tab.index);
      if (tab.index == 1) {
        this.initQuestionList(1);
      }
      if (tab.index == 2) {
        this.initAnswerList(1);
      }
    },
    handleAnswerQuestion(item) {
      // this.$router.push( {path:'/QuestionInfo',query:{qid:qid}});
      if(item.status >0){
        this.$router.push({ name: "QuestionInfo", params: { question: item } });
      }else{
         this.$message({
          showClose: true,
          message: "您的问题还未被审核！",
          type: "error",
          duration: 1000
        });
      }
      
    },
    handleQuestionAnswer(qid) {
      // this.$router.push( {path:'/QuestionInfo',query:{qid:qid}});
      this.$baseAxios
        .get(this.$baseUrl + "/student/question/" + qid)
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
    // 获取当前页
    handelQuestionChange(event) {
      console.log(event);
      this.initQuestionList(event);
    },
    handelAnswerChange(event) {
      console.log(event);
      this.initAnswerList(event);
    }
  }
};
</script>

