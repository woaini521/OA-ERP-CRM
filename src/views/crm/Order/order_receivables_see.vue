<!-- 模板组件，用于模拟不同路由下的组件显示 -->
<template>
  <div class="box">
        <div class="box_content">
            <el-table :data="tableData" style="width: 100%;margin-bottom:20px">
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
                <el-table-column prop="payment_amount" label="金额"></el-table-column>
                <el-table-column prop="remarks" label="备注" ></el-table-column>
                <el-table-column prop="user_name" label="录入人" ></el-table-column>
            </el-table>
            <label>认款记录</label>
            <el-table :data="RK">
                <el-table-column prop="customer_order_id" label="订单编号"  width="80px"></el-table-column>  
                <el-table-column prop="customer_name" label="客户"></el-table-column>  
                <el-table-column prop="money" label="已认款额"></el-table-column>
                <el-table-column prop="add_time" label="认款时间"></el-table-column>
                <el-table-column label="认领人" prop="user_name">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dep_title }}/{{ scope.row.user_name }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

  export default {
    data () {
      return {
        status:['','微信','支付宝','银行卡'],
        tableData:[], // 客户信息
        //tablePiao:[], // 票 数据
        //multipleSelection:[], // 勾选发票
        tableProduct:[], // 产品 数据
        // 筛选
        option:[],
        name:'',
        money:'',
        company:'',
        F_data:[],
        RK:[],
      };
    },
    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex","triggerDeleteTabs"]),
        getshuju(){
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.get('/crm.Order/order_receivables_add?id='+this.$route.params.id).then(res => {
                this.tableData = [res.data.receivables]; 
                this.tableProduct = res.data.order.data;
                this.option = res.data.company;
                this.RK = res.data.receivables_customer_order
                loading.close();
            })
        },
    },
    activated(){
        if(this.$route.params.id){
            this.getshuju();
        }
    },
    // watch:{
    //     $route(to){
    //         if(!this.$route.params.id){

    //         }else{
    //             this.getshuju();
    //         }
    //     }
    // }
  }
</script>
<style scoped lang="less">
.box{
    padding-bottom: 20px;
    .box_content{
        padding-bottom: 20px;
    }
    .box_piao{
        margin-top: 20px;
        padding-bottom: 20px;
    }
    .box_product{
        padding-bottom: 10px;
        display: flex;
        flex-wrap:wrap;
        flex: 1;
        .product_inner{
            width: 43%;
            margin-left: 30px;
            border:1px solid #CCC;
            padding: 20px;
            margin-top: 20px;
        }
    }
}
</style>
