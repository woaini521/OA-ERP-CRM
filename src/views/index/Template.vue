<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <el-row :gutter="20" style="margin-top:10px">
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>激励榜</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="jili">查看</el-button>
          </div>
          <el-table :data="tableDate" height="300">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="分数" prop="score" sortable></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>请假</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="qingjia">查看</el-button>
          </div>
          <el-table :data="tableDate_Q" height="300">
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="类型">
              <template slot-scope="scope">
                <span>{{ scope.row.leave_type.leave_type_text }}</span>
              </template>
            </el-table-column>
            <el-table-column label="进度">
              <template slot-scope="scope">
                <span>{{scope.row.leave_flow.leave_flow_text}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
          </div>
          <div v-for="o in 8" :key="o" class="text item">{{'列表内容 ' + o }}</div>
        </el-card>
      </el-col>-->
    </el-row>

    <!-- <el-row style="margin-top:20px">
      <el-carousel :interval="4000" type="card" height="350px">
        <el-carousel-item v-for="item in 6" :key="item">
          <h3 class="medium" style=" text-align: center">大展宏图 一展伟业</h3>
        </el-carousel-item>
      </el-carousel>
    </el-row> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      tableDate: [],
      tableDate_Q: []
    };
  },
  methods: {
    ...mapActions("customerList", ["triggerReplaceId"]),
    ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
    gettableDate() {
      this.axios.get("/oa.Days/reward_count").then(res => {
        this.tableDate = res.data;
      });
    },
    jili() {
      this.$router.push({ path: "/oa/Days/reward_select" });
      let ins1 = {
        route: `/oa/Days/reward_select`,
        name: "激励列表"
      };
      let ins2 = `/oa/Days/reward_select`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },

    gettableDate_Q() {
      this.axios.get("/oa.Days/leave_select").then(res => {
        this.tableDate_Q = res.data.data.data;
      });
    },
    qingjia(){
      this.$router.push({ path: "/oa/Days/leave_select" });
      let ins1 = {
        route: `/oa/Days/leave_select`,
        name: "请假外出"
      };
      let ins2 = `/oa/Days/leave_select`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    }
  },
  created() {
    this.gettableDate();
    this.gettableDate_Q();
  }
};
</script>
<style lang="less" scoped>
.box {
  padding-right: 3px;
  overflow: hidden;
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 100%;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 350px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
}
</style>
