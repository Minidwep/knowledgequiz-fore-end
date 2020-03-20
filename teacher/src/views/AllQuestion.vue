<template>
  <div>
    <div id="demo" class="carousel slide" data-ride="carousel" style="width:100%">
      <!-- 指示符 -->
      <ul class="carousel-indicators">
        <li data-target="#demo" data-slide-to="0" class="active"></li>
        <li data-target="#demo" data-slide-to="1"></li>
        <li data-target="#demo" data-slide-to="2"></li>
      </ul>

      <!-- 轮播图片 -->
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img style="width:100%" src="https://static.runoob.com/images/mix/img_fjords_wide.jpg" />
        </div>
        <div class="carousel-item">
          <img style="width:100%" src="https://static.runoob.com/images/mix/img_nature_wide.jpg" />
        </div>
        <div class="carousel-item">
          <img style="width:100%" src="https://static.runoob.com/images/mix/img_mountains_wide.jpg" />
        </div>
      </div>

      <!-- 左右切换按钮 -->
      <a class="carousel-control-prev" href="#demo" data-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </a>
      <a class="carousel-control-next" href="#demo" data-slide="next">
        <span class="carousel-control-next-icon"></span>
      </a>
    </div>
    <div style="width:100%;margin-top:20px">
      <el-card shadow="hover" class="question-item">
        <div style="width:100%;height:100%" @click="handleAnswerQuestion()">
          <p class="question-head">什么是斐波那契数列？</p>
          <el-row :align="10" style="color:#a3b7d3;font-size:12px">
            <el-col :span="3">
              <p>王冠锐</p>
            </el-col>
            <el-col :span="5">
              <p>高等数学</p>
            </el-col>
            <el-col :span="3" offset="5">
              <p>2020 02 02</p>
            </el-col>
            <el-col :span="3">
              <p>回答数：7</p>
            </el-col>
            <el-col :span="4">
              <p class="accept-ok">已有最佳答案</p>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card shadow="hover" class="question-item">
        <p class="question-head">什么是斐波那契数列？</p>
        <el-row :align="10" style="color:#a3b7d3;font-size:12px">
          <el-col :span="3">
            <p>王冠锐</p>
          </el-col>
          <el-col :span="5">
            <p>高等数学</p>
          </el-col>
          <el-col :span="3" offset="5">
            <p>2020 02 02</p>
          </el-col>
          <el-col :span="3">
            <p>回答数：7</p>
          </el-col>
          <el-col :span="4">
            <p class="accept-ok">已有最佳答案</p>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div style="text-align:center">
      <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
    </div>
  </div>
</template>

<style>
.accept-ok {
  color: #67c23a;
}
.accept-no {
}
.question-item {
  margin-bottom: 10px;
}
</style>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
export default {
  name: "QuestionSort",

  created: function() {
    this.toPage(1);
  },
  data() {
    return {};
  },
  methods: {
    handleAnswerQuestion() {
      console.log(123);

      this.$router.push({ path: "/QuestionInfo" });
    }
  }
};
</script>

