<template>
  <div>
    <div style="margin-bottom:20px">
      <!-- 问题题目 -->
      <el-card>
        <div>
          <h4>{{question.title}}</h4>
        </div>
        <!-- 问题详情 -->
        <div v-html="question.detail"></div>
        <!-- 发布者信息 -->
        <div>
          <el-row
            style="font-size:14px;line-height:20px;height:20px;color:#a3acc3;margin-top:40px;margin-bottom:10px"
          >
            <el-col :span="1">
              <el-avatar :size="20" :src="circleUrl"></el-avatar>
            </el-col>
            <el-col :span="6">
              <p>发布者：{{question.userName}}</p>
            </el-col>
            <el-col :span="6">
              <p>科目：{{question.courseName}}</p>
            </el-col>
            <el-col :span="11">
              <p>发布时间：{{question.upTime | formatTimer}}</p>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <!-- 我来回答 -->
    <div style="margin-bottom:20px">
      <el-card>
        <div style="text-align:right">
          <el-button @click="answerFlag = !answerFlag">{{answerFlag?'收起回答↑':'我来回答↓'}}</el-button>
        </div>
        <div v-show="answerFlag">
          <rich-text-editor :text="detail" @editorChange="editorChange"></rich-text-editor>
          <div style="text-align:right">
            <el-button type="primary" @click="handleAnswerQuestion()">发布答案</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 问题回答 -->
    <h5>最新回答：</h5>
    <div style="margin-bottom:20px" v-for="item in answerList" :key="item.id">
      <!-- 回答者信息 -->
      <el-card shadow="hover" class="question-item">
        <div>
          <el-row style="font-size:14px;line-height:20px;height:20px;max-height:20px">
            <el-col :span="1">
              <el-avatar :size="20" :src="circleUrl"></el-avatar>
            </el-col>
            <el-col :span="4">
              <p style="margin-bottom:0px">{{item.username}}</p>
            </el-col>
            <el-col :span="4" :offset="15">
              <p style="margin-bottom:0px">{{item.star == 1 ?'该答案已被采纳！':''}}</p>
            </el-col>
          </el-row>
          <p class="answer-time">{{item.upTime | formatTimer}} 回答</p>
        </div>
        <div v-html="item.detail"></div>
        <div style="text-align:right" v-if="isHandleAnswer">
          <el-button type="danger" @click="handleDeleteAnswer(item.id)">删除</el-button>
          <el-button type="success" @click="handleUpAnswer(item.id)">采纳</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style>
.center {
  text-align: center;
}
.answer-time {
  color: #a3acc3;
  margin: 0px !important;
}
</style>

<script>
import richTextEditor from "../components/richTextEditor";
export default {
  name: "QuestionInfo",
  components: {
    richTextEditor
  },

  data() {
    return {
      content: `<p>问题详情</p>`,
      editorOption: {},
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      answerFlag: false,
      question: {},
      detail: `<p>问题详情</p>`,
      answerParam: {
        account: "",
        detail: "",
        questionId: ""
      },
      answerList: [],
      isHandleAnswer: false
    };
  },
  created() {
    this.question = this.$route.params.question;

    this.initAnswer();
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
    // 富文本改变事件
    editorChange(html) {
      this.detail = html;
    },
    // 回答信息方法
    handleAnswerQuestion() {
      this.answerParam.account = this.$store.state.account;
      this.answerParam.detail = this.detail;
      this.answerParam.questionId = this.question.id;
      this.$baseAxios
        .post(this.$baseUrl + "/teacher/answer", this.answerParam)
        .then(res => {
          if (res.data.code == 100) {
            this.$message({
              showClose: true,
              message: "回答问题成功",
              type: "success",
              duration: 1000
            });
            this.detail = "";
            this.initAnswer();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 得到所有回答方法
    initAnswer() {
      this.$baseAxios
        .get(this.$baseUrl + "/teacher/question/answer/" + this.question.id)
        .then(res => {
          if (res.data.code == 100) {
            this.answerList = res.data.extend.answerVOList;
            // 是否可以采纳或者删除该问题的回答
            this.initHandleAnswer();
            this.answerList.forEach((element,index) => {
              if (element.star == '1') {
                let temp = this.answerList[0];
                this.answerList[0] = element;
                this.answerList[index] = temp;
                this.isHandleAnswer = false;
              }
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    initHandleAnswer() {
      let flag = this.question.account == this.$store.state.account;
      this.isHandleAnswer = flag;
    },
    handleDeleteAnswer() {},
    handleUpAnswer(answerId) {
      this.$baseAxios
        .get(this.$baseUrl + "/teacher/answerUp/" + answerId)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

