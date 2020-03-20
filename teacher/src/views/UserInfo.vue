<template>
  <div>
    <div class="info-up">
      <el-row :gutter="20">
        <el-col :span="4">
          <img
            style="border-radius:500px;
            width: 100%;
            height: width;
            object-fit: cover;"
            src="https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3743111107,1940472030&fm=111&gp=0.jpg"
            alt="头像"
          />
        </el-col>
        <el-col :span="4" offset="2" align="left">
          <p>提问数：10</p>
          <p>回答数：11</p>
          <p>采纳数：12</p>
        </el-col>
        <el-col :span="10">
          <p></p>
        </el-col>
      </el-row>
    </div>
    <div class="info-body" style="margin-top:40px">
      <el-tabs tab-position="left">
        <el-tab-pane label="我的科目">我的科目</el-tab-pane>
        <el-tab-pane label="我的提问">我的提问</el-tab-pane>
        <el-tab-pane label="我的回答">我的回答</el-tab-pane>
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
  name: "UserInfo",
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>

