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
          <el-table-column prop="payment_amount" label="金额"></el-table-column>
          <el-table-column prop="remarks" label="备注" ></el-table-column>
          <el-table-column prop="user_name" label="录入人" ></el-table-column>
        </el-table>
      </div>
      <!-- <div class="box_piao">
          <label>发票信息</label>
          <el-table :data="tablePiao" ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" label="选择"></el-table-column>
                <el-table-column prop="rise" label="抬头" ></el-table-column>  
                <el-table-column prop="tax_number" label="票号" ></el-table-column>
                <el-table-column prop="money" label="金额" ></el-table-column>  
                <el-table-column prop="status" label="状态" ></el-table-column>
          </el-table>
      </div> -->
      <label>产品信息</label> 
      <div style="margin-top:20px;">
              <label>筛选：</label>
              <el-input v-model="name" clearable placeholder="客户名称" style="width:217px;margin-left:10px"></el-input>
              <el-input v-model="money" clearable placeholder="金额" style="width:217px;margin-left:10px"></el-input>
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
      <div class="box_product">
          <div class="product_inner" v-for="item in tableProduct" :key="item.id">
                <p style="padding-bottom:10px;">
                    <span>客户名称：{{item.customer_name}} </span>
                </p>
                <p style="padding-bottom:10px;">
                    <span>总销售额：{{item.total_price}} </span>
                    <span style="margin-left:10px">额外费用：{{item.extra_price}} </span>
                    <span style="margin-left:10px">认款额：{{ Number(item.total_price) + Number(item.extra_price) }} </span>
                </p>
                <el-checkbox-group v-model="checkboxGroup">
                    <el-checkbox :label="item">选择 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>已认款金额:{{ item.receivables_money }}</span></el-checkbox>
                    <el-table :data="item.product_sku">
                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                    <el-form inline class="demo-table-expand"  v-if="scope.row.receivables != null">
                                        <el-form-item  v-for="(items,index) in scope.row.receivables" :key="items.id" :label="index+1">
                                            <span>{{ items.add_time }}已经认款{{ items.money }}元</span>
                                        </el-form-item>
                                    </el-form>
                                    <el-form v-else>
                                        <el-form-item label-position="left" inline class="demo-table-expand">
                                        <span>暂无认款记录</span>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column  label="订单产品" >
                                <template slot-scope="scope">
                                    <span>{{scope.row.class_name}}{{scope.row.sku_name}}</span>
                                </template> 
                            </el-table-column>
                            <el-table-column prop="total_price" label="销售金额"></el-table-column> 
                            <el-table-column  label="认款金额" >
                                <template slot-scope="scope">
                                    <!-- <span>{{scope.row.total_price}}</span> -->
                                    <el-input v-model="scope.row.money" :placeholder="scope.row.total_price"></el-input>
                                </template>    
                            </el-table-column>
                    </el-table> 
                </el-checkbox-group>
           </div>
           
      </div>
      <div class="block" style="margin-top: 10px;padding-bottom: 20px">
                <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="per_page"
                layout="total, prev, pager, next"
                :total="total">
                </el-pagination>
            </div>

      <el-button type="primary" @click="add">确认提交</el-button>
  </div>
</template>

<script>
import { mapActions } from "vuex";

  export default {
    data () {
      return {
        status:['支付宝','微信','银行卡'],
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
                loading.close();
            })
        },
        seach(){
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.get('/crm.Order/order_receivables_add?id='+this.$route.params.id+'&name='+this.name+'&money='+this.money+'&supplier_id='+this.company).then(res => {
                this.tableProduct =  res.data.order.data;
                this.currentPage = Number(res.data.order.current_page);
                this.total = Number(res.data.order.total);
                this.per_page = Number(res.data.order.per_page);
                this.last_page = Number(res.data.order.last_page);
                loading.close();
            })
        },
        handleCurrentChange(value){
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.get('/crm.Order/order_receivables_add?id='+this.$route.params.id+'&page='+value+'&name='+this.name+'&money='+this.money+'&supplier_id='+this.company).then(res => {
                this.tableProduct = res.data.order.data;
                this.currentPage = Number(res.data.order.current_page);
                this.total = Number(res.data.order.total);
                this.per_page = Number(res.data.order.per_page)
                this.last_page = Number(res.data.order.last_page)
                loading.close();
            })
        },
        //提交 
        add(){
            // let piao = [];
            let nihao = [];
            // for(let z = 0;z<this.multipleSelection.length;z++){
            //     let piao_id = {
            //         id:this.multipleSelection[z].id
            //     }
            //     piao.push(piao_id);
            // } 
            if(this.checkboxGroup.length !== 0){
                for(let z = 0;z<this.checkboxGroup.length;z++){
                    let checkboxGroupSku = this.checkboxGroup[z];
                    let checkboxGroupSkuProduct =  checkboxGroupSku.product_sku;
                    let productShu =[];
                    for(let y = 0; y < checkboxGroupSkuProduct.length; y++){
                            let productSkuShu = {
                                customer_order_product_sku_id:checkboxGroupSkuProduct[y].id,
                                money:checkboxGroupSkuProduct[y].money
                            }
                            productShu.push(productSkuShu);
                    } 
                   // console.log(productShu);
                    let productShuju = {
                        customer_order_id:checkboxGroupSku.id,
                        product_sku:productShu,
                    } 
                    nihao.push(productShuju);
                }
     
                this.axios.post('/crm.Order/order_receivables_add',{
                    id:this.tableData[0].id,
                    // invoice:piao,
                    order:nihao
                }).then(res => {
                    if(res.data.code == 2000){
                        this.open(res.data.msg,'success');
                        this.triggerDeleteTabs(this.$route.path);
                        this.$router.push({ path: "/crm/Order/order_receivables_lists" });
                    }else{
                        this.open(res.data.msg,'error');
                    }
                }) 
            }else{
                this.open('勾选产品','error');
            }
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
