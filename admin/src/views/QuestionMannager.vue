<template>
  <div>
    <el-select
      style="width:80%;"
      v-model="value"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <el-button @click="getStudentByKey()" type="primary" style="margin-left: 16px;">查询</el-button>
    <!-- 表格信息 -->
    <el-table v-loading="loading" :data="questionList" border style="width: 100%" row-key="id">
      >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="userName" label="姓名" min-width="10%" align="center"></el-table-column>
      <el-table-column prop="courseName" label="科目" min-width="10%" align="center"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="10%" align="center"></el-table-column>
      <el-table-column  label="发布时间" min-width="10%" align="center">
        <template slot-scope="scope">{{ scope.row.upTime | formatTimer }}</template>    
      </el-table-column>
      <el-table-column label="操作" min-width="10%">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            @click="handleOpenUpdate(scope.row)"
            type="primary"
            size="small"
          >编辑</el-button>
          <el-button
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <el-dialog title="修改问题信息" :visible.sync="dialogVisible" width="30%">
      <h5 style="text-align:left">问题标题：</h5>
      <el-input v-model="question.title" placeholder="请输入内容"></el-input>
      <el-divider></el-divider>
      <h5 style="text-align:left">问题内容：</h5>
      <div>
        <rich-text-editor :text="question.detail" @editorChange="editorChange"></rich-text-editor>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateQuestion()">确 定</el-button>
      </span>
    </el-dialog>
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
import richTextEditor from "../components/richTextEditor";
export default {
  name: "QuestionMannager",
  components: {
    richTextEditor
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      pagination: {
        total: 1,
        currentPage: 1,
        pageSize: 1
      },
      questionList: [],
      // 搜索
      input: "",
      question: "",
      value: "",
      options: ""
    };
  },
  created: function() {
    this.toPage(1);
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
    // 获取当前页
    handelCurrentChange(event) {
      console.log(event);
      this.toPage(event);
    },
    // 去pn页查询分页信息
    toPage(pn) {
      this.loading = true;
      this.$baseAxios
        .get(this.$baseUrl + "/admin/questionList/" + pn)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            let pageInfo = res.data.extend.pageInfo;
            this.pagination.total = pageInfo.total;
            this.pagination.currentPage = pageInfo.current;
            this.pagination.pageSize = pageInfo.size;
            this.questionList = pageInfo.records;
            this.loading = false;
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

    // handleSearchQuestion(pn) {
    //   this.$baseAxios
    //     .get(this.$baseUrl + "/admin/questionList/keyword/" + this.input+"/"+pn)
    //     .then(res => {
    //       console.log(res);

    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // },
    // 模糊查询
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          console.log("search");
          this.loading = false;
          this.$baseAxios
            .get(this.$baseUrl + "/admin/questionList/keyword/" + query)
            .then(res => {
              let questionList = res.data.extend.questionList;
              console.log(questionList);

              let options = [];

              questionList.forEach(element => {
                let item = {
                  name: "",
                  id: ""
                };
                item.name =
                  element.title +
                  " - " +
                  element.userName +
                  " - " +
                  element.courseName +
                  " - " +
                  this.$options.filters["formatTimer"](element.upTime);
                item.id = element.id;
                options.push(item);
              });
              console.log(options);

              this.options = options;
            })
            .catch(err => {
              console.error(err);
            });
        }, 1000);
      } else {
        this.options = [];
      }
    },
    // 精确查询
    getStudentByKey() {
      if (this.value == "") {
        this.$message({
          showClose: true,
          message: "查询内容不能为空",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$baseAxios
        .get(this.$baseUrl + "/admin/question/" + this.value)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            let item = res.data.extend.question;
            let newQuestionList = [];
            newQuestionList.push(item);
            this.questionList = newQuestionList;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    handleOpenUpdate(item) {
      this.question = item;
      this.dialogVisible = true;
    },
    handleUpdateQuestion() {
      this.$baseAxios
        .put(this.$baseUrl + "/admin/question", this.question)
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
    // 富文本改变事件
    editorChange(html) {
      this.detail = html;
    },
    handleDelete(item) {
      let id = item.id;
      this.$baseAxios
        .delete(this.$baseUrl + "/admin/question/" + id)
        .then(res => {
          if (res.data.code == 100) {
            this.$message({
              showClose: true,
              message: "问题删除成功",
              type: "success",
              duration: 1000
            });
            this.dialogVisible = false;
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
    }
  }
};
</script>

