<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
      <div class="box_head">
           <label>筛选：</label>
           <el-input style="width:217px;"></el-input>
           <el-button type="primary" style="margin-left:20px;">搜索</el-button>
      </div>
      <div class="box_content">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="payment_time" label="汇款时间" width="150px"></el-table-column>
          <el-table-column prop="source" label="渠道">
              <template slot-scope="scope">
                  <span>{{status[scope.row.source]}}</span>
              </template>
          </el-table-column>  
          <el-table-column label="接收帐号" >
                <template slot-scope="scope">
                    <span>{{scope.row.receiving_name}}:{{scope.row.receiving_account}}</span>
                </template>
          </el-table-column>
          <el-table-column prop="payment_amount" label="金额" ></el-table-column>
          <el-table-column prop="remarks" label="备注" ></el-table-column>
          <el-table-column prop="user_name" label="录入人" ></el-table-column>
          <el-table-column label="状态" >
              <template  slot-scope="scope">
                <span v-if="scope.row.status == 0">认款中</span>  
                <span v-if="scope.row.status == 5">已认款</span> 
           </template>
          </el-table-column>
          <el-table-column label="操作" >
            <template  slot-scope="scope">
                <el-button v-if="scope.row.status == 0" type="primary" @click="renkuan(scope.row)" plain size="small">认款</el-button>  
                <el-button v-if="scope.row.status == 5" type="primary" @click="seekuan(scope.row)" plain size="small">查看认款</el-button> 
           </template>
          </el-table-column>
        </el-table>
      </div>
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
</template>

<script>
import { mapActions } from "vuex";

  export default {
    data () {
      return {
          status:['支付宝','微信','银行卡'],
          tableData:[],
          currentPage:0,//当前页
          total:0,//总数
          per_page:0,//每页多少条
          last_page:0,//总页数
      };
    },
    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        renkuan(a){
            //alert(a.id);
            this.triggerReplaceId(a.id);
            this.$router.push({ path: `/crm/Order/order_receivables_lists_details/${a.id}`,params:{userId:a.id,name:`/crm/Order/order_receivables_lists_details/${a.id}`}});
            let ins1 = {
                route: `/crm/Order/order_receivables_lists_details/${a.id}`,
                name: "认款详情",
                id: a.id
            };
            let ins2 = `/crm/Order/order_receivables_lists_details/${a.id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },
        // 查看
        seekuan(a){
          this.triggerReplaceId(a.id);
            this.$router.push({ path: `/crm/Order/order_receivables_see/${a.id}`,params:{userId:a.id,name:`/crm/Order/order_receivables_see/${a.id}`}});
            let ins1 = {
                route: `/crm/Order/order_receivables_see/${a.id}`,
                name: "查看认款详情",
                id: a.id
            };
            let ins2 = `/crm/Order/order_receivables_see/${a.id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },
        gettableData(){
            this.axios.get('/crm.Order/order_receivables_lists').then(res => {
               this.tableData = res.data.receivables.data;
                this.currentPage = res.data.receivables.current_page;
                this.total = res.data.receivables.total;
                this.per_page = res.data.receivables.per_page;
                this.last_page = res.data.receivables.last_page;
            })
        },
         // 分页切换
        handleCurrentChange(val) {
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/Finance/finance_receivables_lists',{
                page:val,
            }).then(res => {
                this.tableData = res.data.receivables.data;
                this.currentPage = res.data.receivables.current_page;
                loading.close();
            })  
        },
    },
    created(){
        this.gettableData();
    },
    watch:{
        $route(to){
           this.gettableData();
        }
    }
  }
</script>
<style scoped lang="less">
  .box{
    .box_head{
      margin-top: 20px;
    }
  }
</style>
