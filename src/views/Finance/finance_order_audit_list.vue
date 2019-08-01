<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
    <div class="box_head">
      <label>筛选：</label>
      <el-input v-model="value" placeholder="业务员" style="width:217px"></el-input>
      <el-input v-model="value1" placeholder="客户" style="width:217px;margin-left:20px;"></el-input>
      <el-date-picker v-model="value2" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="margin-left:20px;"></el-date-picker>
      <el-button @click="seach" style="margin-left:20px;">搜索</el-button>
    </div>

    <div class="box_content">
      <el-table
        :data="tableData"
        style="width: 100%;"
      >
        <el-table-column
          prop="id"
          label="订单编号" 
        >
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="业务员"
        >
        </el-table-column>
        <el-table-column
          prop="customer_name"
          label="客户姓名"
        >
        </el-table-column>
        <el-table-column
          prop="sales_time"
          label="销售日期"
        >
        </el-table-column>
        <el-table-column
          prop="total_price"
          label="销售金额"
        >
        </el-table-column>

        <el-table-column
          prop="invoice_type"
          label="预计利润"
        >
          <template slot-scope="scope">
            <span>{{ Number(scope.row.total_price) - Number(scope.row.total_cost_price)- Number(scope.row.user_price) - Number(scope.row.logistics_price) | keepTowNum}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
              <span v-if="scope.row.status == 10">审核通过</span>
              <span v-if="scope.row.status == 1"> 审核中</span>
              <el-tooltip v-if="scope.row.status == 9" class="item" effect="dark" :content="scope.row.status_txt" placement="top-start">
                <span style="color:#409EFF">审核拒绝</span>
              </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="发票"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="渠道"
        >
        </el-table-column>

        <el-table-column  label="操作">
          <template  slot-scope="scope">
            <el-button @click="examine(scope.row)" type="primary" size="small">{{scope.row.status == 1?'审核':'查看'}}</el-button>
          </template>  
        </el-table-column>
      </el-table>

      <div class="block" style="margin-top: 10px;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="per_page"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions } from "vuex";
import { watch } from 'fs';

export default {
  filters:{
      keepTowNum:function(value){
        value = Number(value);
        return value.toFixed(2)
      }
    },
  data() {
    return {
      value:'',
      value1:'',
      value2:['',''],

      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "人保财险",
          label: "人保财险"
        },
        {
          value: "人保寿险",
          label: "人保寿险"
        },
        {
          value: "中国人寿",
          label: "中国人寿"
        },
        {
          value: "中国太平",
          label: "中国太平"
        },
        {
          value: "新华保险",
          label: "新华保险"
        },
        {
          value: "阳光保险",
          label: "阳光保险"
        }
      ],
      options1: [
        {
          value: "1",
          label: "湖南"
        },
        {
          value: "2",
          label: "广西"
        },
        {
          value: "3",
          label: "上海"
        }
      ],
      options2: [
        {
          value: "1",
          label: "一级"
        },
        {
          value: "2",
          label: "二级"
        },
        {
          value: "3",
          label: "三级"
        }
      ],
      tableData:[], // 订单数据
      currentPage:0,//当前页
      total:0,//总数
      per_page:0,//每页多少条
      last_page:0//总页数
    };
  },
  methods: {
    // vuex tab显示
    ...mapActions("customerList", ["triggerReplaceId"]),
    ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
    // 修改订单
    examine(a){
      //alert(a.id);
      console.log(a.status);
      this.triggerReplaceId(a.id);
      this.$router.push({ path: `/Finance/auditDetails/${a.id}`,params:{userId:a.id,name:`/Finance/auditDetails/${a.id}`}});
      let ins1 = {
        route: `/Finance/auditDetails/${a.id}`,
        name: "订单审核详情",
        id: a.id
      };
      let ins2 = `/Finance/auditDetails/${a.id}`;
      this.triggerAddTabs(ins1);
      this.triggerSetActiveIndex(ins2);
    },
  
  
    getOrderList(){
      this.axios.get('/Finance/finance_order_audit_list').then(res => {
        this.tableData = res.data.order.data;
        this.currentPage = res.data.order.current_page;
        this.total = res.data.order.total;
        this.per_page = res.data.order.per_page;
        this.last_page = res.data.order.last_page;
      })
    },
    handleCurrentChange(val) {
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.axios.post('/Finance/finance_order_audit_list',{
            page:val,
            username:this.value,
            name:this.value1,
            start_time: this.value2[0],
            end_time: this.value2[1]
          }).then(res => {
          this.tableData = res.data.order.data;
          this.currentPage = res.data.order.current_page;
          this.total = res.data.order.total;
          this.per_page = res.data.order.per_page;
          this.last_page = res.data.order.last_page;
          loading.close();
          //console.log(this.customerListInfo)
        })  
      },
      seach(){
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.axios.post('/Finance/finance_order_audit_list',{
            username:this.value,
            name:this.value1,
            start_time: this.value2[0],
            end_time: this.value2[1]
          }).then(res => {
          this.tableData = res.data.order.data;
          this.currentPage = res.data.order.current_page;
          this.total = res.data.order.total;
          this.per_page = res.data.order.per_page;
          this.last_page = res.data.order.last_page;
          loading.close();
          //console.log(this.customerListInfo)
        })
      },
    // 公用弹窗
    open(a,b){
      this.$message({
        message: a,
        type: b
      });
    },
  },
  created(){
     this.getOrderList();
  },
  watch:{
    $route(to){
      this.getOrderList();
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  min-width: 890px;
  .box_head {
    margin-top: 20px;
  }
}
</style>
