<template>
    <div class="box">
        <div class="box_head">
            <label>筛选：</label>
            <el-select v-model="value" filterable clearable placeholder="请选择">
                <el-option label="全部" value="">
                </el-option>
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-input v-model="value1" clearable style="width:217px;margin-left: 20px" placeholder="请输入业务员"></el-input>
            <el-input v-model="value2" clearable style="width:217px;margin-left: 20px" placeholder="请输入客户"></el-input>
            <el-button style="margin-left: 20px" type="primary" @click="seach">搜索</el-button>
        </div>
        <div class="box_content">
            <el-table :data="tableData">
                <el-table-column label="业务员" width="150px">
                    <template slot-scope="scope">
                        <span>{{scope.row.dep_title}}  {{scope.row.user_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="客户姓名" prop="customer_name"></el-table-column>
                <el-table-column label="收货人姓名" prop="address_name"></el-table-column>
                <el-table-column label="供应商名称" prop="supplier_name"></el-table-column>
                <el-table-column label="发货方式">
                    <template slot-scope="scope">
                        <span>{{ scope.row.payment == 1 ? '物流现付' : '物流到付'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否送货">
                    <template slot-scope="scope">
                        <span>{{ state[scope.row.delivery] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="收货日期" prop="delivery_time"></el-table-column>
                <el-table-column label="运费" prop="freight_price"></el-table-column>
                <el-table-column label="货物状态" prop="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0" style="color:red">等待发货</span>
                        <span v-if="scope.row.status == 3" style="color:blue">已经发货</span>
                        <span v-if="scope.row.status == 6">发货完成</span>
                        <span v-if="scope.row.status == 9">售后</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="145">
                    <template slot-scope="scope">
                        <el-button type="success" size="small" @click="Track(scope.row)">跟踪</el-button>
                        
                        <el-button type="primary" size="small" @click="deliver(scope.row)">发货</el-button>
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
    data(){
        return{
            // 筛选
            value:'',
            value1:'',
            value2:'',
            options: [], 
            // 数据
            tableData:[],
            currentPage:0,//当前页
            total:0,//总数
            per_page:0,//每页多少条
            last_page:0,//总页数
            state:['','上门','上楼','自提'], 
        }
    },
    methods:{
        // vuex tab显示
        ...mapActions("customerList", ["triggerReplaceId"]),
        ...mapActions("Tabs", ["triggerAddTabs", "triggerSetActiveIndex"]),
        // 获取table数据
        gettableData(){
            this.axios.get('/erp.Delivery/delivery_order_list').then(res => {
                this.options = res.data.company;
                this.tableData = res.data.purchase_product.data;
                this.currentPage = res.data.purchase_product.current_page;
                this.total = res.data.purchase_product.total;
                this.per_page = res.data.purchase_product.per_page;
                this.last_page = res.data.purchase_product.last_page;
            })
        },
        // 分页 
        handleCurrentChange(val) {
            const loading = this.$loading({
            lock: true,
            text: '拼命加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/erp.Delivery/delivery_order_list',{
                page:val,
                company_id:this.value,
                user_name:this.value1,
                customer_name:this.value2,
            }).then(res => {
                this.tableData = res.data.purchase_product.data;
                this.currentPage = res.data.purchase_product.current_page;
                this.total = res.data.purchase_product.total;
                this.per_page = res.data.purchase_product.per_page;
                this.last_page = res.data.purchase_product.last_page;
                loading.close();
            
            })  
        },
        //筛选
        seach(){
            const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.axios.post('/erp.Delivery/delivery_order_list',{
                company_id:this.value,
                user_name:this.value1,
                customer_name:this.value2,
            }).then(res => {
                this.tableData = res.data.purchase_product.data;
                this.currentPage = res.data.purchase_product.current_page;
                this.total = res.data.purchase_product.total;
                this.per_page = res.data.purchase_product.per_page;
                this.last_page = res.data.purchase_product.last_page;
                loading.close();
            })  
        },
        // 跟踪按钮
        Track(a){
            this.triggerReplaceId(a.id);
            this.$router.push({ path: `/erp/Delivery/Track/${a.supplier_id}/${a.customer_order_id}/${a.customer_order_purchase_id}`,params:{
                    name:`/erp/Delivery/Track/${a.supplier_id}/${a.customer_order_id}/${a.customer_order_purchase_id}`,
                    supplier_id:a.supplier_id,
                    customer_order_id:a.customer_order_id,
                    customer_order_purchase_id:a.customer_order_purchase_id,
                } 
            });
            let ins1 = {
                route: `/erp/Delivery/Track/${a.supplier_id}/${a.customer_order_id}/${a.customer_order_purchase_id}`,
                name: "订单跟踪",
                id: a.id
            };
            let ins2 = `/erp/Delivery/Track/${a.supplier_id}/${a.customer_order_id}/${a.customer_order_purchase_id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
        },
        // 发货按钮
        deliver(a){
            this.triggerReplaceId(a.id);
            this.$router.push({ path: `/erp/Delivery/deliver/${a.supplier_id}/${a.customer_order_id}/${a.customer_order_purchase_id}`,params:{
                    userId:a.id,
                    name:`/erp/Delivery/deliver/${a.supplier_id}/${a.customer_order_id}/${a.customer_order_purchase_id}`,
                    supplier_id:a.supplier_id,
                    customer_order_id:a.customer_order_id,
                    customer_order_purchase_id:a.customer_order_purchase_id,
                }
            });
            let ins1 = {
                route: `/erp/Delivery/deliver/${a.supplier_id}/${a.customer_order_id}/${a.customer_order_purchase_id}`,
                name: "发货",
            };
            let ins2 = `/erp/Delivery/deliver/${a.supplier_id}/${a.customer_order_id}/${a.customer_order_purchase_id}`;
            this.triggerAddTabs(ins1);
            this.triggerSetActiveIndex(ins2);
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
        this.gettableData();
    },
    watch:{
        $route(to){
           this.gettableData();
        }
    }
}
</script>

<style lang="less" scoped>
.box {
  min-width: 890px;
  .box_head {
    margin-top: 20px;
  }
}
</style>

