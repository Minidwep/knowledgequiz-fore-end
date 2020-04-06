<template>
  <div>
    <el-card v-for="item in rewordList" :key="item.id" shadow="hover" class="question-item">
      <div style="width:100%;height:100%">
        <el-row style="font-size:14px">
          <p>{{item.detail}}</p>
          <span>发布者：{{item.teaName}}</span>
        </el-row>
      </div>
    </el-card>
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
.center {
  text-align: center;
}
</style>

<script>
export default {
  name: "Reword",
  created() {
    this.initRewordList(1);
  },
  data() {
    return {
      rewordList: [],
      // 分页信息
      pagination: {
        total: 1,
        currentPage: 1,
        pageSize: 1
      }
    };
  },
  computed: {},
  methods: {
    // 查看奖励
    initRewordList(pn) {
      let account = this.$store.state.account;
      this.$baseAxios
        .get(this.$baseUrl + "/student/reword/account/" + account + "/" + pn)
        .then(res => {
          if (res.data.code == 100) {
            let pageInfo = res.data.extend.pageInfo;
            this.pagination.total = pageInfo.total;
            this.pagination.currentPage = pageInfo.current;
            this.pagination.pageSize = pageInfo.size;
            this.rewordList = pageInfo.records;
          }
          console.log(res);
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

