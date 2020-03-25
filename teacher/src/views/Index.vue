<template>
  <div id="app" style="overflow-x:hidden;min-height:1000px">
    <el-container style="min-height:900px; border: 1px solid #eee">
      <el-header style="text-align: right; font-size: 12px ;height:40px">
        <span>欢迎你：王冠锐</span>
      </el-header>
      <el-row :gutter="20" style="margin-top:40px;margin-bottom:40px">
        <el-col :span="6" :offset="8">
          <!-- <el-select
            style="width:100%;"
            v-model="value"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-button type="success">搜索答案</el-button> -->
          <el-button type="primary" @click="toCreateProblem()">发布问题</el-button>
        </el-col>
      </el-row>

      <el-header style="text-align: right; font-size: 12px ;height:40px;">
        <el-row :gutter="20" style="background-color:#409eff;width:100%">
          <el-col :span="2" :offset="5" class="col-link">
            <el-button class="btn-link" type="text" @click="toAllQuestion()">首页</el-button>
          </el-col>
          <el-col :span="2" class="col-link">
            <el-button class="btn-link" type="text" @click="toQuestionSort()">问题分类</el-button>
          </el-col>
          <el-col :span="2" class="col-link">
            <el-button class="btn-link" type="text" @click="toQuestionMannager()">问题管理</el-button>
          </el-col>
          <el-col :span="2" class="col-link">
            <el-button class="btn-link" type="text">设置奖励</el-button>
          </el-col>
          <el-col :span="2" :offset="4" class="col-link">
            <el-button class="btn-link" type="text" @click="toGetUserInfo()">个人中心</el-button>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <el-row :gutter="20" style="width:100%">
          <el-col :span="14" :offset="5">
            <router-view></router-view>
          </el-col>
        </el-row>
      </el-main>
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
   
  },

  methods: {
    toCreateProblem() {
      this.$router.push({ path: "/NewProblem" });
    },
    toGetUserInfo() {
      this.$router.push({ path: "/UserInfo" });
    },
    toQuestionSort() {
      this.$router.push({ path: "/QuestionSort" });
    },
    toAllQuestion() {
      this.$router.push({ path: "/AllQuestion" });
    },
    toQuestionMannager() {
      this.$router.push({ path: "/QuestionMannager" });
    }
  }
};
</script>

<style>
.el-header {
  background-color: #fafafa;
  color: #333;
  line-height: 40px;
}
.btn-link {
  color: #ffffff !important;
  width: 100%;
}
.col-link {
  text-align: center;
}
.col-link:hover {
  background-color: #3283bb !important;
  cursor: pointer;
}
#app::-webkit-scrollbar {display:none}
</style>