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
    <el-button @click="getTeacherByKey" type="primary" style="margin-left: 16px;">查询</el-button>
    <!-- 表格信息 -->
    <el-table
      v-loading="loading"
      :data="teacherData"
      border
      style="width: 100%"
      row-key="id"
      @row-dblclick="getCourse"
    >
      >
      <el-table-column prop="account" label="职工号" min-width="!4%" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" min-width="!4%" align="center"></el-table-column>
      <el-table-column prop="title" label="职位" min-width="!4%" align="center"></el-table-column>
      <el-table-column prop="pwd" label="密码" min-width="!4%" align="center"></el-table-column>
      <el-table-column prop="research" label="教研室" min-width="!4%" align="center"></el-table-column>
      <el-table-column prop="acaDegree" label="学位" min-width="!4%" align="center"></el-table-column>
      <el-table-column label="操作" min-width="!4%">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            @click="handleUpdateTeacher(scope.row)"
            type="primary"
            size="small"
          >编辑</el-button>
          <el-button
            icon="el-icon-delete"
            @click="handleDeleteTeacher(scope.$index,scope.row)"
            type="danger"
            size="small"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 教师任课信息 -->
    <el-dialog title="授课信息" :visible.sync="dialogTeacherVisible">
      <el-table :data="gridData">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="name" label="课程名" width="150"></el-table-column>
        <el-table-column property="detail" label="详情"></el-table-column>
        <el-table-column label="操作" min-width="!4%">
          <template slot-scope="scope">
            <el-button
              class="item-center"
              icon="el-icon-delete"
              @click="handleDeleteTeacherCourse(scope.$index,scope.row)"
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
    <!-- 分页信息 -->
    <el-pagination
      class="item-center"
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page="pagination.currentPage"
      @current-change="handelCurrentChange($event)"
    ></el-pagination>

    <el-button @click="dialog = true" type="primary" style="margin-left: 16px;">点我打开</el-button>

    <!-- 抽屉信息 -->
    <el-drawer
      title="更新教师信息"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="职工号" :label-width="formLabelWidth">
            <el-input disabled v-model="form.account" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="教研室" :label-width="formLabelWidth">
            <el-input v-model="form.research" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="学位" :label-width="formLabelWidth">
            <el-input v-model="form.acaDegree" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="职位" :label-width="formLabelWidth">
            <el-input v-model="form.title" autocomplete="off"></el-input>
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
            @click="$refs.drawer.closeDrawer()"
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
  name: "TeacherMannager",

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
        .get(this.$baseUrl + "/admin/Teacher?pn=" + pn)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            this.pageInfo = res.data.extend.pageInfo;
            let teacherList = this.pageInfo.list;
            teacherList.forEach(element => {
              element.hasChildren = true;
            });
            this.teacherData = teacherList;
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
    // 更新教师信息
    handleUpdateTeacher(row) {
      this.dialog = true;
      this.form = row;
    },
    // 删除教师信息
    handleDeleteTeacher(index, row) {
      axios
        .get(this.$baseUrl + "admin/Delete/Teacher?account=" + row.account)
        .then(res => {
          if (res.data.code == 100) {
            // this.teacherData.splice(index, 1);
            this.$message({
              showClose: true,
              message: "删除信息成功",
              type: "success",
              duration: 1000
            });
            this.toPage(this.pagination.currentPage);
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

    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm("确定要修改教师吗？")
        .then(_ => {
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            axios
              .post(this.$baseUrl + "admin/Update/Teacher", this.form)
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
    // 获取教师任课信息
    getCourse(row) {
      this.handleTeacherAcc = row.account;
      console.log(row);
      axios
        .get(this.$baseUrl + "/admin/Course/Teacher?account=" + row.account)
        .then(res => {
          if (res.data.code == 100) {
            this.gridData = res.data.extend.list;
            this.dialogTeacherVisible = true;
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
    // 删除教师任课信息
    handleDeleteTeacherCourse(index, row) {
      console.log(row);

      axios
        .post(this.$baseUrl + "admin/Delete/TeaCourse", {
          account: this.handleTeacherAcc,
          courseId: row.id
        })
        .then(res => {
          let row = {
            account: ""
          };
          row.account = this.handleTeacherAcc;
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
            .get(this.$baseUrl + "/admin/Key/Teacher?keyword=" + query)
            .then(res => {
              let teachers = res.data.extend.teachers;
              console.log(teachers);

              let options = [];

              teachers.forEach(element => {
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
    getTeacherByKey() {
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
      let account = strs[strs.length - 1];
      axios
        .get(this.$baseUrl + "admin/Account/Teacher?account=" + account)
        .then(res => {
          if (
            res.data.extend.teacher == null ||
            res.data.extend.teacher == ""
          ) {
            this.$message({
              showClose: true,
              message: "查询内容为空",
              type: "warning",
              duration: 1000
            });
          } else {
            let list = [];
            list.push(res.data.extend.teacher);
            this.teacherData = list;
            console.log(res);
          }
        })
        .catch(err => {
          console.error(err);
        });
      if (this.value == "" || this.options) console.log(this.value);
    }
  },

  data() {
    return {
      // 教师列表
      teacherData: [],
      // 教师任课列表
      gridData: [],
      // 当前操作的教师账号
      handleTeacherAcc: -1,
      // 外层模态框
      dialogTeacherVisible: false,
      // 内层模态框
      innerVisible: false,
      // 加载框
      loading: false,
      // 返回教师分页信息
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
      // 搜索
      options: [],
      value: ""
    };
  }
};
</script>

