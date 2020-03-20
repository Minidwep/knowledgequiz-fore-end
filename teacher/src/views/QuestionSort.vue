<template>
  <div>
    <el-tabs tab-position="left" >
      <el-tab-pane label="类型1">
        <el-card  class="question-item" shadow="hover">
          <el-row>
            <el-col :span="18">
              <p class="question-head">一二三四五一二三四五一二三四五一二三四五一二三四五</p>
            </el-col>
            <el-col :span="2" offset="1">
              <p class="question-head">王冠锐</p>
            </el-col>
            <el-col :span="3">
              <p class="question-head">2020-2-2</p>
            </el-col>
          </el-row>
        </el-card>
        <el-card   class="question-item"  shadow="hover">
          <el-row>
            <el-col :span="18">
              <p class="question-head">一二三四五一二三四五一二三四五一二三四五一二三四五</p>
            </el-col>
            <el-col :span="2" offset="1">
              <p class="question-head">王冠锐</p>
            </el-col>
            <el-col :span="3">
              <p class="question-head">2020-2-2</p>
            </el-col>
          </el-row>
        </el-card>
        <el-card   class="question-item"  shadow="hover">
          <el-row>
            <el-col :span="18">
              <p class="question-head">一二三四五一二三四五一二三四五一二三四五一二三四五</p>
            </el-col>
            <el-col :span="2" offset="1">
              <p class="question-head">王冠锐</p>
            </el-col>
            <el-col :span="3">
              <p class="question-head">2020-2-2</p>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="类型2">类型2</el-tab-pane>
      <el-tab-pane label="类型3">类型3</el-tab-pane>
      <el-tab-pane label="类型4">类型4</el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
.question-item{
  margin-bottom: 10px;
}
</style>

<script>
export default {
  name: "QuestionSort",

  created: function() {
    this.toPage(1);
  },
  methods: {},

  data() {
    return {};
  }
};
</script>

