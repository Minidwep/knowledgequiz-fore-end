<template>
  <div id="app">
    <el-container style="height: 700px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu router :default-active="this.$route.path">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-message"></i>系统初始化
            </template>
            <el-menu-item index="/InitSystem">上传数据</el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>管理学生信息
            </template>
            <el-menu-item index="/StudentMannager">学生信息</el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>管理教师信息
            </template>
            <el-menu-item index="/TeacherMannager">教师信息</el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-setting"></i>管理教师信息
            </template>
            <el-menu-item index="/CourseMannager">教师信息</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <span>管理员</span>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      defaultActiveIndex: "/"
    };
  },
  created() {
    console.log(this.$route.path);
  },

  methods: {
    getRoutePath() {
      console.log(this.$route.path);
    }
  }
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>