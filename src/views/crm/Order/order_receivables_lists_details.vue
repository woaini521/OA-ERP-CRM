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
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="deteles(scope.row)" size="mini" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <label>认款信息</label>
        <el-table :data="F_data" style="margin-top:20px">
            <el-table-column label="客户" prop="customer_name"></el-table-column>
            <el-table-column label="总销售额" prop="total_price"></el-table-column>
            
            <el-table-column label="已开发票金额" prop="invoice_amount"></el-table-column>
            <el-table-column label="认款额">
                <template slot-scope="scope">
                    <el-input type="Number" v-model="scope.row.receivables_amount" @change ="zhi(scope.row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="销售员" prop="user_name">
                <template slot-scope="scope">
                    <span>{{ scope.row.dep_title }}/{{ scope.row.user_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="props">
                    <el-button size="mini" @click="shanchu(props.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" @click="add" style="margin-top:20px;margin-bottom: 20px;">确认提交</el-button> 
        <br> 
        <label>认款订单</label> 
        <div style="margin-top:20px;">
              <label>筛选：</label>
              <el-input v-model="name" clearable placeholder="客户名称" style="width:130px;margin-left:10px"></el-input>
              <el-input v-model="money" clearable placeholder="金额" style="width:130px;margin-left:10px"></el-input>
              <el-select v-model="company" style="margin-left:10px" clearable placeholder="请选择公司">
                <el-option
                v-for="item in option"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            <el-button style="margin-left:10px" @click="seach">确定</el-button>
        </div> 
        <el-table :data="tableProduct">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table :data="props.row.product_sku" style="margin-bottom:20px;">
                        <el-table-column  label="订单产品" >
                            <template slot-scope="scope">
                                <span>{{scope.row.class_name}}{{scope.row.sku_name}}</span>
                            </template> 
                        </el-table-column>
                        <el-table-column prop="total_price" label="销售金额"></el-table-column>  
                    </el-table>
                    <label>已认款信息</label>
                    <el-table :data="props.row.receivables_customer_order">
                        <el-table-column prop="customer_name" label="客户"></el-table-column>  
                        <el-table-column prop="money" label="已认款额"></el-table-column>
                        <el-table-column label="认领人" prop="user_name">
                            <template slot-scope="scope">
                                <span>{{ scope.row.dep_title }}/{{ scope.row.user_name }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column label="订单编号" prop="id" width="80"></el-table-column>
            <el-table-column label="订单日期" prop="sales_time" width="120"></el-table-column>
            <el-table-column label="客户" prop="customer_name"></el-table-column>
            <el-table-column label="总销售额" prop="total_price"></el-table-column>
            <el-table-column label="额外费用" prop="extra_price"></el-table-column>
            <el-table-column label="已开发票金额" prop="invoice_amount"></el-table-column>   
            <el-table-column label="认款额" prop="receivables_amount"></el-table-column>
            <el-table-column label="销售员" prop="user_name">
                <template slot-scope="scope">
                    <span>{{ scope.row.dep_title }}/{{ scope.row.user_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                    <el-button size="mini" @click="tianjia(scope.row)">认款</el-button>
                </template>
            </el-table-column>
        </el-table>
     
      <div class="block" style="margin-top: 10px;padding-bottom: 20px">
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
        status:['','微信','支付宝','银行卡'],
        tableData:[], // 客户信息
        //tablePiao:[], // 票 数据
        //multipleSelection:[], // 勾选发票
        tableProduct:[], // 产品 数据
        checkboxGroup:[], // 勾选产品
        currentPage:0,//当前页
        total:0,//总数
        per_page:0,//每页多少条
        last_page:0,//总页数
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
                this.currentPage = res.data.order.current_page;
                this.total = res.data.order.total;
                this.per_page = res.data.order.per_page;
                this.last_page = res.data.order.last_page;
                this.option = res.data.company;
                this.RK = res.data.receivables_customer_order
                loading.close();
            })
        },
        seach(){
            // const loading = this.$loading({
            //     lock: true,
            //     text: '拼命加载中',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.7)'
            // });
            this.axios.get('/crm.Order/order_receivables_add?id='+this.$route.params.id+'&name='+this.name+'&money='+this.money+'&supplier_id='+this.company).then(res => {
                this.tableProduct =  res.data.order.data;
                this.currentPage = Number(res.data.order.current_page);
                this.total = Number(res.data.order.total);
                this.per_page = Number(res.data.order.per_page);
                this.last_page = Number(res.data.order.last_page);
                //loading.close();
            })
        },
        handleCurrentChange(value){
            // const loading = this.$loading({
            //     lock: true,
            //     text: '拼命加载中',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.7)'
            // });
            this.axios.get('/crm.Order/order_receivables_add?id='+this.$route.params.id+'&page='+value+'&name='+this.name+'&money='+this.money+'&supplier_id='+this.company).then(res => {
                this.tableProduct = res.data.order.data;
                this.currentPage = Number(res.data.order.current_page);
                this.total = Number(res.data.order.total);
                this.per_page = Number(res.data.order.per_page)
                this.last_page = Number(res.data.order.last_page)
                //loading.close();
            })
        },
        //提交 
        add(){
            let nihao = [];
            if(this.F_data.length !== 0){
                for(let z = 0;z<this.F_data.length;z++){
                    let ID = this.F_data[z].id;
                    let receivables_amount = this.F_data[z].receivables_amount;
                    let productShuju = {
                        id:ID,
                        receivables_amount:receivables_amount,
                    } 
                    nihao.push(productShuju);
                }
                //console.log(nihao)
                this.axios.post('/crm.Order/order_receivables_add',{
                    id:this.$route.params.id,
                    order:nihao
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.F_data = [];
                        //this.getshuju();
                        // this.triggerDeleteTabs(this.$route.path);
                        // this.$router.push({ path: "/crm/Order/order_receivables_lists" });
                         this.axios.get('/crm.Order/order_receivables_add?id='+this.$route.params.id).then(res => {
                            this.RK = res.data.receivables_customer_order
                        })
                    }else{
                        this.open(res.data.msg,'error');
                    }
                }) 
            }else{
                this.open('未选择认款','error');
            }
        },
        deteles(a){
            this.axios.post('/crm.Order/order_receivables_delete',{
                    receivables_id:a.receivables_id,
                    customer_order_id:a.customer_order_id,
            }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.getshuju();
                    }else{
                        this.open(res.data.msg,'error');
                    }
            }) 
        },
        // 
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },


        tianjia(a){
           this.F_data.push(a);
           this.F_data = this.unique(this.F_data);
        },
        shanchu(a){
            let index = 0;
            for (let option of this.F_data) {
                if (option.id === a.id) {
                    break;
                }
                index++;
            }
            this.F_data.splice(index, 1);
        },
        zhi(val){
            if(Number(val.receivables_amount)>Number(val.total_price)){
                val.receivables_amount = val.total_price
            }
        },
        
        unique(arr) {
            const res = new Map();
            return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id))
        },
        open(a,b){
            this.$message({
                message: a,
                type: b
            });
        },
    },
    activated(){
        this.F_data = [];
        this.RK = [];
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
