<template>
  <div>
    <div class="info-body" style="margin-top:40px">
      <el-tabs tab-position="left" @tab-click="handleClick">
        <el-tab-pane v-for="item1 in courseList" :key="item1.id" :label="item1.name">
          <el-card v-for="item in rewordList" :key="item.id" shadow="hover" class="question-item">
            <div style="width:100%;height:100%">
              <el-row style="font-size:14px">
                <el-col :span="24">
                  <p>{{item.detail}}</p>
                </el-col>
    
              </el-row>
            </div>
          </el-card>
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
  name: "Reword",
  created() {
    this.initCourseList();
  },
  data() {
    return {
      courseList: "",

      rewordList: [],
      index:0
    };
  },
  computed: {},
  methods: {
    // 初始化选课信息
    initCourseList() {
      this.$baseAxios
        .get(this.$baseUrl + "/student/stuCourse/" + this.$store.state.account)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            this.courseList = res.data.extend.courseList;
            this.initRewordList(0);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 导航点击事件
    handleClick(tab, event) {
      console.log(tab.index);
      this.index = tab.index;
      this.initRewordList(tab.index);
    },
    // 模态框
    createReword() {
      this.dialogFormVisible = true;
    },

    // 查看奖励
    initRewordList(index) {
      let courseId = this.courseList[index].id;
      this.$baseAxios
        .get(this.$baseUrl + "/student/reword/course/" + courseId)
        .then(res => {
          if (res.data.code == 100) {
            this.rewordList = res.data.extend.rewordList;
          }
          console.log(res);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

