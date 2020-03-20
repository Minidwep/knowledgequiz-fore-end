<template>
  <div>
    <el-select
      v-model="value"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.name"></el-option>
    </el-select>
    <el-button @click="getStudentByKey" type="primary" style="margin-left: 16px;">查询</el-button>
    
    <!-- 表格信息 -->
    <el-table
      v-loading="loading"
      :data="studentData"
      border
      style="width: 100%"
      @row-dblclick="getCourse"
    >
      <el-table-column prop="account" label="学号" min-width="!9%" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" min-width="!9%" align="center"></el-table-column>
      <el-table-column prop="college" label="专业" min-width="!9%" align="center"></el-table-column>
      <el-table-column prop="pwd" label="密码" min-width="!9%" align="center"></el-table-column>
      <el-table-column label="操作" min-width="!9%">
        <template slot-scope="scope">
          <el-button
            @click="handleUpdateStudent(scope.row)"
            icon="el-icon-edit"
            type="primary"
            size="small"
          >编辑</el-button>
          <el-button
            @click="handleDeleteStudent(scope.$index,scope.row)"
            icon="el-icon-delete"
            type="danger"
            size="small"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 学生任课信息 -->
    <el-dialog title="授课信息" :visible.sync="dialogStudentVisible">
      <el-table :data="gridData">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="name" label="课程名" width="150"></el-table-column>
        <el-table-column property="detail" label="详情"></el-table-column>
        <el-table-column label="操作" min-width="!4%">
          <template slot-scope="scope">
            <el-button
              class="item-center"
              icon="el-icon-delete"
              @click="handleDeleteStudentCourse(scope.$index,scope.row)"
              type="danger"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="innerVisible = true">添加</el-button>

      <el-dialog width="30%" title="内层 Dialog" :visible.sync="innerVisible" append-to-body></el-dialog>
    </el-dialog>
    <br />
    <el-pagination
      class="item-center"
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page="pagination.currentPage"
      @current-change="handelCurrentChange($event)"
    ></el-pagination>

    <!-- 分页信息 -->

    <el-button @click="dialog = true" type="primary" style="margin-left: 16px;">点我打开</el-button>

    <!-- 抽屉信息 -->
    <el-drawer
      title="更新学生信息"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" :rules="rules">
          <el-form-item label="学号" :label-width="formLabelWidth">
            <el-input disabled v-model="form.account" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="专业" :label-width="formLabelWidth">
            <el-input v-model="form.college" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.pwd" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="drawer_footer">
          <el-button class="drawer_footer_item" @click="cancelForm">关闭</el-button>
          <el-button
            class="drawer_footer_item"
            type="primary"
            @click="$refs.drawer.closeDrawer('ruleForm')"
            :loading="loading"
          >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style>
.item-center {
  text-align: center;
}
.drawer_footer {
  display: flex;
  position: absolute;
  bottom: 100px;
  width: 100%;
}
.drawer_footer_item {
  flex: 1;
}
</style>

<script>
export default {
  name: "StudentMannager",

  created: function() {
    this.toPage(1);
  },
  methods: {
    // 获取当前页
    handelCurrentChange(event) {
      console.log(event);
      this.toPage(event);
    },
    // 去pn页查询分页信息
    toPage(pn) {
      this.loading = true;
      axios
        .get(this.$baseUrl + "/admin/Student?pn=" + pn)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            this.pageInfo = res.data.extend.pageInfo;
            this.studentData = this.pageInfo.list;
            this.loading = false;
            this.pagination.total = this.pageInfo.total;
            this.pagination.currentPage = this.pageInfo.pageNum;
            this.pagination.pageSize = this.pageInfo.pageSize;
            console.log(this.pagination);

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
    // 更新学生信息
    handleUpdateStudent(row) {
      this.dialog = true;
      this.form = row;
    },
    // 删除学生信息
    handleDeleteStudent(index, row) {
      axios
        .get(this.$baseUrl + "admin/Delete/Student?account=" + row.account)
        .then(res => {
          if (res.data.code == 100) {
            // this.studentData.splice(index, 1);
            this.$message({
              showClose: true,
              message: "删除信息成功",
              type: "success",
              duration: 1000
            });
            this.toPage(this.pagination.currentPage);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm("确定要修改学生吗？")
        .then(_ => {
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            axios
              .post(this.$baseUrl + "admin/Update/Student", this.form)
              .then(res => {
                if (res.data.code == 100) {
                  this.loading = false;
                  this.$message({
                    showClose: true,
                    message: "修改信息成功",
                    type: "success",
                    duration: 1000
                  });
                } else {
                  this.$message({
                    showClose: true,
                    message: "修改信息失败",
                    type: "error",
                    duration: 1000
                  });
                }
              })
              .catch(err => {
                this.$message({
                  showClose: true,
                  message: "修改信息失败",
                  type: "error",
                  duration: 1000
                });
              });
          }, 1000);
        })
        .catch(_ => {});
    },
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },
    // 获取学生任课信息
    getCourse(row) {
      this.handleStudentAcc = row.account;
      console.log(row);
      axios
        .get(this.$baseUrl + "/admin/Course/Student?account=" + row.account)
        .then(res => {
          if (res.data.code == 100) {
            this.gridData = res.data.extend.list;
            this.dialogStudentVisible = true;
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
    // 删除学生任课信息
    handleDeleteStudentCourse(index, row) {
      console.log(row);

      axios
        .post(this.$baseUrl + "admin/Delete/StuCourse", {
          account: this.handleStudentAcc,
          courseId: row.id
        })
        .then(res => {
          let row = {
            account: ""
          };
          row.account = this.handleStudentAcc;
          this.getCourse(row);
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 模糊查询
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          console.log("search");
          this.loading = false;
          axios
            .get(this.$baseUrl + "/admin/Key/Student?keyword=" + query)
            .then(res => {
              let students = res.data.extend.students;
              console.log(students);

              let options = [];

              students.forEach(element => {
                let item = {
                  name: "",
                  value: ""
                };
                item.name = element.name + "-" + element.account;
                item.value = element.account;
                options.push(item);
              });
              console.log(options);

              this.options = options;
            })
            .catch(err => {
              console.error(err);
            });
        }, 600);
      } else {
        this.options = [];
      }
    },
    // 精确查询
    getStudentByKey(){
       if (this.value == "") {
        this.$message({
          showClose: true,
          message: "查询内容不能为空",
          type: "warning",
          duration: 1000
        });
        return;
      }
      let strs = this.value.split("-");
      let account = strs[strs.length-1];
      axios.get(this.$baseUrl + "admin/Account/Student?account="+account)
      .then(res => {
        let list = [];
        list.push(res.data.extend.student);
        this.studentData = list;
        console.log(res)
      })
      .catch(err => {
        console.error(err); 
      })
      if(this.value == '' || this.options)
      console.log(this.value);
       
    }
   
  },

  data() {
    return {
      // 学生列表
      studentData: [],
      // 加载框
      loading: false,
      // 列表
      gridData: [],
      // 当前操作的学生账号
      handleStudentAcc: -1,
      // 外层模态框
      dialogStudentVisible: false,
      // 内层模态框
      innerVisible: false,
      // 返回学生分页信息
      pageInfo: "",
      // 分页信息
      pagination: {
        total: 1,
        currentPage: 1,
        pageSize: 1
      },
      // 抽屉打开状态
      dialog: false,
      // 抽屉内表单
      form: {
        account: "",
        name: "",
        pwd: "",
        college: ""
      },
      formLabelWidth: "80px",
      timer: null,
      //    信息校验
      rules: {
        name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
        name: [{ required: true, message: "请输入学生专业", trigger: "blur" }],
        name: [{ required: true, message: "请输入学生密码", trigger: "blur" }]
      },
      // 搜索
      options: [],
      value: ''
    };
  }
};
</script>

