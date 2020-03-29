<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" :offset="3">
        <div class="grid-content bg-purple">
          <div class="teacher-uplod">
            <h3>上传教师信息</h3>
            <el-upload
              class="upload-demo"
              ref="uploadTeacher"
              multiple
              action="http://localhost:8080/admin/TeacherExcelUpload/"
              :headers="tokenHeader"
              :on-preview="handleTeacherPreview"
              :on-remove="handleTeacherRemove"
              :file-list="fileTeacherList"
              :on-success="handleTeacherSuccess"
              :on-error="handleTeacherError"
              :auto-upload="false"
              name="file"
            >
              <el-button slot="trigger" size="small" type="primary">选取Excel文件</el-button>
              <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="submitTeacherUpload"
              >上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，其余文件会失效！</div>
            </el-upload>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <div class="teacher-uplod">
            <h3>上传学生信息</h3>
            <el-upload
              class="upload-demo"
              ref="uploadStudent"
              multiple
              action="http://localhost:8080/admin/StudentExcelUpload/"
              :headers="tokenHeader"
              :on-preview="handleStudentPreview"
              :on-remove="handleStudentRemove"
              :file-list="fileStudentList"
              :on-success="handleStudentSuccess"
              :on-error="handleStudentError"
              :auto-upload="false"
              name="file"
            >
              <el-button slot="trigger" size="small" type="primary">选取Excel文件</el-button>
              <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="submitStudentUpload"
              >上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，其余文件会失效！</div>
            </el-upload>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <div class="teacher-uplod">
            <h3>上传课程信息</h3>
            <el-upload
              class="upload-demo"
              ref="uploadCourse"
              multiple
              action="http://localhost:8080/admin/CourseExcelUpload/"
              :headers="tokenHeader"
              :on-preview="handleCoursePreview"
              :on-remove="handleCourseRemove"
              :file-list="fileCourseList"
              :on-success="handleCourseSuccess"
              :on-error="handleCourseError"
              :auto-upload="false"
              name="file"
            >
              <el-button slot="trigger" size="small" type="primary">选取Excel文件</el-button>
              <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="submitCourseUpload"
              >上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，其余文件会失效！</div>
            </el-upload>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
export default {
  name: "InitSystem",

  data() {
    return {
      fileTeacherList: [],
      fileStudentList: [],
      fileCourseList: [],
      tokenHeader:{
        "Authorization":"Bearer "+this.$store.state.token
      }
    };
  },
  methods: {
    // --上传教师信息方法--
    submitTeacherUpload() {
      this.$refs.uploadTeacher.submit();
    },
    handleTeacherSuccess(response, file, fileList) {
      console.log(fileList);
      if (response.code == 100) {
        this.$message({
          showClose: true,
          message: "文件" + file.name + "插入数据成功",
          type: "success",
          duration: 1000
        });
      } else {
        file.status = "error";
        this.$message({
          showClose: true,
          message: "文件" + file.name + "插入数据失败",
          type: "error",
          duration: 1000
        });
      }
      console.log(response);
    },
    handleTeacherError(err, file, fileList) {
      file.status = "error";
      this.$message({
        showClose: true,
        message: "文件" + file.name + "插入数据失败",
        type: "error",
        duration: 1000
      });
    },
    handleTeacherRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleTeacherPreview(file) {
      console.log(file);
    },
    // --上传教师信息方法--

    // --上传学生信息方法--
    submitStudentUpload() {
      this.$refs.uploadStudent.submit();
    },
    handleStudentRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleStudentPreview(file) {
      console.log(file);
    },
    handleStudentSuccess(response, file, fileList) {
      console.log(file.name);
      if (response.code == 100) {
        this.$message({
          showClose: true,
          message: "文件" + file.name + "插入数据成功",
          type: "success",
          duration: 1000
        });
      } else {
        file.status = "error";
        this.$message({
          showClose: true,
          message: "文件" + file.name + "插入数据失败",
          type: "error",
          duration: 1000
        });
      }
    },
    handleStudentError(err, file, fileList) {
      this.$message({
        showClose: true,
        message: "文件" + file.name + "插入数据失败",
        type: "error",
        duration: 1000
      });
    },
    // --上传学生信息方法--

    // --上传课程信息方法--
    submitCourseUpload() {
      this.$refs.uploadCourse.submit();
    },
    handleCourseRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleCoursePreview(file) {
      console.log(file);
    },
    handleCourseSuccess(response, file, fileList) {
      console.log(file.name);
      if (response.code == 100) {
        this.$message({
          showClose: true,
          message: "文件" + file.name + "插入数据成功",
          type: "success",
          duration: 1000
        });
      } else {
        file.status = "error";
        this.$message({
          showClose: true,
          message: "文件" + file.name + "插入数据失败",
          type: "error",
          duration: 1000
        });
      }
    },
    handleCourseError(err, file, fileList) {
      this.$message({
        showClose: true,
        message: "文件" + file.name + "插入数据失败",
        type: "error",
        duration: 1000
      });
    }
    // --上传学生信息方法--
  }
};
</script>

