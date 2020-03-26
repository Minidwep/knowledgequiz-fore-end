<template>
  <div>
    <el-tabs tab-position="left" @tab-click="handleClick">
      <el-tab-pane v-for="item1 in courseList" :key="item1.id" :label="item1.name">
        <el-card v-for="item in questionList" :key="item.id" shadow="hover" class="question-item">
          <div style="width:100%;height:100%" @click="handleAnswerQuestion(item)">
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
                <p>回答数：7</p>
              </el-col>
              <el-col :span="5">
                 <p :class="[item.status =='2'?'accept-ok':'accept']">{{item.status =='2'?"已有最佳答案":"待解决"}}</p>
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
    </div>
  </div>
</template>

<style>
.question-item {
  margin-bottom: 10px;
}
.accept-ok {
  color: #67c23a;
}
.accept {
  color: #d18c4c;
}
</style>

<script>
export default {
  name: "QuestionSort",
  data() {
    return {
      courseList: [],
      questionList: [],
      pagination: {
        total: 1,
        currentPage: 1,
        pageSize: 1
      },
      courseId: ""
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

    toPage(courseId, pn) {
      this.loading = true;
      this.$baseAxios
        .get(this.$baseUrl + "/teacher/question/course/" + courseId + "/" + pn)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            let pageInfo = res.data.extend.pageInfo;
            this.pagination.total = pageInfo.total;
            this.pagination.currentPage = pageInfo.current;
            this.pagination.pageSize = pageInfo.size;
            this.questionList = pageInfo.records;

            this.$message({
              showClose: true,
              message: "数据加载成功",
              type: "success",
              duration: 1000
            });
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
    // 跳转到问题详情
    handleAnswerQuestion(item) {
      // this.$router.push( {path:'/QuestionInfo',query:{qid:qid}});
      this.$router.push({ name: "QuestionInfo", params: { question: item } });
    }
  }
};
</script>

