<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
      <div class="box_content">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="payment_time" label="汇款时间" ></el-table-column>
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
        </el-table>
      </div>
      <div class="box_piao">
          <label>发票信息</label>
          <el-table :data="tableProduct" ref="multipleTable">
                <el-table-column prop="rise" label="抬头" ></el-table-column>  
                <el-table-column prop="tax_number" label="票号" ></el-table-column>
                <el-table-column prop="money" label="金额" ></el-table-column>  
                <el-table-column prop="status" label="状态" ></el-table-column>
          </el-table>
      </div>
      <label>产品信息</label>  
      <div class="box_product">
          <div class="product_inner" v-for="item in tableProduct" :key="item.id">
                <p style="padding-bottom:10px;">
                    <span>客户名称：{{item.customer_name}} </span>
                    <span>客户电话：{{item.customer_working_phone}}</span>
                    <span>总销售额：{{item.total_price}} </span>
                </p>
                    <el-table :data="item.product_sku">
                            <el-table-column  label="订单产品" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.class_name}}{{scope.row.sku_name}}</span>
                                </template> 
                            </el-table-column>
                            <el-table-column prop="total_price" label="销售金额" ></el-table-column>  
                            <el-table-column  label="认款金额" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.money}}</span>
                                </template>    
                            </el-table-column>
                    </el-table> 
           </div> 
      </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

  export default {
    data () {
      return {
        status:['支付宝','微信','银行卡'],
        tableData:[], // 客户信息
        tablePiao:[], // 票 数据
        multipleSelection:[], // 勾选发票
        tableProduct:[], // 产品 数据
        checkboxGroup:[], // 勾选产品
      };
    },
    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex","triggerDeleteTabs"]),
        
        getshuju(){
            this.axios.get('/crm.Order/order_receivables_find?id='+this.$route.params.id).then(res => {
                this.tableData.push(res.data); 
              //  this.tablePiao = res.data.invoice.data; 
                this.tableProduct = res.data.order;
            })
        },
        
        // 
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
    },
    created(){
        this.getshuju();
    },
    watch:{
        $route(to){
            if(!this.$route.params.id){

            }else{
                this.getshuju();
            }
        }
    }
  }
</script>
<style scoped lang="less">
.box{
    padding-bottom: 20px;

    .box_piao{
        margin-top: 20px;
        padding-bottom: 20px;
    }
    .box_product{
        
        padding-bottom: 40px;
        overflow: hidden;
        .product_inner{
            width: 550px;
            float: left;
            margin-left: 40px;
            border:1px solid #CCC;
            padding: 20px;
            margin-top: 20px;
        }
    }
}
</style>
