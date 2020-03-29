<template>
  <div>
    <div style="text-align:center;">
      <el-button type="primary" @click="createReword()">发布奖励</el-button>
    </div>
    <div class="info-body" style="margin-top:40px">
      <el-tabs tab-position="left" @tab-click="handleClick">
        <el-tab-pane v-for="item1 in courseList" :key="item1.id" :label="item1.name">
          <el-card v-for="item in rewordList" :key="item.id" shadow="hover" class="question-item">
            <div style="width:100%;height:100%">
              <el-row style="font-size:14px">
                <el-col :span="15">
                  <p>{{item.detail}}</p>
                </el-col>
                <el-col :span="5" :offset="3">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDeleteReword(item.id)"
                    circle
                  ></el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog title="发布奖励" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="奖励内容" prop="detail" :label-width="formLabelWidth">
          <el-input v-model="form.detail" autocomplete="off" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="选课科目" prop="courseId" :label-width="formLabelWidth">
          <el-select v-model="form.courseId" placeholder="请选择科目">
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="text-align:center">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
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
      dialogFormVisible: false,
      form: {
        detail: "",
        courseId: "",
        account: this.$store.state.account
      },
      formLabelWidth: "120px",
      rules: {
        detail: [
          { required: true, message: "请输入奖励的详情", trigger: "blur" },
          {
            min: 3,
            max: 105,
            message: "长度在 3 到 200 个字符",
            trigger: "blur"
          }
        ],
        courseId: [{ required: true, message: "请选择科目", trigger: "change" }]
      },
      rewordList: [],
      index:0
    };
  },
  computed: {},
  methods: {
    // 初始化选课信息
    initCourseList() {
      this.$baseAxios
        .get(this.$baseUrl + "/teacher/teaCourse/" + this.$store.state.account)
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
    // 发布奖励
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$baseAxios
            .post(this.$baseUrl + "/teacher/reword", this.form)
            .then(res => {
              if (res.data.code == 100) {
                this.$message({
                  showClose: true,
                  message: "发布奖励成功",
                  type: "success",
                  duration: 1000
                });
                this.form.detail = "";
                this.dialogFormVisible = false;
              }
              console.log(res);
            })
            .catch(err => {
              console.error(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 查看奖励
    initRewordList(index) {
      let courseId = this.courseList[index].id;
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
    //删除奖励
    handleDeleteReword(id) {
      this.$baseAxios
        .delete(this.$baseUrl + "/teacher/reword/" + id)
        .then(res => {
          if (res.data.code == 100) {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.initRewordList(this.index);
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

