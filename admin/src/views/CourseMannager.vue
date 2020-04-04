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
    <el-button @click="getCourseByKey" type="primary" style="margin-left: 16px;">查询</el-button>
    <!-- 表格信息 -->
    <el-table v-loading="loading" :data="courseData" border style="width: 100%" row-key="id">
      >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="姓名" min-width="!4%" align="center"></el-table-column>
      <el-table-column prop="detail" label="详情" min-width="!4%" align="center"></el-table-column>
      <el-table-column label="操作" min-width="!4%">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            @click="handleUpdateCourse(scope.row)"
            type="primary"
            size="small"
          >编辑</el-button>
          <el-button
            icon="el-icon-delete"
            @click="handleDeleteCourse(scope.$index,scope.row)"
            type="danger"
            size="small"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
    <!-- 抽屉信息 -->
    <el-drawer
      title="更新课程信息"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form">
          <el-form-item label="课程id" :label-width="formLabelWidth">
            <el-input disabled v-model="form.id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="课程名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="课程信息" :label-width="formLabelWidth">
            <el-input v-model="form.detail" autocomplete="off"></el-input>
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
  name: "CourseMannager",

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
      this.$baseAxios
        .get(this.$baseUrl + "/admin/Course?pn=" + pn)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            this.pageInfo = res.data.extend.pageInfo;
            let courseList = this.pageInfo.list;
            courseList.forEach(element => {
              element.hasChildren = true;
            });
            this.courseData = courseList;
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
    // 更新课程信息
    handleUpdateCourse(row) {
      this.dialog = true;
      this.form = row;
    },
    // 删除课程信息
    handleDeleteCourse(index, row) {
      this.$baseAxios
        .get(this.$baseUrl + "/admin/Delete/Course?id=" + row.id)
        .then(res => {
          if (res.data.code == 100) {
            // this.courseData.splice(index, 1);
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
      this.$confirm("确定要修改课程吗？")
        .then(_ => {
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            this.$baseAxios
              .post(this.$baseUrl + "/admin/Update/Course", this.form)
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

    // 模糊查询
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          console.log("search");
          this.loading = false;
          this.$baseAxios
            .get(this.$baseUrl + "/admin/Key/Course?keyword=" + query)
            .then(res => {
              let courses = res.data.extend.courses;
              console.log(courses);

              let options = [];

              courses.forEach(element => {
                let item = {
                  name: "",
                  value: ""
                };
                item.name = element.name + "-" + element.detail+"-"+element.id;
                item.value = element.id;
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
    getCourseByKey() {
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
      let id = strs[strs.length - 1];
      this.$baseAxios
        .get(this.$baseUrl + "/admin/Id/Course?id=" + id)
        .then(res => {
          if (res.data.extend.course == null || res.data.extend.course == "") {
            this.$message({
              showClose: true,
              message: "查询内容为空",
              type: "warning",
              duration: 1000
            });
          } else {
            let list = [];
            list.push(res.data.extend.course);
            this.courseData = list;
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
      // 课程列表
      courseData: [],
      // 课程任课列表
      gridData: [],
      // 当前操作的课程账号
      handleCourseAcc: -1,
      // 外层模态框
      dialogCourseVisible: false,
      // 内层模态框
      innerVisible: false,
      // 加载框
      loading: false,
      // 返回课程分页信息
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
        id: "",
        name: "",
        detail: ""
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

