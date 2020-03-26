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
            src="https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3743111107,1940472030&fm=111&gp=0.jpg"
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
<br><br>
    <div class="info-body" style="margin-top:40px">
      <el-tabs tab-position="left" @tab-click="handleClick">
        <el-tab-pane label="我的科目">
          <div v-for="item in courseList" :key="item.id" style="text-align:center">
            <span>{{item.name}}</span>
            <el-divider></el-divider>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的提问">
          
        </el-tab-pane>
        <el-tab-pane label="我的回答">我的回答</el-tab-pane>
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
      courseList: []
    };
  },
  computed: {},
  methods: {
    initUserInfo() {
      this.$baseAxios
        .get(this.$baseUrl + "/teacher/userInfo/" + this.$store.state.account)
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
    initCourseList() {
      this.$baseAxios
        .get(this.$baseUrl + "/teacher/teaCourse/" + this.$store.state.account)
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
    // 导航点击事件
    handleClick(tab, event) {
      console.log(tab.index);
    }
  }
};
</script>

