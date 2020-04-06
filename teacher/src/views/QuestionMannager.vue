<template>
  <div>
    <div style="text-align:center">
      <el-switch
        v-model="switchValue"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="changeSwitch()"
      ></el-switch>
      <span>查看已发布的问题</span>
      <el-divider></el-divider>
    </div>
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
              <el-col :span="5" :offset="3">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDeleteQuestion(item)"
                  circle
                ></el-button>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="handleEditQuestion(item)"
                ></el-button>
                <el-button v-if="!switchValue"
                  type="success"
                  icon="el-icon-check"
                  circle
                  @click="handleUpQuestion(item)"
                ></el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <div style="text-align:center">
      <el-pagination
        class="item-center"
        background
        layout="prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :current-page="pagination.currentPage"
        @current-change="handelCurrentChange($event)"
      ></el-pagination>
      <el-dialog title="修改问题信息" :visible.sync="dialogVisible" width="30%">
        <h5 style="text-align:left">问题标题：</h5>
        <el-input v-model="dialogTitle" placeholder="请输入内容"></el-input>
        <el-divider></el-divider>
        <h5 style="text-align:left">问题内容：</h5>
        <div>
          <rich-text-editor :text="detail" @editorChange="editorChange"></rich-text-editor>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUpdateQuestion()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<style>
.question-item {
  margin-bottom: 10px;
}
</style>

<script>
import richTextEditor from "../components/richTextEditor";
export default {
  name: "QuestionSort",
  components: {
    richTextEditor
  },
  data() {
    return {
      courseList: [],
      questionList: [],
      pagination: {
        total: 1,
        currentPage: 1,
        pageSize: 1
      },
      courseId: "",
      dialogVisible: false,
      dialogTitle: "",
      detail: `<p>问题详情</p>`,
      question: {},
      switchValue: false,

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
    // 富文本改变事件
    editorChange(html) {
      this.detail = html;
    },
    // 得到授课列表
    getCourseList() {
      this.$baseAxios
        .get(this.$baseUrl + "/teacher/teaCourse/"+this.$store.state.account)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            this.courseList = res.data.extend.courseList;
            this.courseId = this.courseList[0].id;
            this.toPage(this.courseId, 1);
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
      this.toPage(this.courseId, 1);
    },
    // 获取当前页
    handelCurrentChange(event) {
      console.log(event);
      this.toPage(this.courseId, event);
    },
    // 分页事件
    toPage(courseId, pn) {
      this.loading = true;
      let switchValue = this.switchValue;
      let questionUri = "questionDown";
      if (switchValue) {
        questionUri = "question";
      }
      this.$baseAxios
        .get(
          this.$baseUrl +
            "/teacher/" +
            questionUri +
            "/course/" +
            courseId +
            "/" +
            pn
        )
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            let pageInfo = res.data.extend.pageInfo;
            this.pagination.total = pageInfo.total;
            this.pagination.currentPage = pageInfo.current;
            this.pagination.pageSize = pageInfo.size;
            this.questionList = pageInfo.records;
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
    // 更新打开模态框
    handleEditQuestion(item) {
      // 打开模态框
      this.dialogVisible = true;
      this.detail = item.detail;
      this.dialogTitle = item.title;
      this.question = item;
    },
    // 更新问题事件
    handleUpdateQuestion() {
      let question = this.question;
      question.detail = this.detail;
      question.title = this.dialogTitle;
      this.$baseAxios
        .put(this.$baseUrl + "/teacher/question", question)
        .then(res => {
          if (res.data.code == 100) {
            this.$message({
              showClose: true,
              message: "问题修改成功",
              type: "success",
              duration: 1000
            });
            this.dialogVisible = false;
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
    // 删除问题事件
    handleDeleteQuestion(item) {
      this.$confirm("此操作将删除该题目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
            this.$baseAxios
            .delete(this.$baseUrl + "/teacher/question/" + item.id)
            .then(res => {
              console.log(res);
              if (res.data.code == 100) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.refresh();
              } else {
                this.$message({
                  type: "warning",
                  message: "请检查网络情况!"
                });
              }
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 发布问题事件
    handleUpQuestion(item) {
        this.$baseAxios
        .put(this.$baseUrl + "/teacher/questionUp/" + item.id)
        .then(res => {
          if (res.data.code == 100) {
            this.$message({
              type: "success",
              message: "审核成功!"
            });
            this.refresh();
          }
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 页面从后往前删时，调用的刷新方法
    refresh() {
      if (this.questionList.length == 1) {
        console.log("查询前一页");

        this.toPage(this.courseId, this.pagination.currentPage - 1);
      } else {
        this.toPage(this.courseId, this.pagination.currentPage);
      }
    },
    // 是否显示以前已经审核的问题
    changeSwitch() {
      if (this.switchValue) {
        this.toPage(this.courseId, 1);
      } else {
        this.toPage(this.courseId, 1);
      }
    }
  }
};
</script>

