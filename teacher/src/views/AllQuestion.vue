<template>
  <div>
    <div id="demo" class="carousel slide" data-ride="carousel" style="width:100%;  ">
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
      <el-card
        v-for="item in questionList"
        :key="item.id"
        shadow="hover"
        class="question-item"
      >
        <div style="width:100%;height:100%" @click="handleAnswerQuestion(item)">
          <p class="question-head">{{item.title}}</p>
          <el-row style="color:#a3b7d3;font-size:12px">
            <el-col :span="3">
              <p>{{item.userName}}</p>
            </el-col>
            <el-col :span="5">
              <p>{{item.courseName}}</p>
            </el-col>
            <el-col :span="3" :offset="5">
              <p>{{item.upTime | formatTimer}}</p>
            </el-col>
            <el-col :span="3">
              <p>回答数：7</p>
            </el-col>
            <el-col :span="5">
              <p class="accept-ok">{{item.status =='2'?"已有最佳答案":"待解决"}}</p>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <div style="text-align:center">
      <el-pagination
        class="item-center"
        background
        layout="prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :current-page="pagination.currentPage"
        @current-change="handelCurrentChange($event)"
      ></el-pagination>
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
  data() {
    return {
      questionList: [],
      // 分页信息
      pagination: {
        total: 1,
        currentPage: 1,
        pageSize: 1
      }
    };
  },
  methods: {
    handleAnswerQuestion(item) {
     
      // this.$router.push( {path:'/QuestionInfo',query:{qid:qid}});
      this.$router.push({name:'QuestionInfo',params:{question:item}});
    },
    // 去pn页查询分页信息
    toPage(pn) {
      this.loading = true;
      axios
        .get(this.$baseUrl + "/teacher/questionList/" + "110002" + "/" + pn)
        .then(res => {
          console.log(res);
          if (res.data.code == 100) {
            let pageInfo = res.data.extend.pageInfo;
            this.pagination.total = pageInfo.total;
            this.pagination.currentPage = pageInfo.current;
            this.pagination.pageSize = pageInfo.size;
            this.questionList = pageInfo.records;
          
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
    // 获取当前页
    handelCurrentChange(event) {
      console.log(event);
      this.toPage(event);
    }
  }
};
</script>

