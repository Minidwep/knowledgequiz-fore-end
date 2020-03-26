<template>
  <div>
    <div class="center">
      <h3>描述您的问题</h3>
    </div>
    <div class="form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="问题标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="问题分类" prop="courseId">
          <el-select v-model="ruleForm.courseId" placeholder="请选择问题分类">
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体内容">
          <rich-text-editor :text="ruleForm.detail" @editorChange="editorChange"></rich-text-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style>
.center {
  text-align: center;
}
</style>

<script>
// import { quillEditor } from "vue-quill-editor";
import richTextEditor from "../components/richTextEditor";
export default {
  name: "NewProblem",
  components: {
    richTextEditor
  },

  data() {
    return {
      // 授课列表
      courseList: [],
      editorOption: {},
      ruleForm: {
        title: "",
        courseId: "",
        detail: `<p>问题详情</p>`,
        account: this.$store.state.account
      },
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 105,
            message: "长度在 3 到 105 个字符",
            trigger: "blur"
          }
        ],
        courseId: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ]
      }
    };
  },

  created() {
    this.getCourseList();
  },

  methods: {
    editorChange(html) {
      console.log(html);

      this.ruleForm.detail = html;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$baseAxios
            .post(this.$baseUrl + "/teacher/question", this.ruleForm)
            .then(res => {
              if (res.data.code == 100) {
                this.$message({
                  showClose: true,
                  message: "提交问题成功",
                  type: "success",
                  duration: 1000
                });
                this.ruleForm.title = '',
                this.ruleForm.detail = ''
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 得到授课列表
    getCourseList() {
      this.$baseAxios
        .get(this.$baseUrl + "/teacher/teaCourse/"+this.$store.state.account)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            this.courseList = res.data.extend.courseList;
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

