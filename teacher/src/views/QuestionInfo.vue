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
    <div
      style="margin-bottom:20px"
      v-for="item in answerList"
      :key="item.id"
      @click="handleOpenReword(item.id,item.account)"
    >
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
    <!-- 设置奖励 -->
    <el-dialog title="设置奖励" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-select v-model="rewordParam.rewordId" placeholder="请选择">
        <el-option v-for="item in rewordList" :key="item.id" :label="item.detail" :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetReword()">确 定</el-button>
      </span>
    </el-dialog>
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
      isHandleAnswer: false,
      rewordParam: {
        teaAccount: this.$store.state.account,
        stuAccount: "",
        answerId: "",
        rewordId: ""
      },
      rewordList: [],
      dialogVisible: false
    };
  },
  created() {
    this.question = this.$route.params.question;
    console.log(this.question);
    this.initAnswer();
    this.initRewordList();
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
    // 获得奖励列表
    initRewordList() {
      let courseId = this.question.courseId;
      this.$baseAxios
        .get(this.$baseUrl + "/teacher/reword/course/" + courseId)
        .then(res => {
          if (res.data.code == 100) {
            this.rewordList = res.data.extend.rewordList;
          }
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

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
          console.log(res);

          if (res.data.code == 100) {
            this.answerList = res.data.extend.answerVOList;
            // 是否可以采纳或者删除该问题的回答
            this.initHandleAnswer();
            this.answerList.forEach((element, index) => {
              if (element.star == "1") {
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
          this.$message({
            showClose: true,
            message: "采纳成功",
            type: "success",
            duration: 1000
          });
          this.initAnswer();
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
    },

    handleOpenReword(answerId, stuAccount) {
      this.dialogVisible = true;
      this.rewordParam.answerId = answerId;
      this.rewordParam.stuAccount = stuAccount;
    },
    handleSetReword() {
      if (this.rewordParam.rewordId == "") {
        this.$message({
          type: "error",
          message: "请选择奖励！",
          duration: 2000,
          showClose: true
        });
        return;
      } else {
        this.$baseAxios
          .put(this.$baseUrl + "/teacher/stuReword", this.rewordParam)
          .then(res => {
            if (res.data.code == 100) {
              this.$message({
                type: "success",
                message: "设置奖励成功",
                duration: 2000,
                showClose: true
              });
            } else {
              this.$message({
                type: "error",
                message: "设置奖励失败",
                duration: 2000,
                showClose: true
              });
            }
            this.dialogVisible =false;
            console.log(res);
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  }
};
</script>

